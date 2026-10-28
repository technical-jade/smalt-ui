import type { SColorName } from '../../composables/useColorProp'

export type SSeparatorOrientation = 'horizontal' | 'vertical'
export type SSeparatorLineStyle = 'solid' | 'dashed' | 'dotted'

export interface SSeparatorProps {
  /**
   * Line color: a name from the [palette](/style/palette) (`primary`/`teal`/`teal-10`). The label
   * stays muted. Defaults to the theme border color.
   */
  color?: SColorName
  /**
   * Line orientation: `horizontal` spans the full width, `vertical` the full height of the
   * container.
   */
  orientation?: SSeparatorOrientation
  /**
   * Line style: `solid`, `dashed` or `dotted`. Applies to a labeled separator too.
   * @defaultValue 'solid'
   */
  lineStyle?: SSeparatorLineStyle
  /**
   * When `true`, the separator is purely decorative and hidden from screen readers
   * (`role="none"`).
   */
  decorative?: boolean
  /** Label text in the center of a horizontal separator (alternative to the default slot). */
  label?: string
}
