<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
} from 'reka-ui'
import { SFormField } from '../SFormField'
import { SIcon } from '../SIcon'
import { useDefaults, useMessages } from '../../composables'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import { useFieldFocus } from '../../internal/useFieldFocus'
import { useFieldValidation } from '../../internal/useFieldValidation'
import type { SNumberFieldProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SNumberFieldProps>(), {
  size: 'md',
  invalid: false,
  required: false,
  disabled: false,
  step: 1,
})
const p = useDefaults(props, 'SNumberField')

const m = useMessages()

const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()

const emit = defineEmits<{
  /** Focus entered the field. Clicking the +/- buttons does not count. */
  focus: [event: FocusEvent]
  /** Focus left the field. Clicking the +/- buttons does not count. */
  blur: [event: FocusEvent]
}>()
const root = useTemplateRef<ComponentPublicInstance>('root')

/** Numeric value of the field. Two-way binding via `v-model`. */
const model = defineModel<number | null>({ default: null })

const { errorMessage, onBlur: onLeave, expose } = useFieldValidation(p, () => model.value, root)
const { onFocusIn, onFocusOut } = useFieldFocus(root, emit, undefined, onLeave)
defineExpose(expose)
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    :floating-label="false"
    class="s-number-field"
    :class="[`s-number-field--${p.size}`, rootClass]"
    :style="rootStyle"
    :label="p.label"
    :hint="p.hint"
    :error="errorMessage"
    :invalid="p.invalid"
    :required="p.required"
    :size="p.size"
    :square="p.square"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template #default="{ id: fieldId, describedBy, invalid: fieldInvalid }">
      <NumberFieldRoot
        v-model="model"
        class="s-number-field__control"
        :class="{ 's-number-field__control--invalid': fieldInvalid }"
        :min="p.min"
        :max="p.max"
        :step="p.step"
        :disabled="p.disabled"
        :name="p.name"
        :required="p.required"
      >
        <NumberFieldDecrement
          class="s-number-field__button"
          :aria-label="p.decrementLabel ?? m.decrement"
        >
          <SIcon
            icon="minus"
            :size="16"
          />
        </NumberFieldDecrement>

        <NumberFieldInput
          v-bind="controlAttrs"
          :id="fieldId"
          class="s-number-field__input"
          :placeholder="p.placeholder"
          :required="p.required"
          :aria-invalid="fieldInvalid || undefined"
          :aria-describedby="describedBy"
        />

        <NumberFieldIncrement
          class="s-number-field__button"
          :aria-label="p.incrementLabel ?? m.increment"
        >
          <SIcon
            icon="plus"
            :size="16"
          />
        </NumberFieldIncrement>
      </NumberFieldRoot>
    </template>
  </SFormField>
</template>

<style src="./SNumberField.scss" lang="scss"></style>
