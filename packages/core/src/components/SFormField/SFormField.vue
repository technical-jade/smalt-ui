<script setup lang="ts">
import { computed, useId, watchEffect } from 'vue'
import { SLabel } from '../../internal/SLabel'
import { useDefaults } from '../../composables'
import type { SFormFieldLabelSlotProps, SFormFieldProps, SFormFieldSlotProps } from './types'
import { devWarn } from '../../internal/dev'

const props = withDefaults(defineProps<SFormFieldProps>(), {
  required: false,
  invalid: false,
  size: 'md',
  floatingLabel: false,
  square: false,
  inline: false,
})
const p = useDefaults(props, 'SFormField')

const slots = defineSlots<{
  /**
   * The control. Receives the scoped props
   * `{ id, labelId, describedBy, invalid, label, floatingLabel, square }`.
   */
  default?: (props: SFormFieldSlotProps) => unknown
  /**
   * Field label as markup, when a string `label` is not enough (a link label, a tooltip icon).
   * The content goes inside the same `<label for>`, so clicking it also focuses the field.
   * Takes precedence over the `label` prop; does not combine with a floating label, which the
   * field draws itself.
   */
  label?: (props: SFormFieldLabelSlotProps) => unknown
}>()

const uid = useId()
const controlId = computed(() => p.id ?? `s-field-${uid}`)
const hintId = computed(() => `${controlId.value}-hint`)
const errorId = computed(() => `${controlId.value}-error`)
const hasLabel = computed(() => Boolean(p.label) || Boolean(slots.label))
/**
 * Label id for aria-labelledby of group fields (segmented date/time, pin), where a native
 * `<label for>` does not connect to the Reka `role="group"` container.
 */
const labelId = computed(() => (hasLabel.value ? `${controlId.value}-label` : undefined))

defineExpose({
  /** Id given to the control through the default slot: the field focuses it by this id. */
  controlId,
})

const isInvalid = computed(() => p.invalid || Boolean(p.error))
/**
 * References only what is actually in the DOM: there is one message below the field (the error
 * replaces the hint), and `aria-describedby` with the id of a missing element is a broken
 * reference for a screen reader.
 */
const describedBy = computed(() => {
  if (p.error) return errorId.value
  if (p.hint) return hintId.value
  return undefined
})

watchEffect(() => {
  if (slots.label && p.floatingLabel) {
    devWarn(
      '[SFormField] the #label slot does not combine with a floating label: the field draws ' +
        'it itself. Pass floating-label="false".',
    )
  }
})
</script>

<template>
  <div
    class="s-field"
    :class="{
      's-field--invalid': isInvalid,
      's-field--square': p.square,
      's-field--inline': p.inline,
    }"
  >
    <SLabel
      v-if="hasLabel && !p.floatingLabel"
      :id="labelId"
      class="s-field__label"
      :for="controlId"
      :required="p.required"
      :size="p.size"
    >
      <slot
        :id="labelId"
        name="label"
        :for="controlId"
        :required="p.required"
        >{{ p.label }}</slot
      >
    </SLabel>

    <slot
      :id="controlId"
      :label-id="labelId"
      :described-by="describedBy"
      :invalid="isInvalid"
      :label="p.label"
      :floating-label="p.floatingLabel"
      :square="p.square"
    />

    <!-- A live region is announced only if it exists before its content appears, so the
         container stays in the DOM and the error is rendered into it. -->
    <div
      class="s-field__live"
      aria-live="polite"
    >
      <div
        v-if="p.error"
        :id="errorId"
        class="s-field__error"
      >
        {{ p.error }}
      </div>
    </div>
    <div
      v-if="!p.error && p.hint"
      :id="hintId"
      class="s-field__hint"
    >
      {{ p.hint }}
    </div>
  </div>
</template>

<style src="./SFormField.scss" lang="scss"></style>
