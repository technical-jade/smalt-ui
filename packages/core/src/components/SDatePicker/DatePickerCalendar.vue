<script setup lang="ts">
import {
  DatePickerContent,
  DatePickerCalendar as RekaDatePickerCalendar,
  DatePickerHeader,
  DatePickerPrev,
  DatePickerHeading,
  DatePickerNext,
  DatePickerGrid,
  DatePickerGridHead,
  DatePickerGridBody,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerCell,
  DatePickerCellTrigger,
} from 'reka-ui'
import { SIcon } from '../SIcon'
import { useMessages } from '../../composables'

/**
 * Private part of SDatePicker: the calendar popup (`DatePickerContent` portal + month grid).
 * Rendered inside the wrapper's `DatePickerRoot`. Styles are global BEM from SDatePicker.scss
 * (`reset-inherited` on `__content`, since the portal goes to body).
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
  <DatePickerContent
    :side-offset="6"
    class="s-date-picker__content"
    :class="{ 's-date-picker__content--square': square }"
    :style="contentStyle"
  >
    <RekaDatePickerCalendar
      v-slot="{ grid, weekDays }"
      class="s-date-picker__calendar"
      :calendar-label="calendarLabel ?? m.calendar"
    >
      <DatePickerHeader class="s-date-picker__cal-header">
        <DatePickerPrev
          class="s-date-picker__nav"
          :aria-label="prevMonthLabel ?? m.prevMonth"
        >
          <SIcon
            icon="chevron-left"
            :size="18"
          />
        </DatePickerPrev>
        <DatePickerHeading
          as="div"
          class="s-date-picker__heading"
        />
        <DatePickerNext
          class="s-date-picker__nav"
          :aria-label="nextMonthLabel ?? m.nextMonth"
        >
          <SIcon
            icon="chevron-right"
            :size="18"
          />
        </DatePickerNext>
      </DatePickerHeader>

      <DatePickerGrid
        v-for="month in grid"
        :key="month.value.toString()"
        class="s-date-picker__grid"
      >
        <DatePickerGridHead>
          <DatePickerGridRow class="s-date-picker__cal-row">
            <DatePickerHeadCell
              v-for="day in weekDays"
              :key="day"
              class="s-date-picker__weekday"
            >
              {{ day }}
            </DatePickerHeadCell>
          </DatePickerGridRow>
        </DatePickerGridHead>

        <DatePickerGridBody>
          <DatePickerGridRow
            v-for="(week, weekIndex) in month.rows"
            :key="weekIndex"
            class="s-date-picker__cal-row"
          >
            <DatePickerCell
              v-for="date in week"
              :key="date.toString()"
              :date="date"
              class="s-date-picker__cell"
            >
              <DatePickerCellTrigger
                :day="date"
                :month="month.value"
                class="s-date-picker__day"
              />
            </DatePickerCell>
          </DatePickerGridRow>
        </DatePickerGridBody>
      </DatePickerGrid>
    </RekaDatePickerCalendar>
  </DatePickerContent>
</template>
