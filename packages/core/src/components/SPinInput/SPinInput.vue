<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { PinInputInput, PinInputRoot } from 'reka-ui'
import { SFormField } from '../SFormField'
import { useDefaults, useMessages } from '../../composables'
import { useFieldFocus } from '../../internal/useFieldFocus'
import type { SPinInputProps } from './types'

const props = withDefaults(defineProps<SPinInputProps>(), {
  size: 'md',
  invalid: false,
  required: false,
  disabled: false,
  length: 4,
  type: 'text',
  mask: false,
  otp: false,
})
const p = useDefaults(props, 'SPinInput')

const m = useMessages()

// Replaces Reka's own English "pin input 1 of 4".
function cellLabel(index: number): string {
  return (p.cellLabel ?? m.value.pinCell)
    .replace('{index}', String(index))
    .replace('{length}', String(p.length))
}

const emit = defineEmits<{
  /** Focus entered the field. Moving between cells does not count. */
  focus: [event: FocusEvent]
  /** Focus left the field. Moving between cells does not count. */
  blur: [event: FocusEvent]
}>()
const root = useTemplateRef<ComponentPublicInstance>('root')
const { onFocusIn, onFocusOut } = useFieldFocus(root, emit)

defineSlots<{
  /** Content at the start of the field, inside the border (icon, button). */
  prepend?: (props: Record<string, never>) => unknown
  /** Content at the end of the field, inside the border (icon, button). */
  append?: (props: Record<string, never>) => unknown
}>()

/**
 * The entered code as an array of characters, one per cell. Two-way bound via `v-model`.
 * With `type="number"`, Reka puts numbers into the elements at runtime, so convert values to the
 * type you need when reading them (`String(v)` / `Number(v)`).
 */
const model = defineModel<string[]>({ default: () => [] })
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    :floating-label="false"
    class="s-pin-input"
    :class="`s-pin-input--${p.size}`"
    :label="p.label"
    :hint="p.hint"
    :error="p.error"
    :invalid="p.invalid"
    :required="p.required"
    :size="p.size"
    :square="p.square"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template #default="{ id: fieldId, labelId, describedBy, invalid: fieldInvalid }">
      <div class="s-pin-input__wrap">
        <span
          v-if="$slots.prepend"
          class="s-pin-input__prepend"
        >
          <slot name="prepend" />
        </span>
        <PinInputRoot
          v-model="model"
          class="s-pin-input__control"
          :aria-labelledby="labelId"
          :type="p.type"
          :mask="p.mask"
          :otp="p.otp"
          :placeholder="p.placeholder"
          :disabled="p.disabled"
          :name="p.name"
          :required="p.required"
        >
          <!-- aria-describedby/aria-invalid go on the cell inputs themselves: PinInputRoot is a
               div, and screen readers do not announce its attributes when a cell is focused. -->
          <PinInputInput
            v-for="i in p.length"
            :id="i === 1 ? fieldId : undefined"
            :key="i"
            class="s-pin-input__cell"
            :index="i - 1"
            :aria-label="cellLabel(i)"
            :aria-describedby="describedBy"
            :aria-invalid="fieldInvalid || undefined"
          />
        </PinInputRoot>
        <span
          v-if="$slots.append"
          class="s-pin-input__append"
        >
          <slot name="append" />
        </span>
      </div>
    </template>
  </SFormField>
</template>

<style src="./SPinInput.scss" lang="scss"></style>
