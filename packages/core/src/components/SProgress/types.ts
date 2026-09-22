import type { SColorName } from '../../composables/useColorProp'

export type SProgressSize = 'sm' | 'md' | 'lg'
export type SProgressVariant = 'primary' | 'positive' | 'warning' | 'negative'

export interface SProgressProps {
  /** Current value. `null` or unset means indeterminate progress (animated). */
  value?: number | null
  /** Maximum value (100% of the scale). */
  max?: number
  /** Bar thickness: `sm`/`md`/`lg`. */
  size?: SProgressSize
  /** Fill color variant. */
  variant?: SProgressVariant
  // A separate prop, not a `variant` value: `variant` is the color axis and serves both forms.
  /** Draw a ring instead of a linear bar. */
  circular?: boolean
  /** Ring stroke width in px. Defaults to a width derived from `size`. Circular form only. */
  thickness?: number
  /**
   * Show the percentage in the middle of the ring. Ignored while indeterminate and when the
   * default slot is filled. Circular form only.
   */
  showValue?: boolean
  /**
   * Accent color: a name from the [palette](/style/palette) (`primary`/`teal`/`teal-10`).
   * Overrides the variant color.
   */
  color?: SColorName
  /** Accessible name (`aria-label`) when there is no visible label. */
  label?: string
}
