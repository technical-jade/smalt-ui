<script setup lang="ts">
import { useTemplateRef } from 'vue'
import {
  DateRangePickerField as RekaDateRangePickerField,
  DateRangePickerInput,
  DateRangePickerTrigger,
} from 'reka-ui'
import { SIcon } from '../SIcon'
import { visibleSegments } from '../../internal/dateSegments'
import SegmentedFieldBridge, {
  type SegmentedFieldBridgeExposed,
} from '../../internal/SegmentedFieldBridge'
import { useMessages } from '../../composables'

/**
 * Private part of SDateRangePicker: the segmented range field (start – end) + the open-calendar
 * button. Rendered inside the wrapper's `DateRangePickerRoot`. Styles are global BEM from
 * SDateRangePicker.scss.
 */
defineProps<{
  fieldId: string
  labelId?: string
  label?: string
  floating?: boolean
  filled?: boolean
  required?: boolean
  describedBy?: string
  invalid: boolean
  openCalendarLabel?: string
}>()

const m = useMessages()

const emit = defineEmits<{
  /** Reka's own validity: a typed date outside minValue/maxValue. */
  invalid: [value: boolean]
}>()
const bridge = useTemplateRef<SegmentedFieldBridgeExposed>('bridge')

defineSlots<{
  prepend?: (props: Record<string, never>) => unknown
  append?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <RekaDateRangePickerField
    :id="fieldId"
    v-slot="{ segments }"
    class="s-date-range-picker__control"
    :class="{ 's-date-range-picker__control--floating': floating }"
    :data-filled="filled || undefined"
    :aria-labelledby="labelId"
    :aria-invalid="invalid || undefined"
    :aria-describedby="describedBy"
    @paste="bridge?.paste($event)"
  >
    <label
      v-if="floating"
      :id="labelId"
      class="s-date-range-picker__label"
    >
      {{ label }}
      <span
        v-if="required"
        class="s-date-range-picker__label-required"
        aria-hidden="true"
        >*</span
      >
    </label>
    <span
      v-if="$slots.prepend"
      class="s-date-range-picker__prepend"
    >
      <slot name="prepend" />
    </span>
    <template
      v-for="(part, key) in segments"
      :key="key"
    >
      <DateRangePickerInput
        v-for="item in visibleSegments(part)"
        :key="`${key}-${item.part}`"
        :part="item.part"
        :type="key"
        class="s-date-range-picker__segment"
        :class="{ 's-date-range-picker__segment--literal': item.part === 'literal' }"
      >
        {{ item.value }}
      </DateRangePickerInput>
      <span
        v-if="key === 'start'"
        class="s-date-range-picker__dash"
        aria-hidden="true"
      >
        –
      </span>
    </template>

    <DateRangePickerTrigger
      class="s-date-range-picker__trigger"
      :aria-label="openCalendarLabel ?? m.openCalendar"
    >
      <SIcon
        icon="calendar"
        :size="18"
      />
    </DateRangePickerTrigger>
    <span
      v-if="$slots.append"
      class="s-date-range-picker__append"
    >
      <slot name="append" />
    </span>
    <SegmentedFieldBridge
      ref="bridge"
      kind="range"
      @invalid="emit('invalid', $event)"
    />
  </RekaDateRangePickerField>
</template>
