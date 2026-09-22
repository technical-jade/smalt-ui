import type { HTMLAttributes } from 'vue'

export type SRadioGroupOrientation = 'vertical' | 'horizontal'

export interface SRadioOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SRadioGroupProps {
  /** List of options. Alternatively, pass `SRadio` items in the default slot. */
  options?: readonly SRadioOption[]
  /** Group title. Linked to the group via `aria-labelledby`. */
  label?: string
  /** Hint below the group. */
  hint?: string
  /** Error message below the group. When set, the group is marked invalid. */
  error?: string
  /** Marks the group invalid explicitly (in addition to `error`). */
  invalid?: boolean
  /** Group id. Generated automatically (SSR-safe) when not set. */
  id?: string
  /** Layout orientation: `vertical` (default) or `horizontal`. */
  orientation?: SRadioGroupOrientation
  /**
   * Class of the options container (`.s-radio-group`). The component's own `class` and `style`
   * go to the field wrapper along with the title and hint, while the options layout lives here.
   */
  groupClass?: HTMLAttributes['class']
  /** Disables the whole group. */
  disabled?: boolean
  /** Field name in native form submission: the value is sent in a hidden input. */
  name?: string
  /** Selection is required for form submission. */
  required?: boolean
  /** Accessible name of the group when there is no visible `label`. */
  ariaLabel?: string
}
