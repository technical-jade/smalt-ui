import type { SElevation } from '../../composables/useElevationProp'
import type { SValidationProps } from '../../composables/useValidation'
import type { STimeValue } from '../STimeField/types'

export type STimePickerSize = 'sm' | 'md' | 'lg'
export type STimePickerGranularity = 'hour' | 'minute' | 'second'
export type STimePickerHourCycle = 12 | 24

export interface STimePickerProps extends SValidationProps<STimeValue | undefined> {
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
  size?: STimePickerSize
  /** Disables the field and the panel. */
  disabled?: boolean
  /** Read-only: neither the segments nor the panel can change the value. */
  readonly?: boolean
  /** Field name in native form submission: the value is sent in a hidden input. */
  name?: string
  /** Marks the field as required: adds `*` to the label. */
  required?: boolean
  /** Explicitly marks the field invalid (in addition to `error`). */
  invalid?: boolean
  /** Square corners: removes the rounding of the field and of the panel (rounded by default). */
  square?: boolean
  /**
   * Formatting locale (for example `en-GB`). Derived from the library locale by default
   * (`ConfigProvider`/`installLocale`, in Nuxt the `locale` option): `en` → `en-US`.
   */
  locale?: string
  /**
   * Hour cycle: 12- or 24-hour. Follows the locale by default, which also decides whether the
   * panel shows an AM/PM column.
   */
  hourCycle?: STimePickerHourCycle
  /**
   * Granularity: the smallest part the value has, which is also the last column of the panel.
   * @defaultValue 'minute'
   */
  granularity?: STimePickerGranularity
  /** Step between the minutes offered by the panel. @defaultValue 1 */
  minuteStep?: number
  /** Step between the seconds offered by the panel. @defaultValue 1 */
  secondStep?: number
  /** Minimum allowed time; earlier entries in the panel are disabled. */
  minValue?: STimeValue
  /** Maximum allowed time; later entries in the panel are disabled. */
  maxValue?: STimeValue
  /** Accessible name of the button that opens the panel (defaults to the locale dictionary). */
  openLabel?: string
  /** Removes the shadow. Overridden by the `elevation` prop when it is set. */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
}
