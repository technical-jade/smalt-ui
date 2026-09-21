export interface SBreadcrumbItem {
  /** Crumb text. */
  label: string
  /** Crumb link. The current item keeps it too, as a link to the page itself. */
  href?: string
  /**
   * Marks the item as the current page (`aria-current="page"`). When no item sets it, the last
   * item is current if it has no `href`.
   */
  current?: boolean
  /** Leading icon of the item. */
  icon?: string
}

export interface SBreadcrumbProps {
  /** Path items from the root to the current page. */
  items?: readonly SBreadcrumbItem[]
  /** Accessible name of the navigation (`aria-label`; defaults to the locale dictionary). */
  ariaLabel?: string
}
