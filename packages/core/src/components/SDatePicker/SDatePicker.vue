<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { DatePickerRoot } from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import { SFormField } from '../SFormField'
import DatePickerField from './DatePickerField.vue'
import DatePickerCalendar from './DatePickerCalendar.vue'
import { useDefaults, useElevationProp, useFormatLocale } from '../../composables'
import { useFieldFocus } from '../../internal/useFieldFocus'
import type { SDatePickerProps } from './types'

const props = withDefaults(defineProps<SDatePickerProps>(), {
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  floatingLabel: true,
  fixedWeeks: true,
})
const p = useDefaults(props, 'SDatePicker')

const emit = defineEmits<{
  /** Focus entered the field. Moving between segments or into the calendar does not count. */
  focus: [event: FocusEvent]
  /** Focus left the field. Moving between segments or into the calendar does not count. */
  blur: [event: FocusEvent]
}>()
const root = useTemplateRef<ComponentPublicInstance>('root')
const { onFocusIn, onFocusOut } = useFieldFocus(root, emit, '.s-date-picker__content')

const formatLocale = useFormatLocale(() => p.locale)

const elevationStyle = useElevationProp(p, 's-surface')

const outOfRange = ref(false)

const floating = computed(() => p.floatingLabel && !!p.label)

defineSlots<{
  /** Content at the start of the field, inside the frame (icon, button). */
  prepend?: (props: Record<string, never>) => unknown
  /** Content at the end of the field, inside the frame (icon, button). */
  append?: (props: Record<string, never>) => unknown
}>()

/** Selected date (`DateValue`). Two-way binding via `v-model`. */
const model = defineModel<DateValue | undefined>()

const filled = computed(() => model.value != null)
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    class="s-date-picker"
    :class="`s-date-picker--${p.size}`"
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
    <template #default="{ id: fieldId, labelId, describedBy, invalid: fieldInvalid }">
      <DatePickerRoot
        v-model="model"
        :locale="formatLocale"
        :min-value="p.minValue"
        :max-value="p.maxValue"
        :week-starts-on="p.weekStartsOn"
        :fixed-weeks="p.fixedWeeks"
        :is-date-disabled="p.isDateDisabled"
        :disabled="p.disabled"
        :readonly="p.readonly"
        :name="p.name"
        :required="p.required"
      >
        <DatePickerField
          :field-id="fieldId"
          :label-id="labelId"
          :label="p.label"
          :floating="floating"
          :filled="filled"
          :required="p.required"
          :described-by="describedBy"
          :invalid="fieldInvalid"
          :open-calendar-label="p.openCalendarLabel"
          @invalid="outOfRange = $event"
        >
          <template
            v-if="$slots.prepend"
            #prepend
          >
            <slot name="prepend" />
          </template>
          <template
            v-if="$slots.append"
            #append
          >
            <slot name="append" />
          </template>
        </DatePickerField>

        <DatePickerCalendar
          :calendar-label="p.calendarLabel"
          :prev-month-label="p.prevMonthLabel"
          :next-month-label="p.nextMonthLabel"
          :square="p.square"
          :content-style="elevationStyle"
          @focusout="onFocusOut"
        />
      </DatePickerRoot>
    </template>
  </SFormField>
</template>

<style src="./SDatePicker.scss" lang="scss"></style>
