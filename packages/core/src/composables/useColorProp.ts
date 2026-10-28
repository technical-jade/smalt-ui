import { computed, type ComputedRef } from 'vue'

/** Brand colors (semantic palette roles). */
export type SBrandColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'positive'
  | 'negative'
  | 'info'
  | 'warning'
  | 'dark'
  | 'dark-page'

/** Material Design palette families. */
export type SPaletteFamily =
  | 'red'
  | 'pink'
  | 'purple'
  | 'deep-purple'
  | 'indigo'
  | 'blue'
  | 'light-blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'light-green'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'deep-orange'
  | 'brown'
  | 'grey'
  | 'blue-grey'

type MaterialStop = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
type GrayStop = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

/**
 * Palette color name for the `color`/`text-color` props: a brand role (`primary`), a Material
 * family (`teal`), a family shade (`teal-10`), a neutral tone (`gray-500`), `white`/`black` or
 * `neutral`, the regular text color of the theme. Resolves to the `var(--s-<name>)` token,
 * `neutral` to `var(--s-color-text)`.
 */
export type SColorName =
  | SBrandColor
  | 'neutral'
  | SPaletteFamily
  | `${SPaletteFamily}-${MaterialStop}`
  | `gray-${GrayStop}`
  | 'white'
  | 'black'

/** CSS value of a palette name. */
export function colorVar(name: SColorName): string {
  return name === 'neutral' ? 'var(--s-color-text)' : `var(--s-${name})`
}

/** Color props, implemented by accent components. */
export interface ColorProps {
  /**
   * Accent color: a [palette](/style/palette) name (`primary`/`teal`/`teal-10`). Overrides the
   * variant color.
   */
  color?: SColorName
  /**
   * Text/icon color on the fill: a [palette](/style/palette) name. Defaults to white; set it for
   * light `color` values.
   */
  textColor?: SColorName
}

/**
 * Style variables for the `color`/`text-color` props, scoped to the BEM prefix `name`
 * (`--s-button-c`) so an inline accent does not leak into nested S-components. `hover`/`active`
 * follow the theme via `--s-shade`, `subtle` is an alpha tint. The `.scss` falls back to the role
 * token, so without `color` nothing changes.
 */
export function useColorProp(
  props: ColorProps,
  name: string,
): ComputedRef<Record<string, string> | undefined> {
  return computed(() => {
    const { color, textColor } = props
    if (!color && !textColor) return undefined
    const style: Record<string, string> = {}
    if (color) {
      const cv = `var(--${name}-c)`
      style[`--${name}-c`] = colorVar(color)
      style[`--${name}-c-hover`] = `color-mix(in srgb, ${cv}, var(--s-shade) 12%)`
      style[`--${name}-c-active`] = `color-mix(in srgb, ${cv}, var(--s-shade) 22%)`
      style[`--${name}-c-subtle`] = `color-mix(in srgb, ${cv} 14%, transparent)`
      // A fill in the theme text color is light in the dark theme: white content would vanish.
      style[`--${name}-c-on`] = color === 'neutral' ? 'var(--s-color-surface)' : '#fff'
    }
    if (textColor) style[`--${name}-c-on`] = colorVar(textColor)
    return style
  })
}
