<script setup lang="ts">
import { computed, ref, useAttrs, useTemplateRef } from 'vue'
import { type MaskaDetail, type MaskInputOptions } from 'maska'
import { vMaska } from 'maska/vue'
import { SIcon } from '../SIcon'
import { useMessages } from '../../composables'
import {
  clampNumeric,
  createMaskEngine,
  createNumericMaskEngine,
  parseNumeric,
  toMaskaOptions,
  toNumericMaskaOptions,
  toTemplate,
} from './mask'
import type { SInputNumeric } from './types'

/**
 * Attributes and listeners not declared as props go to the `<input>` itself, not the root div:
 * otherwise `@blur` silently does nothing (blur does not bubble), and `maxlength`/`autocomplete`/
 * `inputmode` never reach the field.
 */
defineOptions({ inheritAttrs: false })

/**
 * Default internal branch of `SInput`: a native `<input>` in a flex frame with adornments.
 * Not public — used only from `SInput.vue`.
 */
const props = defineProps<{
  fieldId?: string
  labelId?: string
  label?: string
  floatingLabel?: boolean
  describedBy?: string
  invalid?: boolean
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  readonly?: boolean
  prefix?: string
  suffix?: string
  icon?: string
  iconRight?: string
  clearable?: boolean
  clearIcon?: string
  clearLabel?: string
  revealable?: boolean
  revealIcon?: string
  hideIcon?: string
  showPasswordLabel?: string
  hidePasswordLabel?: string
  mask?: string
  unmaskedValue?: boolean
  fillMask?: boolean | string
  numeric?: SInputNumeric
}>()

const slots = defineSlots<{
  prepend?: (props: Record<string, never>) => unknown
  append?: (props: Record<string, never>) => unknown
}>()

const model = defineModel<string>()
const m = useMessages()

const floating = computed(() => props.floatingLabel && !!props.label)
const hasLeading = computed(() => !!props.icon || !!props.prefix || !!slots.prepend)

const field = useTemplateRef<HTMLInputElement>('field')

// The clear button disappears with the value, and focus would go with it to body.
const clear = () => {
  model.value = ''
  field.value?.focus()
}

// Local on purpose: nothing outside drives the toggle, it only swaps the type of the same input.
const revealed = ref(false)
/**
 * Revealing is not an edit, so a readonly field keeps the toggle; a disabled one offers no
 * actions at all, like the clear button.
 */
const showReveal = computed(() => props.revealable && props.type === 'password' && !props.disabled)
const inputType = computed(() => (showReveal.value && revealed.value ? 'text' : props.type))
const revealLabel = computed(() =>
  revealed.value
    ? (props.hidePasswordLabel ?? m.value.hidePassword)
    : (props.showPasswordLabel ?? m.value.showPassword),
)

/**
 * The caret is put back a frame later: the browser drops the input selection when the type
 * switches between `password` and `text`, and it does so after the current microtask.
 */
const toggleReveal = () => {
  const input = field.value
  const start = input?.selectionStart ?? null
  const end = input?.selectionEnd ?? null
  revealed.value = !revealed.value
  if (input && start !== null) {
    requestAnimationFrame(() => input.setSelectionRange(start, end ?? start))
  }
}

// Mask: Maska handles the caret, paste and IME; this only wires it to the model.
const maskEngine = computed(() =>
  props.numeric
    ? createNumericMaskEngine(props.numeric)
    : props.mask
      ? createMaskEngine(props.mask)
      : null,
)
// The input value is always the masked string (with `unmaskedValue` the model holds the raw one).
const display = computed(() =>
  maskEngine.value ? maskEngine.value.masked(model.value ?? '') : (model.value ?? ''),
)
// The only way the model is written under a mask: masked by default, unmasked by the flag.
const onMaska = (detail: MaskaDetail) => {
  /**
   * Numeric mode stores a normalized string: a dot as the decimal separator and no group
   * separators, otherwise the consumer's Number(value) would choke on them.
   */
  model.value = props.numeric || props.unmaskedValue ? detail.unmasked : detail.masked
}
const maskaDirectiveOptions = computed<MaskInputOptions | undefined>(() => {
  if (props.numeric) return { ...toNumericMaskaOptions(props.numeric), onMaska }
  return props.mask ? { ...toMaskaOptions(props.mask), onMaska } : undefined
})

// Mask and numeric share the Maska branch: both format the value and write the model in onMaska.
const masked = computed(() => !!props.mask || !!props.numeric)

/**
 * Maska does not enforce min/max. The value is clamped on `change`, not on every keystroke:
 * otherwise with `min: 10` the first digit could never be typed — it would become `10` at once.
 */
const clampToBounds = () => {
  const numeric = props.numeric
  if (!numeric || (numeric.min == null && numeric.max == null)) return
  const parsed = parseNumeric(model.value ?? '')
  if (parsed === null) return
  const clamped = clampNumeric(parsed, numeric)
  if (clamped !== parsed) model.value = String(clamped)
}

// Mobile keyboard: decimals get a separator key, integers get digits only.
const numericInputMode = computed<'decimal' | 'numeric' | undefined>(() =>
  props.numeric ? ((props.numeric.decimals ?? 0) > 0 ? 'decimal' : 'numeric') : undefined,
)

