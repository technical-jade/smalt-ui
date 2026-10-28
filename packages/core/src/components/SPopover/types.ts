import type { SElevation } from '../../composables/useElevationProp'

export type SPopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type SPopoverAlign = 'start' | 'center' | 'end'

export interface SPopoverProps {
  /** Square corners: removes the rounding (rounded by default). */
  square?: boolean
  /** Side of the trigger the panel appears on. */
  side?: SPopoverSide
  /** Alignment along the chosen side. */
  align?: SPopoverAlign
  /** Offset from the trigger in pixels. */
  sideOffset?: number
  /** Modal mode: blocks interaction with the background and enables a focus trap. */
  modal?: boolean
  /**
   * Accessible name of the popover panel (`aria-label`). Without it the trigger names the panel.
   */
  ariaLabel?: string
  /** Removes the shadow. Overridden by the `elevation` prop when it is set. */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
}
