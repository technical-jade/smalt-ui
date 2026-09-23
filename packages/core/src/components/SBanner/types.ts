import type { SColorName } from '../../composables/useColorProp'
import type { SAlertVariant } from '../SAlert/types'

/**
 * Status vocabulary of [SAlert](./alert) plus `neutral` — an announcement that reports no status
 * (a cookie notice, a new release). The union is derived so that both components keep naming the
 * statuses the same way.
 */
export type SBannerVariant = SAlertVariant | 'neutral'

export interface SBannerProps {
  /**
   * Semantic variant: `neutral`/`info`/`positive`/`warning`/`negative`. `neutral` by default —
   * a banner usually carries an announcement, while a status is the exception.
   */
  variant?: SBannerVariant
  /**
   * Accent color: a name from the [palette](/style/palette) (`primary`/`teal`/`teal-10`).
   * Overrides the variant color.
   */
  color?: SColorName
  /** Title above the message (can be replaced with the `title` slot). */
  title?: string
  /**
   * Icon (a registry name or a raw SVG path). Overrides the variant's status icon; `false`
   * leaves the banner without one. The `icon` slot takes precedence.
   */
  icon?: string | false
  /** Shows the close button: it hides the banner and emits `close`. */
  closable?: boolean
  /** Accessible name of the close button (defaults to the locale dictionary). */
  closeLabel?: string
  /**
   * Sticks the banner to the top of its scroll container while the page scrolls under it.
   */
  sticky?: boolean
  /** Outlines the banner with a border in the variant color. */
  bordered?: boolean
  /**
   * Square corners. Enabled by default: a banner spans the whole application width, and rounded
   * corners against the window edges look like a mistake. Set `:square="false"` for a banner
   * inset into the content.
   */
  square?: boolean
}
