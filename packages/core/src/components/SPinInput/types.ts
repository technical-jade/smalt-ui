import type { SValidationProps } from '../../composables/useValidation'

export type SPinInputType = 'text' | 'number'

export type SPinInputSize = 'sm' | 'md' | 'lg'

export interface SPinInputProps extends SValidationProps<string[]> {
  /** Control id (set on the first cell). Generated automatically when not set (SSR-safe). */
  id?: string
  /** Field label. */
  label?: string
  /** Accessible name of the cell group without a visible label; ignored when `label` is set. */
  ariaLabel?: string
  /** Hint below the field. */
  hint?: string
  /**
   * Error message. When set, the field is marked invalid; the text wins over the `rules` error.
   */
  error?: string
  /** Explicitly marks the field invalid (in addition to `error`). */
  invalid?: boolean
  /** Cell size: `sm` (36px), `md` (44px) or `lg` (52px). @defaultValue 'md' */
  size?: SPinInputSize
  /** Square corners: removes the cell border radius (rounded by default). */
  square?: boolean
  /** Field name in native form submission: the value is sent in a hidden input. */
  name?: string
  /**
   * Accessible name of each cell; `{index}` and `{length}` are replaced with the cell number and
   * the cell count (defaults to the locale dictionary).
   */
  cellLabel?: string
  /** Marks the field as required. */
  required?: boolean
  /** Disables input. */
  disabled?: boolean
  /** Number of code cells. */
  length?: number
  /** Input type: `text` or `number` (digits only). */
  type?: SPinInputType
  /** Hides the entered characters (for secret codes). */
  mask?: boolean
  /**
   * One-time code (OTP) mode: the cells get `autocomplete="one-time-code"`, so the browser can
   * fill in a code from an SMS.
   */
  otp?: boolean
  /** Placeholder character for empty cells. */
  placeholder?: string
}
