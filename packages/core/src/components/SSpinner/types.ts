import type { SColorName } from '../../composables/useColorProp'

export type SSpinnerSize = 'sm' | 'md' | 'lg'
export type SSpinnerVariant = 'primary' | 'neutral' | 'current'

export interface SSpinnerProps {
  /** Size: `sm`, `md`, or `lg`. */
  size?: SSpinnerSize
  /** Color: accent (`primary`), neutral (`neutral`), or inherited (`current`). */
  variant?: SSpinnerVariant
  /**
   * Spinner color: a name from the [palette](/style/palette) (`primary`/`teal`/`teal-10`).
   * Overrides the color of any variant, `neutral` and `current` included.
   */
  color?: SColorName
  /**
   * Accessible name for screen readers: with it the spinner gets `role="status"`; without it the
   * spinner is decorative and hidden from screen readers.
   */
  label?: string
}
