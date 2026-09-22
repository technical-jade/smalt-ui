import type { DateValue } from '@internationalized/date'
import type { SElevation } from '../../composables/useElevationProp'
import type { SValidationProps } from '../../composables/useValidation'

export type SDatePickerSize = 'sm' | 'md' | 'lg'
export type SDatePickerWeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface SDatePickerProps extends SValidationProps<DateValue | undefined> {
  /** Field id. Generated automatically when not set (SSR-safe). */
  id?: string
  /** Field label. */
  label?: string
  /** Hint below the field. */
  hint?: string
  /** Error message. When set, the field is marked invalid. */
  error?: string
  /** Field size: `sm` (32px), `md` (40px) or `lg` (48px). @defaultValue 'md' */
  size?: SDatePickerSize
  /** Disables the field and opening the calendar. */
  disabled?: boolean
  /** Read-only: the value cannot be changed. */
  readonly?: boolean
  /** Field name in native form submission: the value is sent in a hidden input. */
  name?: string
  /** Marks the field as required: draws `*` next to the label. */
  required?: boolean
  /** Explicitly marks the field invalid (in addition to `error`). */
  invalid?: boolean
  /** Square corners: removes the rounding of the field frame (rounded by default). */
  square?: boolean
  /**
   * Floating label: the label lives inside the frame, looks like a placeholder at rest and moves
   * up to the top border on focus or when filled. On by default; `false` gives a regular label
   * above the field. The label size is fixed and does not depend on `size`.
   */
  floatingLabel?: boolean
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
  weekStartsOn?: SDatePickerWeekStartsOn
  /** Always show 6 weeks (stable grid height). */
  fixedWeeks?: boolean
  /**
   * Closes the calendar once a day is picked; `false` keeps it open until Escape or a click
   * outside.
   */
  closeOnSelect?: boolean
  /** Predicate function: return `true` to disable a specific date. */
  isDateDisabled?: (date: DateValue) => boolean
  /** Accessible name of the open-calendar button (defaults to the locale dictionary). */
  openCalendarLabel?: string
  /**
   * Accessible name of the calendar, followed by the visible month (defaults to the locale
   * dictionary).
   */
  calendarLabel?: string
  /** Accessible name of the "previous month" button (defaults to the locale dictionary). */
  prevMonthLabel?: string
  /** Accessible name of the "next month" button (defaults to the locale dictionary). */
  nextMonthLabel?: string
  /** Removes the shadow. Overridden by the `elevation` prop when it is set. */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
}
