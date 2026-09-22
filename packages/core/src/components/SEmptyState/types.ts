import type { SColorName } from '../../composables/useColorProp'

export type SEmptyStateSize = 'sm' | 'md' | 'lg'

export interface SEmptyStateProps {
  /** Title of the placeholder. Without it the text comes from the locale dictionary. */
  title?: string
  /** Explanatory text under the title (can be replaced with the `description` slot). */
  description?: string
  /**
   * Icon above the title: a registry name (`search`, `folder`, …) or a raw SVG path. The `image`
   * prop and the `icon` slot take precedence.
   */
  icon?: string
  /**
   * URL of an illustration shown instead of the icon. It is decorative: the accessible name of
   * the block is carried by the title.
   */
  image?: string
  /**
   * Size: scales the icon, the spacing and the type scale.
   * @defaultValue 'md'
   */
  size?: SEmptyStateSize
  /**
   * Icon accent color: a name from the [palette](/style/palette) (`primary`/`teal`/`teal-10`).
   */
  color?: SColorName
}
