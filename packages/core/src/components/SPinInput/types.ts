export type SPinInputType = 'text' | 'number'

export interface SPinInputProps {
  /** Control id. Generated automatically when not set (SSR-safe). */
  id?: string
  /** Field label. */
  label?: string
  /** Hint below the field. */
  hint?: string
  /** Error message. When set, the field is marked invalid. */
  error?: string
  /** Explicitly marks the field invalid (in addition to `error`). */
  invalid?: boolean
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
  /** One-time code (OTP) mode: autofill from SMS or the clipboard on mobile. */
  otp?: boolean
  /** Placeholder character for empty cells. */
  placeholder?: string
}
