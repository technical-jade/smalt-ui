import type { SBadgeVariant, SBadgeSize } from '../SBadge'
import type { SColorName } from '../../composables/useColorProp'

export interface STagProps {
  /**
   * Color variant: neutral or semantic. `primary` is a solid fill; the others are a soft
   * background with colored text.
   */
  variant?: SBadgeVariant
  /**
   * Accent color: a name from the [palette](/style/palette) (`primary`/`teal`/`teal-10`).
   * Overrides the variant color and keeps its style (a fill for `primary`, a soft background for
   * the others).
   */
  color?: SColorName
  /**
   * Text/icon color on the fill (the `primary` variant): a name from the
   * [palette](/style/palette). White by default when `color` is set.
   */
  textColor?: SColorName
  /** Size: `sm`, `md`, or `lg`. */
  size?: SBadgeSize
  /** Square corners: removes the rounding (rounded by default). */
  square?: boolean
  /** Leading icon: a registry name or a raw SVG path. */
  icon?: string
  /** Shows a remove button (a cross). Emits `remove` on click. */
  removable?: boolean
  /** Remove button icon: a registry name or a raw SVG path. */
  removeIcon?: string
  /** Accessible name of the remove button (taken from the locale dictionary by default). */
  removeLabel?: string
}
