import type { SColorName } from '../../composables/useColorProp'

export type SBadgeVariant = 'neutral' | 'primary' | 'positive' | 'warning' | 'negative'
export type SBadgeSize = 'sm' | 'md' | 'lg'

export interface SBadgeProps {
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
   * Text/icon color on the fill: a name from the [palette](/style/palette). Applies to the
   * `primary` variant only: white by default when `color` is set (set it for light colors). Soft
   * variants color the text with `color`.
   */
  textColor?: SColorName
  /** Size: `sm`, `md` or `lg`. */
  size?: SBadgeSize

  /** Square corners: removes the border radius (rounded by default). */
  square?: boolean
  /** Leading icon: a registry name or a raw SVG path. */
  icon?: string
  /** Trailing icon: a registry name or a raw SVG path. */
  iconRight?: string
}
