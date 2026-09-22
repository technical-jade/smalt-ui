import type { SColorName } from '../../composables/useColorProp'
import type { SValidationProps } from '../../composables/useValidation'

export interface SSliderProps extends SValidationProps<number | number[]> {
  /**
   * Accent color (fill/thumb): a name from the [palette](/style/palette)
   * (`primary`/`teal`/`teal-10`).
   */
  color?: SColorName
  /** Control id. Generated automatically (SSR-safe) when not set. */
  id?: string
  /** Field label. */
  label?: string
  /**
   * Accessible name of the thumb when there is no visible `label`. A range adds the edge to it
   * ("Price: start").
   */
  ariaLabel?: string
  /** Hint below the field. */
  hint?: string
  /** Error message. When set, the field is marked invalid. */
  error?: string
  /** Marks the field invalid explicitly (in addition to `error`). */
  invalid?: boolean
  /** Field name in native form submission: the value is sent in a hidden input. */
  name?: string
  /** Marks the field as required. */
  required?: boolean
  /** Disables the slider. */
  disabled?: boolean
  /** Minimum value. */
  min?: number
  /** Maximum value. */
  max?: number
  /** Value step. */
  step?: number
  /** Shows the current value in a bubble above the thumb. */
  showValue?: boolean
  /** Keeps the value bubble always visible. Otherwise it shows only on hover, focus, or drag. */
  valueAlways?: boolean
}
