import type { SColorName } from '../../composables/useColorProp'
import type { SValidationProps } from '../../composables/useValidation'

export interface SSwitchProps extends SValidationProps<boolean> {
  /**
   * Accent color (of the on state): a name from the [palette](/style/palette)
   * (`primary`/`teal`/`teal-10`).
   */
  color?: SColorName
  /** Thumb color on the on-state fill: a [palette](/style/palette) name. White by default. */
  textColor?: SColorName
  /** Label text next to the switch (can be replaced with the default slot). */
  label?: string
  /** Accessible name of the switch when there is no visible label. */
  ariaLabel?: string
  /** Disables the switch and makes it inactive. */
  disabled?: boolean
  /** Field name in native form submission: the value is sent in a hidden input. */
  name?: string
  /** Required for form submission. */
  required?: boolean
  /** Hint below the switch. */
  hint?: string
  /** Error message below the switch. When set, the switch is marked invalid. */
  error?: string
  /** Marks the switch invalid explicitly (in addition to `error`). */
  invalid?: boolean
  /** Switch id. Generated automatically when not set (SSR-safe). */
  id?: string
}
