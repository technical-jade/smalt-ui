import type { SToastVariant } from '../../composables/useToast'
import type { SColorName } from '../../composables/useColorProp'
import type { SElevation } from '../../composables/useElevationProp'

export type { SToastVariant }

export interface SToastProps {
  /** Toast title. */
  title: string
  /** Additional text below the title. */
  description?: string
  /** Semantic variant: sets the icon, the accent color and how urgently it is announced. */
  variant?: SToastVariant
  /**
   * Accent color (of the icon): a name from the [palette](/style/palette)
   * (`primary`/`teal`/`teal-10`). Overrides the variant color.
   */
  color?: SColorName
  /** Time in milliseconds after which the toast hides automatically. */
  duration?: number
  /** Accessible name of the close button (defaults to the locale dictionary). */
  closeLabel?: string
  /** Square corners: removes the rounding of the toast card. */
  square?: boolean
  /** Removes the shadow. Overridden by the `elevation` prop when it is set. */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
}
