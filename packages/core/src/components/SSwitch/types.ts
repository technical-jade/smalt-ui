import type { SColorName } from '../../composables/useColorProp'

export interface SSwitchProps {
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
  /** Required for form submission. */
  required?: boolean
  /** Switch id. Generated automatically when not set (SSR-safe). */
  id?: string
}
