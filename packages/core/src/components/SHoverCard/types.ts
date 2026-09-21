import type { SElevation } from '../../composables/useElevationProp'

export type SHoverCardSide = 'top' | 'right' | 'bottom' | 'left'
export type SHoverCardAlign = 'start' | 'center' | 'end'

export interface SHoverCardProps {
  /** Square corners: removes the rounding (rounded by default). */
  square?: boolean
  /** Side of the trigger the card appears on. */
  side?: SHoverCardSide
  /** Alignment along the chosen side. */
  align?: SHoverCardAlign
  /** Offset from the trigger in pixels. */
  sideOffset?: number
  /** Delay before opening after hover, in ms. */
  openDelay?: number
  /** Delay before closing after the pointer leaves, in ms. */
  closeDelay?: number
  /**
   * Opens the card on tap on touch devices. Off by default: a hover card only supplements its
   * trigger, and a link trigger should keep navigating on tap.
   */
  enableTouch?: boolean
  /** Removes the shadow. Overridden by the `elevation` prop when it is set. */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
}
