export interface SListItemProps {
  /**
   * Tag of the row itself; the `listitem` wrapper around it stays a `div`. By default the row is
   * a `div`, an `a` when `href` is set and a `button` when `clickable` is.
   */
  as?: string
  /** Link target: renders the row as an `a` and makes it interactive. */
  href?: string
  /** Row title (alternative to the `title` slot). Ignored when the default slot is filled. */
  title?: string
  /** Secondary line under the title (alternative to the `description` slot). */
  description?: string
  /**
   * Leading icon: a registry name or a raw SVG path. Ignored when the `prepend` slot is set.
   */
  icon?: string
  /** Marks the row as the current one: accent color, `aria-current` on a link row. */
  active?: boolean
  /**
   * Makes a plain row an action: it renders as a `button` and gets the interactive styling.
   * A link row (`href`) is interactive without it.
   */
  clickable?: boolean
  /**
   * Disables the row: dimmed, ignores the pointer and, for a link or a button row, the
   * keyboard as well.
   */
  disabled?: boolean
}
