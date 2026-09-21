export interface SNumberFieldProps {
  /** Control id. Generated automatically (SSR-safe) when not set. */
  id?: string
  /** Field label. */
  label?: string
  /** Hint below the field. */
  hint?: string
  /** Error message. When set, the field is marked invalid. */
  error?: string
  /** Marks the field invalid explicitly (in addition to `error`). */
  invalid?: boolean
  /** Square corners: removes the field border rounding (rounded by default). */
  square?: boolean
  /** Field name in native form submission: the value is sent in a hidden input. */
  name?: string
  /** Marks the field as required. */
  required?: boolean
  /** Disables the field and the step buttons. */
  disabled?: boolean
  /** Minimum value. */
  min?: number
  /** Maximum value. */
  max?: number
  /** Step for the plus/minus buttons and arrow keys. */
  step?: number
  /** Placeholder in an empty field. */
  placeholder?: string
  /** Accessible name of the decrement button (taken from the locale dictionary by default). */
  decrementLabel?: string
  /** Accessible name of the increment button (taken from the locale dictionary by default). */
  incrementLabel?: string
}