/**
 * fill-mask draws the rest of the template as a "ghost" layer behind the field while the input
 * value stays plain, so the caret works natively. The ghost's invisible prefix is the typed
 * value: it takes exactly the same width in any font, followed by the empty slots.
 */
const fillChar = computed(() =>
  typeof props.fillMask === 'string' && props.fillMask.length ? props.fillMask[0] : '_',
)
const isFill = computed(() => !!props.mask && !!props.fillMask)
const fillTemplate = computed(() => (isFill.value ? toTemplate(props.mask!, fillChar.value) : ''))
const ghostTail = computed(() => fillTemplate.value.slice(display.value.length))

const showClear = computed(
  () => props.clearable && !props.disabled && !props.readonly && !!model.value,
)
// data-filled: with fill-mask the label always floats — the ghost template is always visible.
const filled = computed(() => isFill.value || !!model.value)

// With fill-mask the native placeholder is off: the ghost overlay takes its place.
const inputAttrs = computed(() => ({
  placeholder: isFill.value ? undefined : props.placeholder,
  disabled: props.disabled,
  required: props.required,
  readonly: props.readonly || undefined,
  inputmode: numericInputMode.value,
}))

// The consumer may override inputmode/placeholder, but not the field bindings (see useFieldAttrs).
const attrs = useAttrs()
const fieldAttrs = computed(() => ({
  ...inputAttrs.value,
  ...attrs,
  id: props.fieldId,
  'aria-invalid': props.invalid || undefined,
  'aria-describedby': props.describedBy,
}))

/**
 * The bounds check is added alongside the consumer's `change` rather than replacing it: a key
 * with the same name in `v-bind` would otherwise overwrite the passed handler.
 */
const onFieldChange = (event: Event) => {
  clampToBounds()
  const handler = attrs.onChange
  if (Array.isArray(handler)) handler.forEach((h) => (h as (e: Event) => void)(event))
  else if (typeof handler === 'function') (handler as (e: Event) => void)(event)
}

const maskedAttrs = computed(() =>
  props.numeric ? { ...fieldAttrs.value, onChange: onFieldChange } : fieldAttrs.value,
)
</script>

<template>
  <div
    class="s-input__wrap"
    :class="{
      's-input__wrap--invalid': invalid,
      's-input__wrap--disabled': disabled,
      's-input__wrap--floating': floating,
      's-input__wrap--has-leading': floating && hasLeading,
    }"
    :data-filled="filled || undefined"
    :data-invalid="invalid || undefined"
  >
    <span
      v-if="$slots.prepend"
      class="s-input__prepend"
    >
      <slot name="prepend" />
    </span>
    <SIcon
      v-if="icon"
      class="s-input__icon"
      :icon="icon"
      :size="16"
    />
    <span
      v-if="prefix"
      class="s-input__affix"
      >{{ prefix }}</span
    >
    <!-- fill-mask: the "ghost" draws the rest of the template over a plain input, see fillChar. -->
    <div
      v-if="mask && fillMask"
      class="s-input__field-box"
    >
      <input
        ref="field"
        v-maska="maskaDirectiveOptions"
        class="s-input__field"
        type="text"
        :value="display"
        v-bind="maskedAttrs"
      />
      <div
        class="s-input__ghost"
        aria-hidden="true"
      >
        <span class="s-input__ghost-fill">{{ display }}</span
        ><span class="s-input__ghost-tail">{{ ghostTail }}</span>
      </div>
    </div>
    <!-- Masked input: Maska formats the value and keeps the caret; the model is written in onMaska.
         The type is fixed to text (brackets/spaces are incompatible with number/email). -->
    <input
      v-else-if="masked"
      ref="field"
      v-maska="maskaDirectiveOptions"
      class="s-input__field"
      type="text"
      :value="display"
      v-bind="maskedAttrs"
    />
    <input
      v-else
      ref="field"
      v-model="model"
      class="s-input__field"
      :type="inputType"
      v-bind="fieldAttrs"
    />
    <span
      v-if="suffix"
      class="s-input__affix"
      >{{ suffix }}</span
    >
    <label
      v-if="floating"
      :id="labelId"
      class="s-input__label"
      :for="fieldId"
    >
      {{ label }}
      <span
        v-if="required"
        class="s-input__label-required"
        aria-hidden="true"
        >*</span
      >
    </label>
    <SIcon
      v-if="iconRight"
      class="s-input__icon"
      :icon="iconRight"
      :size="16"
    />
    <button
      v-if="showClear"
      type="button"
      class="s-input__clear"
      :aria-label="clearLabel ?? m.clear"
      @click="clear"
    >
      <SIcon
        :icon="clearIcon"
        :size="16"
      />
    </button>
    <!-- A prevented mousedown keeps focus, and with it the caret, in the field on a click. -->
    <button
      v-if="showReveal"
      type="button"
      class="s-input__reveal"
      :aria-label="revealLabel"
      :aria-pressed="revealed"
      @mousedown.prevent
      @click="toggleReveal"
    >
      <SIcon
        :icon="revealed ? hideIcon : revealIcon"
        :size="16"
      />
    </button>
    <span
      v-if="$slots.append"
      class="s-input__append"
    >
      <slot name="append" />
    </span>
  </div>
</template>
