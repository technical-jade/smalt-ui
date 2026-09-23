import type { SColorName } from '../../composables/useColorProp'
import type { SElevation } from '../../composables/useElevationProp'

export type SAppBarPosition = 'static' | 'sticky' | 'fixed'

export interface SAppBarProps {
  /**
   * How the bar is anchored: `static` scrolls away with the page, `sticky` stays at the top of
   * the viewport while keeping its place in the flow, `fixed` leaves the flow entirely (the page
   * then reserves the height by itself).
   * @defaultValue 'sticky'
   */
  position?: SAppBarPosition
  /**
   * Bar height: a CSS length or a number of pixels. The value is published as
   * `--s-app-bar-height` on the shell, so the page and the sidebar offset by it without measuring
   * anything. `3.5rem` by default.
   */
  height?: string | number
  /**
   * Hairline along the bottom edge.
   * @defaultValue true
   */
  bordered?: boolean
  /**
   * Raises the bar with a shadow once the window is scrolled — the Material behaviour for a bar
   * that overlaps content. The `elevation` prop wins when it is set, giving a constant shadow.
   * @defaultValue false
   */
  elevateOnScroll?: boolean
  /**
   * Surface color: a name from the [palette](/style/palette) (`primary`/`teal`/`teal-10`).
   * Replaces the default surface.
   */
  color?: SColorName
  /**
   * Content color on the fill: a name from the [palette](/style/palette). White by default (set it
   * for light `color` values).
   */
  textColor?: SColorName
  /** Removes the shadow. Overridden by the `elevation` prop when it is set. */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
  /**
   * Marks the bar as the page's `banner` landmark. Turn it off for a bar that is not the
   * document's own header — a bar inside a panel, or a second bar on the same page.
   * @defaultValue true
   */
  landmark?: boolean
}
