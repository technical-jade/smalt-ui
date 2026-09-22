import type { SColorName } from '../../composables/useColorProp'

export type SStatSize = 'sm' | 'md' | 'lg'
export type SStatVariant = 'plain' | 'card'

export interface SStatProps {
  /**
   * What the number means (`Revenue`, `Active users`). Required: a value without a name tells a
   * reader nothing, and it is the accessible name of the tile.
   */
  label: string
  /**
   * The metric itself. A number goes through `Intl.NumberFormat` (see `formatValue`); a string is
   * rendered as given, for values that are already formatted (`$12.5K`, `99.9%`).
   */
  value: string | number
  /** Explanatory line under the value: the period, the source, a comparison. */
  description?: string
  /**
   * Icon next to the label: a registry name (`users`, `credit-card`, …) or a raw SVG path.
   * Decorative — the meaning is carried by the label.
   */
  icon?: string
  /**
   * Signed change of the metric: a positive number renders the upward treatment, a negative one
   * the downward treatment, `0` the neutral one. The direction is announced with a hidden label,
   * so it is not conveyed by the color and the arrow alone.
   */
  trend?: number
  /** Text next to the trend: what the change is measured against (`vs last month`). */
  trendLabel?: string
  /** Hidden label of an upward trend; by default it comes from the locale dictionary. */
  trendUpLabel?: string
  /** Hidden label of a downward trend; by default it comes from the locale dictionary. */
  trendDownLabel?: string
  /**
   * Formatting of a numeric `value`: `true` adds the thousands separators of the current locale,
   * `false` prints the number as is, and an object is passed to `Intl.NumberFormat` as its
   * options (`{ style: 'currency', currency: 'USD' }`). A string `value` is never formatted; the
   * trend keeps its sign in every case.
   * @defaultValue true
   */
  formatValue?: boolean | Intl.NumberFormatOptions
  /**
   * Formatting locale (for example `en-GB`). Derived from the library locale by default
   * (`ConfigProvider`/`installLocale`, in Nuxt the `locale` option): `en` → `en-US`.
   */
  locale?: string
  /** Accent color of the icon: a name from the [palette](/style/palette) (`primary`/`teal`). */
  color?: SColorName
  /**
   * Size: scales the value, the spacing and the icon.
   * @defaultValue 'md'
   */
  size?: SStatSize
  /**
   * Surface: `plain` is bare text meant to sit inside an [`SCard`](./card) or a grid, `card`
   * gives the tile its own surface, border and padding.
   * @defaultValue 'plain'
   */
  variant?: SStatVariant
  /** Square corners of the `card` variant: removes the border radius. */
  square?: boolean
  /**
   * The data is still loading: the value and the label are replaced with skeletons and the tile
   * is marked `aria-busy`.
   */
  loading?: boolean
}
