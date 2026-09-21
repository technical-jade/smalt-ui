<script setup lang="ts">
import {
  DateRangePickerContent,
  DateRangePickerCalendar as RekaDateRangePickerCalendar,
  DateRangePickerHeader,
  DateRangePickerPrev,
  DateRangePickerHeading,
  DateRangePickerNext,
  DateRangePickerGrid,
  DateRangePickerGridHead,
  DateRangePickerGridBody,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
} from 'reka-ui'
import { SIcon } from '../SIcon'
import { useMessages } from '../../composables'

/**
 * Private part of SDateRangePicker: the calendar popup (`DateRangePickerContent` portal + month
 * grids). Rendered inside the wrapper's `DateRangePickerRoot`. Styles are global BEM from
 * SDateRangePicker.scss (`reset-inherited` on `__content`, since it is a portal).
 */
defineProps<{
  calendarLabel?: string
  prevMonthLabel?: string
  nextMonthLabel?: string
  square?: boolean
  contentStyle?: Record<string, string>
}>()

const m = useMessages()
</script>

<template>
  <DateRangePickerContent
    :side-offset="6"
    class="s-date-range-picker__content"
    :class="{ 's-date-range-picker__content--square': square }"
    :style="contentStyle"
  >
    <RekaDateRangePickerCalendar
      v-slot="{ grid, weekDays }"
      class="s-date-range-picker__calendar"
      :calendar-label="calendarLabel ?? m.calendar"
    >
      <DateRangePickerHeader class="s-date-range-picker__cal-header">
        <DateRangePickerPrev
          class="s-date-range-picker__nav"
          :aria-label="prevMonthLabel ?? m.prevMonth"
        >
          <SIcon
            icon="chevron-left"
            :size="18"
          />
        </DateRangePickerPrev>
        <DateRangePickerHeading
          as="div"
          class="s-date-range-picker__heading"
        />
        <DateRangePickerNext
          class="s-date-range-picker__nav"
          :aria-label="nextMonthLabel ?? m.nextMonth"
        >
          <SIcon
            icon="chevron-right"
            :size="18"
          />
        </DateRangePickerNext>
      </DateRangePickerHeader>

      <div class="s-date-range-picker__months">
        <DateRangePickerGrid
          v-for="month in grid"
          :key="month.value.toString()"
          class="s-date-range-picker__grid"
        >
          <DateRangePickerGridHead>
            <DateRangePickerGridRow class="s-date-range-picker__cal-row">
              <DateRangePickerHeadCell
                v-for="day in weekDays"
                :key="day"
                class="s-date-range-picker__weekday"
              >
                {{ day }}
              </DateRangePickerHeadCell>
            </DateRangePickerGridRow>
          </DateRangePickerGridHead>

          <DateRangePickerGridBody>
            <DateRangePickerGridRow
              v-for="(week, weekIndex) in month.rows"
              :key="weekIndex"
              class="s-date-range-picker__cal-row"
            >
              <DateRangePickerCell
                v-for="date in week"
                :key="date.toString()"
                :date="date"
                class="s-date-range-picker__cell"
              >
                <DateRangePickerCellTrigger
                  :day="date"
                  :month="month.value"
                  class="s-date-range-picker__day"
                />
              </DateRangePickerCell>
            </DateRangePickerGridRow>
          </DateRangePickerGridBody>
        </DateRangePickerGrid>
      </div>
    </RekaDateRangePickerCalendar>
  </DateRangePickerContent>
</template>
