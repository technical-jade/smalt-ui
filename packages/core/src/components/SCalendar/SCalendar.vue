<script setup lang="ts">
import {
  CalendarRoot,
  CalendarHeader,
  CalendarHeading,
  CalendarPrev,
  CalendarNext,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridBody,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarCell,
  CalendarCellTrigger,
} from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import { SIcon } from '../SIcon'
import { useDefaults, useFormatLocale, useMessages } from '../../composables'
import type { SCalendarProps } from './types'

const props = withDefaults(defineProps<SCalendarProps>(), {
  numberOfMonths: 1,
  fixedWeeks: true,
  disabled: false,
  readonly: false,
  multiple: false,
})
const p = useDefaults(props, 'SCalendar')
const formatLocale = useFormatLocale(() => p.locale)

const m = useMessages()

/** Selected date (or an array with `multiple`). Two-way binding via `v-model`. */
const model = defineModel<DateValue | DateValue[] | undefined>()

/**
 * The date whose month is shown. Two-way binding via `v-model:placeholder`: it follows the month
 * navigation and moves the calendar when set. Without a value or a placeholder the calendar opens
 * on today in the time zone where it renders, so with SSR the server may pick a different month
 * and "today" than the browser: pass a placeholder or render the calendar on the client only.
 */
const placeholder = defineModel<DateValue>('placeholder')
</script>

<template>
  <CalendarRoot
    v-slot="{ grid, weekDays }"
    v-model="model"
    v-model:placeholder="placeholder"
    class="s-calendar"
    :locale="formatLocale"
    :min-value="p.minValue"
    :max-value="p.maxValue"
    :week-starts-on="p.weekStartsOn"
    :fixed-weeks="p.fixedWeeks"
    :number-of-months="p.numberOfMonths"
    :multiple="p.multiple"
    :disabled="p.disabled"
    :readonly="p.readonly"
    :is-date-disabled="p.isDateDisabled"
    :calendar-label="p.calendarLabel ?? m.calendar"
  >
    <CalendarHeader class="s-calendar__header">
      <CalendarPrev
        class="s-calendar__nav"
        :aria-label="p.prevMonthLabel ?? m.prevMonth"
      >
        <SIcon
          icon="chevron-left"
          :size="18"
        />
      </CalendarPrev>
      <CalendarHeading
        as="div"
        class="s-calendar__heading"
      />
      <CalendarNext
        class="s-calendar__nav"
        :aria-label="p.nextMonthLabel ?? m.nextMonth"
      >
        <SIcon
          icon="chevron-right"
          :size="18"
        />
      </CalendarNext>
    </CalendarHeader>

    <div class="s-calendar__months">
      <CalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        class="s-calendar__grid"
      >
        <CalendarGridHead>
          <CalendarGridRow class="s-calendar__row">
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="s-calendar__weekday"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>

        <CalendarGridBody>
          <CalendarGridRow
            v-for="(week, weekIndex) in month.rows"
            :key="weekIndex"
            class="s-calendar__row"
          >
            <CalendarCell
              v-for="date in week"
              :key="date.toString()"
              :date="date"
              class="s-calendar__cell"
            >
              <CalendarCellTrigger
                :day="date"
                :month="month.value"
                class="s-calendar__day"
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>

<style src="./SCalendar.scss" lang="scss"></style>
