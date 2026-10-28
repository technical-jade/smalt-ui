import type { SColorName } from '../../composables/useColorProp'

export type SStepperOrientation = 'horizontal' | 'vertical'

export type SStepperLabelPlacement = 'top' | 'bottom' | 'start' | 'end'

export type SStepperActiveVariant = 'tonal' | 'filled'

export interface SStepperItem {
  /** Step title. */
  title: string
  /** Optional description below the title. */
  description?: string
  /**
   * Step icon: replaces the number in the indicator and the check mark of a completed step (a
   * registry name or a raw SVG path).
   */
  icon?: string
  /** Disables the step: it cannot be navigated to and is dimmed. */
  disabled?: boolean
}

export interface SStepperProps {
  /**
   * Accent color (active/completed step): a name from the [palette](/style/palette)
   * (`primary`/`teal`/`teal-10`).
   */
  color?: SColorName
  /**
   * Color of the content on the completed step fill (and on the current one with
   * `active-variant="filled"`): a name from the [palette](/style/palette). White by default when
   * `color` is set.
   */
  textColor?: SColorName
  /** List of steps. Indicators are numbered automatically, starting from 1. */
  items: readonly SStepperItem[]
  /**
   * Layout orientation of the steps. It also sets the direction of arrow key navigation.
   * @defaultValue 'horizontal'
   */
  orientation?: SStepperOrientation
  /**
   * Side of the indicator where the step label goes: `top` and `bottom` are above and below the
   * circle, `start` and `end` are before and after it (left and right in a left-to-right
   * layout). Works in both orientations. Without a value the label is below in the horizontal
   * layout and on the right in the vertical one — there is no shared default, otherwise changing
   * the orientation would move the label.
   */
  labelPlacement?: SStepperLabelPlacement
  /**
   * Width in pixels below which the stepper switches to `narrow-orientation`. It is compared with
   * the width of the parent element, not the window: in a narrow column or a modal the layout
   * breaks even on a wide screen. Without the prop the layout never changes.
   */
  stackAt?: number
  /**
   * Orientation below the `stack-at` threshold. `vertical` by default; `horizontal` together with
   * `orientation="vertical"` gives the reverse: a column when wide and a row when narrow.
   * @defaultValue 'vertical'
   */
  narrowOrientation?: SStepperOrientation
  /**
   * Style of the current step: `tonal` is a pale background with an accent border, `filled` is
   * an accent fill, like completed steps.
   * @defaultValue 'tonal'
   */
  activeVariant?: SStepperActiveVariant
  /**
   * Requires completing steps strictly in order (no skipping ahead). Unavailable steps are not
   * dimmed: future step titles stay readable.
   */
  linear?: boolean
  /** Icon of a completed step (a registry name or a raw path). */
  doneIcon?: string
}
