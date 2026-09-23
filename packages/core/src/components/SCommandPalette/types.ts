import type { SElevation } from '../../composables/useElevationProp'

export interface SCommandItem {
  /** Identity of the command: the row is keyed by it and `select` reports the whole item. */
  id: string
  /** Command name: what the row shows and what the search matches first. */
  label: string
  /** Secondary text in the row: what the command does or where it leads. */
  description?: string
  /** Leading icon of the row (a registry name or a raw SVG path). */
  icon?: string
  /**
   * Shortcut of the command, one entry per key (`['meta', 'k']`), shown as `SKbd` hints at the
   * end of the row. The hint is a reminder only — the application binds the keys itself.
   */
  shortcut?: string[]
  /** The row is listed but cannot be selected, and the arrow keys skip it. */
  disabled?: boolean
  /**
   * Extra words the search matches without showing them: synonyms, the name the command used to
   * have, the term the user knows from another product.
   */
  keywords?: string[]
}

export interface SCommandGroup {
  /** Heading above the group. Without it the commands are listed with no heading. */
  label?: string
  /** Commands of the group, in the order they are listed. */
  items: SCommandItem[]
}

export interface SCommandPaletteProps {
  /** Commands to list, split into groups. */
  groups: SCommandGroup[]
  /** Placeholder and accessible name of the search input (defaults to the locale dictionary). */
  placeholder?: string
  /** Text shown when nothing matches the query (defaults to the locale dictionary). */
  emptyText?: string
  /**
   * Filters `groups` by the query. Turn it off when the application searches server-side: what
   * it puts into `groups` is then listed as it arrives.
   * @defaultValue true
   */
  filter?: boolean
  /**
   * Key that opens the palette together with Cmd (macOS) or Ctrl. `false` binds nothing and
   * leaves `v-model:open` as the only way in.
   * @defaultValue 'k'
   */
  shortcutKey?: string | false
  /** A search is in flight: a spinner appears in the input and the list reports it. */
  loading?: boolean
  /**
   * Height the list may grow to before it scrolls (`22rem` by default); a number means pixels.
   * The list also never grows past 60% of the window height, so the palette stays on screen.
   */
  maxHeight?: string | number
  /** Square corners: removes the rounding of the panel. */
  square?: boolean
  /** Removes the shadow. Overridden by the `elevation` prop when it is set. */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
}
