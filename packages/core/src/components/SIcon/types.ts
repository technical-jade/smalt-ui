import type { SColorName } from '../../composables/useColorProp'

// `string & {}` keeps the token names in autocompletion next to arbitrary CSS lengths.
export type SIconSize = 'sm' | 'md' | 'lg' | number | (string & {})

export interface SIconProps {
  /**
   * Icon: a registry name (`chevron-down`, `check`, …; see `registerIcons`) or a raw SVG path
   * (`d`). Ignored when content is passed to the default slot.
   */
  icon?: string
  /**
   * Icon color: a name from the [palette](/style/palette) (`primary`/`teal`/`teal-10`). Without
   * it, the icon inherits the parent's color through `currentColor`.
   */
  color?: SColorName
  /**
   * Size: a token (`sm` 16px / `md` 20px / `lg` 24px), a number of pixels, or a CSS length such as
   * `1em` to follow the surrounding font size.
   */
  size?: SIconSize
  /**
   * Accessible name of the icon. When set, `role="img"` is applied; otherwise the icon is hidden
   * from screen readers.
   */
  label?: string
  /** SVG viewBox. */
  viewBox?: string
}
