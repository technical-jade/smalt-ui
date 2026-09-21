import type { SColorName } from '../../composables/useColorProp'

export type SCheckboxAlign = 'start' | 'center'

export interface SCheckboxProps {
  /**
   * Accent color (checked state): a name from the [palette](/style/palette)
   * (`primary`/`teal`/`teal-10`).
   */
  color?: SColorName
  /** Check mark color on the fill: a name from the [palette](/style/palette). White by default. */
  textColor?: SColorName
  /** Label text next to the checkbox (can be replaced with the default slot). */
  label?: string
  /** Accessible name of the checkbox when there is no visible label (a table row selector). */
  ariaLabel?: string
  /** Checkbox value in a group/form (the `value` attribute). */
  value?: string
  /** Disables the checkbox. */
  disabled?: boolean
  /** Field name in native form submission: the value is sent in a hidden input. */
  name?: string
  /** Required for form submission. */
  required?: boolean
  /** Hint below the checkbox. */
  hint?: string
  /** Error message below the checkbox. When set, the checkbox is marked invalid. */
  error?: string
  /** Marks the checkbox invalid explicitly (in addition to `error`). */
  invalid?: boolean
  /** Checked state icon (a registry name or a raw path). */
  checkedIcon?: string
  /** Indeterminate state icon (a registry name or a raw path). */
  indeterminateIcon?: string
  /**
   * Vertical alignment of the box relative to the label: `start` aligns it with the first line,
   * `center` with the middle of a multi-line label.
   * @defaultValue 'start'
   */
  align?: SCheckboxAlign
  /**
   * Stretches the checkbox to the container width; the label takes the free space. A click
   * anywhere on the row selects the option, which turns the component into a selection card.
   */
  stretch?: boolean
  /** Checkbox id. Generated automatically (SSR-safe) when not set. */
  id?: string
}
