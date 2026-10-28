import type { SValidationProps } from '../../composables/useValidation'

export type SColorFieldSize = 'sm' | 'md' | 'lg'

export interface SColorFieldProps extends SValidationProps<string> {
  /** Field id. Generated automatically when omitted (SSR-safe). */
  id?: string
  /** Field label. */
  label?: string
  /**
   * Floating label: the label sits inside the border, looks like a placeholder at rest and moves
   * up to the top border on focus/when filled. On by default; `false` gives a regular label
   * above. The label size is fixed and does not depend on `size`.
   * `'pinned'` pins the label to the frame: it never drops into the field, and the placeholder of
   * an empty field stays visible.
   */
  floatingLabel?: boolean | 'pinned'
  /** Hint below the field. */
  hint?: string
  /**
   * Error message. When set, the field is marked invalid; the text wins over the `rules` error.
   */
  error?: string
  /** Placeholder in an empty field. */
  placeholder?: string
  /** Field size: `sm` (32px), `md` (40px) or `lg` (48px). @defaultValue 'md' */
  size?: SColorFieldSize
  /** Disables the field. */
  disabled?: boolean
  /** Read-only. */
  readonly?: boolean
  /** Field name in native form submission: the value is sent in a hidden input. */
  name?: string
  /** Marks the field as required: `*` next to the label and native `required` on the input. */
  required?: boolean
  /** Explicitly marks the field invalid (in addition to `error`). */
  invalid?: boolean
  /** Square corners: removes the field border radius (rounded by default). */
  square?: boolean
}
