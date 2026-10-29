import type { SColorName } from '../../composables/useColorProp'
import type { SElevation } from '../../composables/useElevationProp'
import type { SButtonSize, SButtonVariant } from '../SButton'

export type SButtonGroupOrientation = 'horizontal' | 'vertical'

export interface SButtonGroupProps {
  /** Direction the buttons are laid out in: side by side or stacked. */
  orientation?: SButtonGroupOrientation
  /**
   * Buttons share an edge: inner corners are flattened and neighbouring borders collapse into a
   * single line. Turn it off to keep each button's own shape and space them out instead.
   */
  attached?: boolean
  /** Accessible name of the group (`aria-label`). Without it the group stays unnamed. */
  label?: string
  /** Size of every button in the group; a `size` set on a button itself wins. */
  size?: SButtonSize
  /** Variant of every button in the group; a `variant` set on a button itself wins. */
  variant?: Exclude<SButtonVariant, 'link'>
  /**
   * Accent color of every button in the group: a name from the [palette](/style/palette)
   * (`primary`/`teal`/`teal-10`). A `color` set on a button itself wins.
   */
  color?: SColorName
  /** Square corners on every button in the group; a `square` set on a button itself wins. */
  square?: boolean
  /** Pill shape on every button in the group; a `round` set on a button itself wins. */
  round?: boolean
  /** Disables every button in the group; a `disabled` set on a button itself wins. */
  disabled?: boolean
  /**
   * No shadow. An attached group of filled buttons casts one shadow for the whole group; in a
   * detached group `flat` reaches every button, and a `flat` set on a button itself wins.
   */
  flat?: boolean
  /**
   * Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. An
   * attached group applies it to its own shadow, a detached one passes it to every button.
   */
  elevation?: SElevation
}
