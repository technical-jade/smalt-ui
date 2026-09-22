<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { DateRangePickerRoot } from 'reka-ui'
import { SFormField } from '../SFormField'
import DateRangePickerField from './DateRangePickerField.vue'
import DateRangePickerCalendar from './DateRangePickerCalendar.vue'
import { useDefaults, useElevationProp, useFormatLocale } from '../../composables'
import { useFieldFocus } from '../../internal/useFieldFocus'
import { focusFirstSegment, useFieldValidation } from '../../internal/useFieldValidation'
import type { SDateRangePickerProps, SDateRange } from './types'

const props = withDefaults(defineProps<SDateRangePickerProps>(), {
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  floatingLabel: true,
  fixedWeeks: true,
  numberOfMonths: 2,
})
const p = useDefaults(props, 'SDateRangePicker')

const emit = defineEmits<{
  /** Focus entered the field. Moving between segments or into the calendar does not count. */
  focus: [event: FocusEvent]
  /** Focus left the field. Moving between segments or into the calendar does not count. */
  blur: [event: FocusEvent]
}>()
const root = useTemplateRef<ComponentPublicInstance>('root')

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

/** Selected range `{ start, end }`. Two-way binding via `v-model`. */
const model = defineModel<SDateRange | undefined>()

/**
 * Filled: the label stays on top even without focus (data-filled on the frame). The range counts
 * as filled when at least one bound is set: the start is picked before the end, and the "stuck"
 * start placeholder segment must not disappear until the end is picked.
 */
const filled = computed(() => model.value?.start != null || model.value?.end != null)

/**
 * The form gets its own hidden input: Reka's one carries `"${start} - ${end}"` and turns an
 * empty range into "undefined - undefined", so `required` would never fail. The value here is an
 * ISO 8601 interval, empty until both bounds are picked.
 */
const formValue = computed(() => {
  const { start, end } = model.value ?? {}
  return start && end ? `${start.toString()}/${end.toString()}` : ''
})

// Native validation focuses the hidden input on submit; the user needs the first segment instead.
const focusSegment = () => focusFirstSegment(root.value?.$el, 's-date-range-picker')

const {
  errorMessage,
  onBlur: onLeave,
  expose,
} = useFieldValidation(p, () => model.value, root, focusSegment)
const { onFocusIn, onFocusOut } = useFieldFocus(
  root,
  emit,
  '.s-date-range-picker__content',
  onLeave,
)
defineExpose(expose)
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    class="s-date-range-picker"
    :class="`s-date-range-picker--${p.size}`"
    :label="p.label"
    :hint="p.hint"
    :error="errorMessage"
    :invalid="p.invalid || outOfRange"
    :required="p.required"
    :size="p.size"
    :floating-label="floating"
    :square="p.square"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template #default="{ id: fieldId, labelId, describedBy, invalid: fieldInvalid }">
      <DateRangePickerRoot
        v-model="model"
        :locale="formatLocale"
        :min-value="p.minValue"
        :max-value="p.maxValue"
        :week-starts-on="p.weekStartsOn"
        :fixed-weeks="p.fixedWeeks"
        :number-of-months="p.numberOfMonths"
        :is-date-disabled="p.isDateDisabled"
        :disabled="p.disabled"
        :readonly="p.readonly"
      >
        <DateRangePickerField
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
        </DateRangePickerField>

        <DateRangePickerCalendar
          :calendar-label="p.calendarLabel"
          :prev-month-label="p.prevMonthLabel"
          :next-month-label="p.nextMonthLabel"
          :square="p.square"
          :content-style="elevationStyle"
          @focusout="onFocusOut"
        />
      </DateRangePickerRoot>
      <input
        v-if="p.name"
        class="s-date-range-picker__native"
        tabindex="-1"
        aria-hidden="true"
        :name="p.name"
        :value="formValue"
        :required="p.required"
        :disabled="p.disabled"
        @focus="focusSegment"
      />
    </template>
  </SFormField>
</template>

<style src="./SDateRangePicker.scss" lang="scss"></style>
