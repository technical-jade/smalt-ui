import type { SColorName } from '../../composables/useColorProp'
import type { SElevation } from '../../composables/useElevationProp'

export type SButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'negative'
export type SButtonSize = 'sm' | 'md' | 'lg'

export interface SButtonProps {
  /** Tag/component to render (polymorphism). `button` by default. */
  as?: string
  /**
   * Visual variant: filled `primary`/`secondary`/`negative`, outlined `outline` or transparent
   * `ghost`.
   */
  variant?: SButtonVariant
  /**
   * Accent color: a name from the [palette](/style/palette) (`primary`/`teal`/`teal-10`).
   * Overrides the variant color.
   */
  color?: SColorName
  /**
   * Text/icon color on the fill: a name from the [palette](/style/palette). White by default
   * (set it for light `color` values).
   */
  textColor?: SColorName
  /** Button size: `sm` (32px), `md` (40px) or `lg` (48px). */
  size?: SButtonSize
  /** Fully rounded edges (pill shape). */
  round?: boolean
  /** Square corners: removes the border radius (rounded by default). */
  square?: boolean
  /** `type` of the native button (ignored when `as` is not `button`). */
  type?: 'button' | 'submit' | 'reset'
  /** Disables the button. */
  disabled?: boolean
  /**
   * Loading state: shows a spinner over the content and blocks interaction. The button keeps its
   * width and its accessible name.
   */
  loading?: boolean
  /**
   * Icon button: a square sized by the control height, without horizontal padding. Turns on
   * automatically when an icon is set without a text label; the prop is needed when the content
   * comes from a slot. Such a button requires `ariaLabel` — a screen reader has nothing else to
   * announce.
   */
  iconOnly?: boolean
  /**
   * Button without a shadow. Filled variants (`primary`/`secondary`/`negative`) have a built-in
   * shadow; `flat` removes it without affecting other components' shadows. Can also be set
   * globally: `installDefaults(app, { SButton: { flat: true } })`.
   */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
  /**
   * Leading icon: a registry name or a raw SVG path. Ignored when the `leading` slot is set.
   */
  icon?: string
  /**
   * Trailing icon: a registry name or a raw SVG path. Ignored when the `trailing` slot is set.
   */
  iconRight?: string
  /** Accessible name of the button. Required for icon-only buttons (no text label). */
  ariaLabel?: string
}
