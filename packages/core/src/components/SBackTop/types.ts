import type { SColorName } from '../../composables/useColorProp'
import type { SButtonSize, SButtonVariant } from '../SButton'

export type SBackTopBehavior = 'smooth' | 'auto'

export interface SBackTopProps {
  /**
   * CSS selector of the scrollable container to watch and scroll. Without it the component
   * follows the window. The selector is resolved once, when the component mounts.
   */
  target?: string
  /** Scroll distance in pixels after which the button appears. */
  visibilityHeight?: number
  /**
   * Scrolling behavior: animated (`smooth`) or instant (`auto`). `smooth` turns into `auto` for
   * visitors whose system asks for reduced motion.
   */
  behavior?: SBackTopBehavior
  /** Button icon: a registry name or a raw SVG path. */
  icon?: string
  /**
   * Accessible name of the button. Defaults to the locale dictionary entry (`backToTop`).
   */
  label?: string
  /** Button size: `sm` (32px), `md` (40px) or `lg` (48px). */
  size?: SButtonSize
  /**
   * Visual variant of the button: filled `primary`/`secondary`/`negative`, outlined `outline` or
   * transparent `ghost`.
   */
  variant?: SButtonVariant
  /**
   * Accent color: a name from the [palette](/style/palette) (`primary`/`teal`/`teal-10`).
   * Overrides the variant color.
   */
  color?: SColorName
  /** Circular button. Set `false` for a rounded square. */
  round?: boolean
}
