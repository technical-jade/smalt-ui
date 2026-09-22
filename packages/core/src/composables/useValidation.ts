import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  readonly,
  ref,
  toValue,
  useId,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import { formContextKey, type SFormFieldEntry } from '../internal/formContext'
import { devWarn } from '../internal/dev'
import { useMessages, type SMessages } from './useLocale'

/** Result of a rule: `true` when the value passes, otherwise the error text. */
export type SRuleResult = true | string

/** What a rule receives besides the value. */
export interface SRuleContext {
  /** The library strings of the current locale: the default texts of the built-in rules. */
  messages: SMessages
}

/**
 * A validation rule: a function of the field value that returns `true` or the error text,
 * synchronously or as a Promise. Declared through a method so a rule typed for a narrower value
 * (`(v: string) => …`) still fits a field whose model is a union.
 */
export type SRule<T = unknown> = {
  bivarianceHack(value: T, ctx: SRuleContext): SRuleResult | PromiseLike<SRuleResult>
}['bivarianceHack']

/** When a field checks its rules. */
export type SValidateOn = 'blur' | 'input' | 'submit'

/** Validation props shared by the form fields. */
export interface SValidationProps<T> {
  /**
   * Validation rules: functions of the value that return `true` or the error text, run in
   * order until the first failure. See [Validation](/guide/validation).
   */
  rules?: SRule<T>[]
  /**
   * When the field checks its rules: `blur` (after the user leaves the field, then on every
   * change while an error is shown), `input` (on every change) or `submit` (only on form
   * submission and `validate()`). Overrides `validate-on` of `SForm`; `blur` by default.
   */
  validateOn?: SValidateOn
}

export interface UseValidationOptions<T> {
  /** The value the rules check. */
  value: MaybeRefOrGetter<T>
  /** Rules, run in order until the first failure. */
  rules?: MaybeRefOrGetter<readonly SRule<T>[] | undefined>
  /** When to check; falls back to the `SForm` setting, then to `blur`. */
  validateOn?: MaybeRefOrGetter<SValidateOn | undefined>
  /** An error set from outside (a server response); it wins over the rules. */
  error?: MaybeRefOrGetter<string | undefined>
  /** A disabled control is not checked and does not take part in the form. */
  disabled?: MaybeRefOrGetter<boolean | undefined>
  /** Field name, reported in the `SForm` errors. */
  name?: MaybeRefOrGetter<string | undefined>
  /** Moves focus to the control; `SForm` calls it for the first invalid field. */
  focus?: () => void
  /** Root element of the control: `SForm` orders fields by their place in the DOM. */
  el?: () => Element | null | undefined
}

export interface UseValidationReturn {
  /** The shown error: the external `error`, otherwise the text of the failed rule. */
  errorMessage: ComputedRef<string | undefined>
  /** Whether an error is shown. */
  invalid: ComputedRef<boolean>
  /** Whether an async rule is still running. */
  validating: Readonly<Ref<boolean>>
  /** Runs the rules now; resolves to `true` when the value is valid. */
  validate(): Promise<boolean>
  /** Clears the error; the field waits for the next trigger again. */
  resetValidation(): void
  /** Call when focus leaves the control. */
  onBlur(): void
}

function isThenable(value: unknown): value is PromiseLike<SRuleResult> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { then?: unknown }).then === 'function'
  )
}

/**
 * Validation state of one control. Library fields use it internally; call it in a custom control
 * to take part in `SForm`: pass the result's `errorMessage` to `SFormField` and call `onBlur`.
 */
