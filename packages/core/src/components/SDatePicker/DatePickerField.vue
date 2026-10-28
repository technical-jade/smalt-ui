<script setup lang="ts">
import { useTemplateRef, type ComponentPublicInstance } from 'vue'
import { DatePickerField as RekaDatePickerField, DatePickerInput, DatePickerTrigger } from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import { SIcon } from '../SIcon'
import { segmentAria, visibleSegments } from '../../internal/dateSegments'
import SegmentedFieldBridge, {
  type SegmentedFieldBridgeExposed,
} from '../../internal/SegmentedFieldBridge'
import { useMessages } from '../../composables'
import { useLeadingLabelOffset } from '../../internal/useLeadingLabelOffset'

/**
 * Private part of SDatePicker: the segmented date input + the open-calendar button. Rendered
 * inside the wrapper's `DatePickerRoot` (the Reka context is available via inject). Styles are
 * global BEM from SDatePicker.scss.
 */
const props = defineProps<{
  fieldId: string
  labelId?: string
  label?: string
  floating?: boolean
  pinned?: boolean
  filled?: boolean
  required?: boolean
  describedBy?: string
  invalid: boolean
  openCalendarLabel?: string
  /**
   * Goes to the field's `isDateUnavailable`: Reka checks a typed date only against it. The root
   * does not get it, or the calendar days would carry `data-unavailable` on top of `data-disabled`.
   */
  isDateDisabled?: (date: DateValue) => boolean
}>()

const m = useMessages()

const emit = defineEmits<{
  /** Reka's own validity: a typed date outside minValue/maxValue. */
  invalid: [value: boolean]
}>()
const bridge = useTemplateRef<SegmentedFieldBridgeExposed>('bridge')

const slots = defineSlots<{
  prepend?: (props: Record<string, never>) => unknown
  append?: (props: Record<string, never>) => unknown
}>()

const frame = useTemplateRef<ComponentPublicInstance>('frame')
const labelOffset = useLeadingLabelOffset(
  () => frame.value,
  '.s-date-picker__segment',
  () => !!props.floating && !!slots.prepend,
)
</script>

<template>
  <RekaDatePickerField
    :id="fieldId"
    ref="frame"
    v-slot="{ segments }"
    class="s-date-picker__control"
    :class="{ 's-date-picker__control--floating': floating }"
    :style="labelOffset"
    :data-filled="filled || undefined"
    :data-label-pinned="(floating && pinned) || undefined"
    :aria-labelledby="labelId"
    :aria-invalid="invalid || undefined"
    :aria-describedby="describedBy"
    :is-date-unavailable="isDateDisabled"
    @paste="bridge?.paste($event)"
  >
    <label
      v-if="floating"
      :id="labelId"
      class="s-date-picker__label"
    >
      {{ label }}
      <span
        v-if="required"
        class="s-date-picker__label-required"
        aria-hidden="true"
        >*</span
      >
    </label>
    <span
      v-if="$slots.prepend"
      class="s-date-picker__prepend"
    >
      <slot name="prepend" />
    </span>
    <DatePickerInput
      v-for="item in visibleSegments(segments)"
      :key="item.part"
      :part="item.part"
      v-bind="segmentAria(item, m)"
      class="s-date-picker__segment"
      :class="{ 's-date-picker__segment--literal': item.part === 'literal' }"
    >
      {{ item.value }}
    </DatePickerInput>

    <DatePickerTrigger
      class="s-date-picker__trigger"
      :aria-label="openCalendarLabel ?? m.openCalendar"
    >
      <SIcon
        icon="calendar"
        :size="18"
      />
    </DatePickerTrigger>
    <span
      v-if="$slots.append"
      class="s-date-picker__append"
    >
      <slot name="append" />
    </span>
    <SegmentedFieldBridge
      ref="bridge"
      kind="date"
      @invalid="emit('invalid', $event)"
    />
  </RekaDatePickerField>
</template>
