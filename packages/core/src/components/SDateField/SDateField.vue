<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { DateFieldRoot, DateFieldInput } from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import { SFormField } from '../SFormField'
import { visibleSegments } from '../../internal/dateSegments'
import SegmentedFieldBridge, {
  type SegmentedFieldBridgeExposed,
} from '../../internal/SegmentedFieldBridge'
import { useDefaults, useFormatLocale } from '../../composables'
import { useFieldFocus } from '../../internal/useFieldFocus'
import type { SDateFieldProps } from './types'

const props = withDefaults(defineProps<SDateFieldProps>(), {
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  floatingLabel: true,
})
const p = useDefaults(props, 'SDateField')

const emit = defineEmits<{
  /** Focus entered the field. Moving between segments does not count. */
  focus: [event: FocusEvent]
  /** Focus left the field. Moving between segments does not count. */
  blur: [event: FocusEvent]
}>()
const root = useTemplateRef<ComponentPublicInstance>('root')
const { onFocusIn, onFocusOut } = useFieldFocus(root, emit)

const formatLocale = useFormatLocale(() => p.locale)

const slots = defineSlots<{
  /** Content at the start of the field, inside the border (icon, button). */
  prepend?: (props: Record<string, never>) => unknown
  /** Content at the end of the field, inside the border (icon, button). */
  append?: (props: Record<string, never>) => unknown
}>()

/**
 * Field value (`DateValue` from `@internationalized/date`). Two-way bound via `v-model`.
 */
const model = defineModel<DateValue | undefined>()

const outOfRange = ref(false)
const bridge = useTemplateRef<SegmentedFieldBridgeExposed>('bridge')

const floating = computed(() => p.floatingLabel && !!p.label)
const filled = computed(() => model.value != null)
const hasLeading = computed(() => !!slots.prepend)
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    class="s-date-field"
    :class="`s-date-field--${p.size}`"
    :label="p.label"
    :hint="p.hint"
    :error="p.error"
    :invalid="p.invalid || outOfRange"
    :required="p.required"
    :size="p.size"
    :floating-label="floating"
    :square="p.square"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template
      #default="{ id: fieldId, labelId, describedBy, invalid: fieldInvalid, label: fieldLabel }"
    >
      <div
        class="s-date-field__wrap"
        :class="{
          's-date-field__wrap--invalid': fieldInvalid,
          's-date-field__wrap--disabled': p.disabled,
          's-date-field__wrap--floating': floating,
          's-date-field__wrap--has-leading': floating && hasLeading,
        }"
        :data-filled="filled || undefined"
        :data-invalid="fieldInvalid || undefined"
      >
        <span
          v-if="$slots.prepend"
          class="s-date-field__prepend"
        >
          <slot name="prepend" />
        </span>
        <DateFieldRoot
          :id="fieldId"
          v-slot="{ segments }"
          v-model="model"
          class="s-date-field__control"
          :locale="formatLocale"
          :granularity="p.granularity"
          :min-value="p.minValue"
          :max-value="p.maxValue"
          :disabled="p.disabled"
          :readonly="p.readonly"
          :name="p.name"
          :required="p.required"
          :aria-labelledby="labelId"
          :aria-invalid="fieldInvalid || undefined"
          :aria-describedby="describedBy"
          @paste="bridge?.paste($event)"
        >
          <DateFieldInput
            v-for="item in visibleSegments(segments)"
            :key="item.part"
            :part="item.part"
            class="s-date-field__segment"
            :class="{ 's-date-field__segment--literal': item.part === 'literal' }"
          >
            {{ item.value }}
          </DateFieldInput>
          <SegmentedFieldBridge
            ref="bridge"
            kind="date"
            @invalid="outOfRange = $event"
          />
        </DateFieldRoot>
        <label
          v-if="floating"
          :id="labelId"
          class="s-date-field__label"
        >
          {{ fieldLabel }}
          <span
            v-if="p.required"
            class="s-date-field__label-required"
            aria-hidden="true"
            >*</span
          >
        </label>
        <span
          v-if="$slots.append"
          class="s-date-field__append"
        >
          <slot name="append" />
        </span>
      </div>
    </template>
  </SFormField>
</template>

<style src="./SDateField.scss" lang="scss"></style>
