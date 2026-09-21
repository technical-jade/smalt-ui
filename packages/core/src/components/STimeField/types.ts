import type { Time, CalendarDateTime, ZonedDateTime } from '@internationalized/date'

/** Time value: `Time`, `CalendarDateTime` or `ZonedDateTime`. */
export type STimeValue = Time | CalendarDateTime | ZonedDateTime

export type STimeFieldSize = 'sm' | 'md' | 'lg'
export type STimeFieldGranularity = 'hour' | 'minute' | 'second'
export type STimeFieldHourCycle = 12 | 24

export interface STimeFieldProps {
  /** Field id. Generated automatically when not set (SSR-safe). */
  id?: string
  /** Field label. */
  label?: string
  /**
   * Floating label: the label sits inside the border, looks like a placeholder at rest and
   * floats up to the top edge on focus or when filled. On by default; `false` renders a regular
   * label above the field. The label size is fixed and does not depend on `size`.
   */
  floatingLabel?: boolean
  /** Hint below the field. */
  hint?: string
  /** Error message. When set, the field is marked invalid. */
  error?: string
  /** Field size: `sm` (32px), `md` (40px) or `lg` (48px). @defaultValue 'md' */
  size?: STimeFieldSize
  /** Disables input and makes the field inactive. */
  disabled?: boolean
  /** Read-only: the segments cannot be changed. */
  readonly?: boolean
  /** Field name in native form submission: the value is sent in a hidden input. */
  name?: string
  /** Marks the field as required: adds `*` to the label. */
  required?: boolean
  /** Explicitly marks the field invalid (in addition to `error`). */
  invalid?: boolean
  /** Square corners: removes the field border radius (rounded by default). */
  square?: boolean
  /**
   * Formatting locale (for example `en-GB`). Derived from the library locale by default
   * (`ConfigProvider`/`installLocale`, in Nuxt the `locale` option): `en` → `en-US`.
   */
  locale?: string
  /** Hour cycle: 12- or 24-hour. Defaults to the locale's preference. */
  hourCycle?: STimeFieldHourCycle
  /**
   * Granularity: the smallest segment to display (hour/minute/second).
   * @defaultValue 'minute'
   */
  granularity?: STimeFieldGranularity
  /** Minimum allowed time. */
  minValue?: STimeValue
  /** Maximum allowed time. */
  maxValue?: STimeValue
}
