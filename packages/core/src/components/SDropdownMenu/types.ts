import type { SElevation } from '../../composables/useElevationProp'

export type SDropdownMenuSide = 'top' | 'right' | 'bottom' | 'left'
export type SDropdownMenuAlign = 'start' | 'center' | 'end'

export interface SDropdownMenuOption {
  /** Entry type: item (`item`, the default), separator (`separator`) or group heading (`label`). */
  type?: 'item' | 'separator' | 'label'
  /** Item or heading text. Not needed for `separator`. */
  label?: string
  /**
   * Value passed to the `select` event when the item is selected. An item without it emits no
   * `select`.
   */
  value?: string
  /**
   * Leading item icon: a registry name (see `registerIcons`) or a raw SVG path (`d`).
   * Rendered via `SIcon`.
   */
  icon?: string
  /** Disables the item. */
  disabled?: boolean
  /** Destructive action: red accent (e.g. "Delete"). */
  danger?: boolean
}

export interface SDropdownMenuProps {
  /** Square corners: removes the menu rounding (rounded by default). */
  square?: boolean
  /** Menu entries (alternative to the default slot). */
  items?: readonly SDropdownMenuOption[]
  /** Side of the trigger the menu appears on. */
  side?: SDropdownMenuSide
  /** Alignment along the chosen side. */
  align?: SDropdownMenuAlign
  /** Offset from the trigger in pixels. */
  sideOffset?: number
  /**
   * Modal mode: blocks interaction with the background and enables a focus trap. `false` by
   * default, so page scroll is not locked (otherwise the scrollbar disappears on open and the
   * layout shifts).
   */
  modal?: boolean
  /**
   * Accessible name of the menu (`aria-label`). Without it the menu is named by the trigger text.
   */
  ariaLabel?: string
  /** Removes the shadow. Overridden by the `elevation` prop when it is set. */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
}
