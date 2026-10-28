import type { SElevation } from '../../composables/useElevationProp'

export interface SMenubarOption {
  /**
   * Entry type: an item (`item`, the default), a separator (`separator`) or a group heading
   * (`label`).
   */
  type?: 'item' | 'separator' | 'label'
  /** Item or heading text. Not needed for `separator`. */
  label?: string
  /**
   * Value passed to the `select` event when the item is selected. An item without it emits no
   * `select`.
   */
  value?: string
  /**
   * Leading icon of the item: a registry name (see `registerIcons`) or a raw SVG path (`d`).
   * Rendered via `SIcon`.
   */
  icon?: string
  /** Disables the item. */
  disabled?: boolean
  /** Destructive action: red accent. */
  danger?: boolean
}

export interface SMenubarMenu {
  /** Menu label in the bar (e.g. "File"). */
  label: string
  /** Dropdown menu items. */
  items: readonly SMenubarOption[]
  /** Disables the whole menu. */
  disabled?: boolean
}

export interface SMenubarProps {
  /** Square corners: removes the bar and menu border radius (rounded by default). */
  square?: boolean
  /** Menus of the bar (each is a label + items). */
  menus?: SMenubarMenu[]
  /** Accessible name of the menu bar (`aria-label`). */
  ariaLabel?: string
  /** Removes the shadow. Overridden by the `elevation` prop when it is set. */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
}
