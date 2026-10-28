import type { SValidationProps } from '../../composables/useValidation'

export type SNumberFieldSize = 'sm' | 'md' | 'lg'

export interface SNumberFieldProps extends SValidationProps<number | null> {
  /** Control id. Generated automatically (SSR-safe) when not set. */
  id?: string
  /** Field label. */
  label?: string
  /**
   * Puts the label on the top edge of the frame instead of above the field, so the field lines up
   * with neighboring fields that have a floating label. The step buttons take the field edges,
   * so the label always stays raised, and `'pinned'` works the same as `true`. Off by default.
   */
  floatingLabel?: boolean | 'pinned'
  /** Hint below the field. */
  hint?: string
  /** Error message. When set, the field is marked invalid. */
  error?: string
  /** Marks the field invalid explicitly (in addition to `error`). */
  invalid?: boolean
  /** Field size: `sm` (32px), `md` (40px) or `lg` (48px). @defaultValue 'md' */
  size?: SNumberFieldSize
  /** Square corners: removes the field border rounding (rounded by default). */
  square?: boolean
  /**
   * Stretches the field across its container, like `SInput`: the step buttons stay at the edges
   * and the input takes the free space. Without it the field is as wide as its content, and the
   * `--s-number-field-input-width` CSS variable sets the input width (`4rem` by default).
   */
  stretch?: boolean
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
  /**
   * Number formatting locale, a BCP 47 tag (`de-DE` shows `1.234,5`). Derived from the library
   * locale by default (`ConfigProvider`/`installLocale`, the `locale` option in Nuxt): `en` →
   * `en-US` (`1,234.5`). Typed input is parsed with the same locale.
   */
  locale?: string
  /** Placeholder in an empty field. */
  placeholder?: string
  /** Accessible name of the decrement button (taken from the locale dictionary by default). */
  decrementLabel?: string
  /** Accessible name of the increment button (taken from the locale dictionary by default). */
  incrementLabel?: string
}
