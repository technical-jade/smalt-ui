export type SDrawerSide = 'left' | 'right' | 'top' | 'bottom'

export interface SDrawerProps {
  /** Square corners: removes the rounding (rounded by default). */
  square?: boolean
  /** Side the drawer is attached to. */
  side?: SDrawerSide
  /**
   * Width of a `left`/`right` drawer: a CSS length or a number in pixels; `100%` opens it across
   * the whole screen. Ignored for `top`/`bottom`, where `height` applies. Without the prop the
   * width comes from the `--s-drawer-size` variable, else `min(90vw, 22rem)`. The drawer is never
   * wider than the screen.
   */
  width?: string | number
  /**
   * Height of a `top`/`bottom` drawer: a CSS length or a number in pixels; `100%` opens it across
   * the whole screen. Ignored for `left`/`right`, where `width` applies. Without the prop the
   * height comes from the `--s-drawer-size` variable, else `min(90vh, 20rem)`. The drawer is
   * never taller than the screen.
   */
  height?: string | number
  /**
   * Drawer title (can be replaced with the `title` slot). Without a title the drawer takes its
   * accessible name from a hidden "Panel" label in the locale dictionary.
   */
  title?: string
  /** Description below the title (can be replaced with the `description` slot). */
  description?: string
  /** Accessible name of the close button (taken from the locale dictionary by default). */
  closeLabel?: string
}
