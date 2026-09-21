import type { DateValue } from '@internationalized/date'

export type SDateFieldSize = 'sm' | 'md' | 'lg'
export type SDateFieldGranularity = 'day' | 'hour' | 'minute' | 'second'

export interface SDateFieldProps {
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
  size?: SDateFieldSize
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
  /**
   * Granularity: the smallest segment to display (day/hour/minute/second).
   * Defaults to `day` for `CalendarDate` and `minute` for dates with time.
   */
  granularity?: SDateFieldGranularity
  /** Minimum allowed date. */
  minValue?: DateValue
  /** Maximum allowed date. */
  maxValue?: DateValue
}
