export type SColorFieldSize = 'sm' | 'md' | 'lg'

export interface SColorFieldProps {
  /** Field id. Generated automatically when omitted (SSR-safe). */
  id?: string
  /** Field label. */
  label?: string
  /**
   * Floating label: the label sits inside the border, looks like a placeholder at rest and moves
   * up to the top border on focus/when filled. On by default; `false` gives a regular label
   * above. The label size is fixed and does not depend on `size`.
   */
  floatingLabel?: boolean
  /** Hint below the field. */
  hint?: string
  /** Error message. When set, the field is marked invalid. */
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
  /** Marks the field as required: shows `*` next to the label. */
  required?: boolean
  /** Explicitly marks the field invalid (in addition to `error`). */
  invalid?: boolean
  /** Square corners: removes the field border radius (rounded by default). */
  square?: boolean
}
