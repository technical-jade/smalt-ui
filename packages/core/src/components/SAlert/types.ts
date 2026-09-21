import type { SColorName } from '../../composables/useColorProp'

export type SAlertVariant = 'info' | 'positive' | 'warning' | 'negative'

export interface SAlertProps {
  /**
   * Accent color: a name from the [palette](/style/palette) (`primary`/`teal`/`teal-10`).
   * Overrides the variant color.
   */
  color?: SColorName
  /** Semantic variant: `info`/`positive`/`warning`/`negative`. */
  variant?: SAlertVariant
  /** Square corners: removes the border radius (rounded by default). */
  square?: boolean
  /** Title (can be replaced with the `title` slot). */
  title?: string
  /** Shows the close button: it hides the alert and emits `close`. */
  closable?: boolean
  /**
   * Icon (a registry name or a raw SVG path). Overrides the variant's status icon; the `icon`
   * slot takes precedence.
   */
  icon?: string
  /** Accessible name of the close button (defaults to the locale dictionary). */
  closeLabel?: string
}
