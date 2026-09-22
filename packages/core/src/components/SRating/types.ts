import type { SColorName } from '../../composables/useColorProp'
import type { SValidationProps } from '../../composables/useValidation'

export type SRatingSize = 'sm' | 'md' | 'lg' | number

export interface SRatingProps extends SValidationProps<number> {
  /**
   * Star color: a name from the [palette](/style/palette) (`primary`/`teal`/`teal-10`). Gold
   * `amber` by default.
   */
  color?: SColorName
  /** Item size: a token (`sm` 16px / `md` 20px / `lg` 24px) or a number of pixels. */
  size?: SRatingSize
  /** Number of items (stars). */
  length?: number
  /** Read-only: shows the rating without letting the user change it. */
  readonly?: boolean
  /** Disables interaction. */
  disabled?: boolean
  /** Allows half ratings (step 0.5). */
  allowHalf?: boolean
  /** Clicking the current rating again resets it to 0. */
  clearable?: boolean
  /** Item icon (registry name or raw path). */
  icon?: string
  /** Icon of a selected/filled item (registry name or raw path). */
  selectedIcon?: string
  /** Accessible name of the rating (`aria-label`). */
  ariaLabel?: string
  /** Hint below the rating. */
  hint?: string
  /** Error message below the rating. When set, the rating is marked invalid. */
  error?: string
  /** Marks the rating invalid explicitly (in addition to `error`). */
  invalid?: boolean
}
