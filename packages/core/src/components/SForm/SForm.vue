<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  provide,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import { useDefaults } from '../../composables'
import { formContextKey, type SFormFieldEntry } from '../../internal/formContext'
import type { SFormError, SFormProps, SFormSlotProps, SFormValidateResult } from './types'

const props = withDefaults(defineProps<SFormProps>(), { noErrorFocus: false })
const p = useDefaults(props, 'SForm')

const emit = defineEmits<{
  /** The form passed validation. Without a listener the form is submitted natively. */
  submit: [event: SubmitEvent]
  /** A submission failed validation. */
  invalid: [errors: SFormError[]]
  /** The form was reset; the errors are cleared on the next tick, after the app resets its data. */
  reset: [event: Event]
}>()

/**
 * Form validity: `true` when every field with rules is checked and valid, `false` when a field
 * shows an error, `null` while some field is unchecked. Read-only for the app: a written value
 * is replaced with the actual state.
 */
const valid = defineModel<boolean | null>({ default: null })

defineSlots<{
  /** Form content. Receives `{ valid, validating, errors, validate, resetValidation }`. */
  default?: (props: SFormSlotProps) => unknown
}>()

const vm = getCurrentInstance()
const formEl = useTemplateRef<HTMLFormElement>('form')
const fields = shallowRef<SFormFieldEntry[]>([])
// The parent's onMounted runs after the children's, so every initial field has registered by then.
const ready = ref(false)
onMounted(() => (ready.value = true))

provide(formContextKey, {
  validateOn: computed(() => p.validateOn),
  register: (entry) => {
    fields.value = [...fields.value, entry]
  },
  unregister: (entry) => {
    fields.value = fields.value.filter((field) => field !== entry)
  },
})

/**
 * Registration order follows mounting, not the page: focus and errors go in reading order.
 * Fields without an element go last, in registration order.
 */
function ordered(): SFormFieldEntry[] {
  return fields.value
    .map((field, index) => ({ field, index, el: field.el() }))
    .sort((a, b) => {
      if (a.el && b.el && a.el !== b.el) {
        return a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      }
      if (a.el && !b.el) return -1
      if (!a.el && b.el) return 1
      return a.index - b.index
    })
    .map(({ field }) => field)
}

function toError(field: SFormFieldEntry): SFormError {
  const message = field.errorMessage()
  return {
    id: field.id,
    name: field.name(),
    messages: message ? [message] : [],
  }
}

const errors = computed(() =>
  ordered()
    .filter((field) => field.errorMessage())
    .map(toError),
)
const validating = computed(() => fields.value.some((field) => field.validating()))
const state = computed<boolean | null>(() => {
  if (!ready.value) return null
  if (fields.value.some((field) => field.errorMessage())) return false
  if (validating.value) return null
  return fields.value.every((field) => !field.hasRules() || field.checked()) ? true : null
})

watch(
  [state, valid],
  ([actual, written]) => {
    if (written !== actual) valid.value = actual
  },
  { immediate: true },
)

async function validate(): Promise<SFormValidateResult> {
  const list = ordered()
  const results = await Promise.all(list.map((field) => field.validate()))
  const failed = list.filter((_, index) => !results[index]).map(toError)
  return { valid: failed.length === 0, errors: failed }
}

let submitRun = 0

function resetValidation() {
  // A pending submission must not report the fields it has just seen reset.
  submitRun++
  fields.value.forEach((field) => field.resetValidation())
}

// Emits are not in attrs, so the listener is read from the vnode, `.once` included.
function hasSubmitListener() {
  const listeners = vm?.vnode.props
  return Boolean(listeners?.onSubmit || listeners?.onSubmitOnce)
}

// Set while requestSubmit() replays a validated submission for the browser to perform.
let bypass = false

/**
 * requestSubmit() keeps what submit() drops: the submitter's name/value and its form* overrides.
 * The browser ignores it while the original submit event is still dispatching, and the
 * microtasks of sync rules run inside that dispatch, so the replay waits for a task.
 */
function submitNatively(submitter: HTMLElement | null, id: number) {
  setTimeout(() => {
    const form = formEl.value
    if (!form || id !== submitRun) return
    const own =
      submitter?.isConnected && (submitter as HTMLButtonElement).form === form ? submitter : null
    bypass = true
    try {
      form.requestSubmit(own)
    } finally {
      bypass = false
    }
  })
}

async function onSubmit(event: SubmitEvent) {
  if (bypass) {
    bypass = false
    return
  }
  event.preventDefault()
  const id = ++submitRun
  const result = await validate()
  // A newer submission or a reset came while this one awaited async rules.
  if (id !== submitRun) return
  if (!result.valid) {
    emit('invalid', result.errors)
    if (!p.noErrorFocus) {
      await nextTick()
      ordered()
        .find((field) => field.errorMessage())
        ?.focus()
    }
    return
  }
  if (hasSubmitListener()) emit('submit', event)
  else submitNatively(event.submitter, id)
}

function onReset(event: Event) {
  // The fields are v-model bound: a native reset would change the DOM behind the app's data.
  event.preventDefault()
  submitRun++
  emit('reset', event)
  void nextTick(resetValidation)
}

defineExpose({
  /** Checks every field; resolves to `{ valid, errors }`. */
  validate,
  /** Clears the errors of every field and drops a pending submission; values stay. */
  resetValidation,
})
</script>

<template>
  <form
    ref="form"
    class="s-form"
    novalidate
    @submit="onSubmit"
    @reset="onReset"
  >
    <slot
      :valid="state"
      :validating="validating"
      :errors="errors"
      :validate="validate"
      :reset-validation="resetValidation"
    />
  </form>
</template>

<style src="./SForm.scss" lang="scss"></style>
