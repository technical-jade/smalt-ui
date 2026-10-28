import type { SColorName } from '../../composables/useColorProp'

export type SToggleSize = 'sm' | 'md' | 'lg'
export type SToggleVariant = 'tonal' | 'outline'

export interface SToggleProps {
  /**
   * Color of the on state: a name from the [palette](/style/palette)
   * (`primary`/`teal`/`teal-10`).
   */
  color?: SColorName
  /**
   * Item value inside `SToggleGroup` (unique within the group). Not set on a standalone toggle.
   */
  value?: string
  /** Size: `sm`, `md` or `lg`. */
  size?: SToggleSize
  /**
   * Look of the on state: `tonal` is a tonal fill, `outline` an accent-colored border without a
   * fill (selectable cards). `color` sets the color of both. @defaultValue 'tonal'
   */
  variant?: SToggleVariant
  /** Square corners: removes the border radius (rounded by default). */
  square?: boolean
  /** Disables the toggle. */
  disabled?: boolean
  /** Accessible name: set it when the toggle content is only an icon. */
  ariaLabel?: string
}
