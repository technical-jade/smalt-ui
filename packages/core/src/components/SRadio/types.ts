import type { SColorName } from '../../composables/useColorProp'

export type SRadioAlign = 'start' | 'center'

export interface SRadioProps {
  /**
   * Accent color (checked state): a name from the [palette](/style/palette)
   * (`primary`/`teal`/`teal-10`).
   */
  color?: SColorName
  /** Value set on the group when this option is selected. */
  value: string
  /** Label text next to the radio (can be replaced with the default slot). */
  label?: string
  /** Accessible name of the option without a visible label (a color swatch, for example). */
  ariaLabel?: string
  /** Disables only this option. */
  disabled?: boolean
  /**
   * Vertical alignment of the dot relative to the label: `start` aligns it with the first line,
   * `center` with the middle of a multi-line label.
   * @defaultValue 'start'
   */
  align?: SRadioAlign
  /**
   * Stretches the radio to the container width, with the label taking the free space. A click
   * anywhere on the row selects the option, which turns the component into a choice card.
   */
  stretch?: boolean
  /** Element id. Generated automatically when not set (SSR-safe). */
  id?: string
}
