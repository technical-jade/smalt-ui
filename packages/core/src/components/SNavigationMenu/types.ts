import type { SElevation } from '../../composables/useElevationProp'

export type SNavigationMenuSize = 'sm' | 'md' | 'lg'

export type SNavigationMenuAlign = 'start' | 'center' | 'end'

export interface SNavigationMenuLink {
  /** Link title. */
  label: string
  /** Link URL. */
  href: string
  /** Optional description below the title. */
  description?: string
  /** Where to open the link (`target`), for example `_blank` for a new tab. */
  target?: string
  /** Relationship to the linked page (`rel`), for example `noopener` or `external`. */
  rel?: string
}

export interface SNavigationMenuItem {
  /** Item label in the navigation bar. */
  label: string
  /** URL, when the item is a direct link (no dropdown panel). Ignored with `links`. */
  href?: string
  /** Nested links, when the item opens a panel. */
  links?: SNavigationMenuLink[]
  /** Where to open the direct link (`target`), for example `_blank`. Ignored with `links`. */
  target?: string
  /** Relationship to the page of the direct link (`rel`). Ignored with `links`. */
  rel?: string
}

export interface SNavigationMenuProps {
  /** Navigation items: a direct link (`href`) or an expandable panel (`links`). */
  items?: readonly SNavigationMenuItem[]
  /** Accessible name of the navigation (`aria-label`). */
  ariaLabel?: string
  /**
   * Size of the bar items and of the panel links: `sm`, `md` or `lg`.
   * @defaultValue 'md'
   */
  size?: SNavigationMenuSize
  /**
   * Alignment of the dropdown panel against the item that opened it: its start (`start`), its
   * center (`center`) or its end (`end`). Near the window edge the panel shifts back into the
   * screen.
   * @defaultValue 'start'
   */
  align?: SNavigationMenuAlign
  /**
   * Number of link columns in the dropdown panel. Without the prop it comes from the
   * `--s-navigation-menu-columns` variable, else 2.
   */
  columns?: number
  /** Square corners: removes the rounding of the dropdown panel. */
  square?: boolean
  /** Removes the shadow. Overridden by the `elevation` prop when it is set. */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
}
