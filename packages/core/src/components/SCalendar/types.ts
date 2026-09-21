import type { DateValue } from '@internationalized/date'

export type SCalendarWeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface SCalendarProps {
  /**
   * Formatting locale (e.g. `en-GB`). By default it is derived from the library locale
   * (`ConfigProvider`/`installLocale`, the `locale` option in Nuxt): `en` → `en-US`.
   */
  locale?: string
  /** Minimum allowed date. */
  minValue?: DateValue
  /** Maximum allowed date. */
  maxValue?: DateValue
  /** First day of the week: 0 is Sunday, 1 is Monday, and so on. */
  weekStartsOn?: SCalendarWeekStartsOn
  /** Always shows 6 weeks (stable grid height). */
  fixedWeeks?: boolean
  /** Number of months shown at once. @defaultValue 1 */
  numberOfMonths?: number
  /** Allows selecting multiple dates. */
  multiple?: boolean
  /** Disables interaction with the calendar. */
  disabled?: boolean
  /** Read-only: dates cannot be selected. */
  readonly?: boolean
  /** Predicate: return `true` to disable a specific date. */
  isDateDisabled?: (date: DateValue) => boolean
  /**
   * Accessible name of the calendar, followed by the visible month (defaults to the locale
   * dictionary).
   */
  calendarLabel?: string
  /** Accessible name of the "previous month" button (defaults to the locale dictionary). */
  prevMonthLabel?: string
  /** Accessible name of the "next month" button (defaults to the locale dictionary). */
  nextMonthLabel?: string
}