export function useValidation<T>(options: UseValidationOptions<T>): UseValidationReturn {
  const form = inject(formContextKey, null)
  const messages = useMessages()

  const ruleError = ref<string>()
  const validating = ref(false)
  // Checked at least once since the last reset: the form counts such a field as settled.
  const checked = ref(false)
  let run = 0
  // The most recent validate() call's own promise; null right after a reset. A run that finds
  // itself stale defers to this instead of guessing its own outcome.
  let latestRun: Promise<boolean> | null = null

  const rules = () => toValue(options.rules) ?? []
  const disabled = computed(() => Boolean(toValue(options.disabled)))
  const mode = computed<SValidateOn>(
    () => toValue(options.validateOn) ?? form?.validateOn.value ?? 'blur',
  )
  const errorMessage = computed(() => toValue(options.error) || ruleError.value)
  const invalid = computed(() => Boolean(errorMessage.value))

  async function runRules(id: number): Promise<boolean> {
    // Disabled fields are not checked, no matter a manual `error`: it stays displayed, but
    // does not fail an explicit validate() call.
    if (disabled.value) {
      ruleError.value = undefined
      validating.value = false
      checked.value = true
      return true
    }

    const list = rules()
    if (list.length === 0) {
      ruleError.value = undefined
      validating.value = false
      checked.value = true
      return !errorMessage.value
    }

    const value = toValue(options.value)
    const ctx = { messages: messages.value }
    let failed: string | undefined
    for (const rule of list) {
      let raw: SRuleResult | PromiseLike<SRuleResult>
      try {
        raw = rule(value, ctx)
      } catch (error) {
        devWarn(`[useValidation] a rule threw: ${String(error)}`)
        raw = ctx.messages.ruleFailed
      }

      let result: SRuleResult
      if (isThenable(raw)) {
        validating.value = true
        try {
          result = await raw
        } catch (error) {
          devWarn(`[useValidation] a rule threw: ${String(error)}`)
          result = ctx.messages.ruleFailed
        }
        /**
         * A newer run started while this one awaited: adopt its outcome instead of guessing.
         * A reset in between leaves no newer run behind, and must never let a stale check
         * pass, so it resolves to false.
         */
        if (id !== run) return latestRun ?? false
      } else {
        result = raw
      }

      if (result !== true) {
        failed = typeof result === 'string' && result ? result : ctx.messages.ruleFailed
        break
      }
    }
    ruleError.value = failed
    validating.value = false
    checked.value = true
    return !errorMessage.value
  }

  function validate(): Promise<boolean> {
    const id = ++run
    const result = runRules(id)
    latestRun = result
    return result
  }

  function resetValidation() {
    run++
    latestRun = null
    ruleError.value = undefined
    validating.value = false
    checked.value = false
  }

  function onBlur() {
    if (mode.value !== 'submit' && !disabled.value) void validate()
  }

  watch(
    () => toValue(options.value),
    () => {
      if (disabled.value || rules().length === 0) return
      // Once an error is shown, every change re-checks, so the error goes as soon as it is fixed.
      if (mode.value === 'input' || ruleError.value) void validate()
    },
    { deep: true },
  )

  watch(disabled, (value) => {
    if (value) resetValidation()
  })

  if (form) {
    const entry: SFormFieldEntry = {
      id: useId(),
      name: () => toValue(options.name),
      el: () => options.el?.() ?? null,
      validate,
      resetValidation,
      focus: () => options.focus?.(),
      errorMessage: () => errorMessage.value,
      hasRules: () => rules().length > 0,
      checked: () => checked.value,
      validating: () => validating.value,
    }
    let mounted = false
    let registered = false
    // A disabled field leaves the form, so it neither blocks submission nor gets focused.
    const sync = () => {
      const wanted = mounted && !disabled.value
      if (wanted === registered) return
      registered = wanted
      if (wanted) form.register(entry)
      else form.unregister(entry)
    }
    onMounted(() => {
      mounted = true
      sync()
    })
    watch(disabled, sync)
    onBeforeUnmount(() => {
      mounted = false
      sync()
    })
  }

  return {
    errorMessage,
    invalid,
    validating: readonly(validating),
    validate,
    resetValidation,
    onBlur,
  }
}
