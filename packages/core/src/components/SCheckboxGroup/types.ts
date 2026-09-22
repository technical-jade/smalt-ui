import type { HTMLAttributes } from 'vue'
import type { SValidationProps } from '../../composables/useValidation'

export type SCheckboxGroupOrientation = 'vertical' | 'horizontal'

export type SCheckboxGroupSize = 'sm' | 'md' | 'lg'

export interface SCheckboxGroupOption {
  label: string
  value: string
  disabled?: boolean
  hint?: string
}

export interface SCheckboxGroupProps extends SValidationProps<string[]> {
  /** List of options. Alternatively, pass `SCheckbox` items in the default slot. */
  options?: readonly SCheckboxGroupOption[]
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
  orientation?: SCheckboxGroupOrientation
  /** Size of the group title. @defaultValue 'md' */
  size?: SCheckboxGroupSize
  /**
   * Class of the options container (`.s-checkbox-group`). The component's own `class` and
   * `style` go to the field wrapper along with the title and hint, while the options layout
   * lives here.
   */
  groupClass?: HTMLAttributes['class']
  /** Disables the whole group. */
  disabled?: boolean
  /** Field name in native form submission: the checked values are sent in a hidden input. */
  name?: string
  /** A choice is required for form submission. */
  required?: boolean
  /** Accessible name of the group when there is no visible `label`. */
  ariaLabel?: string
}
