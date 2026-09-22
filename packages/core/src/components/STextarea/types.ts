import type { SValidationProps } from '../../composables/useValidation'

export type STextareaSize = 'sm' | 'md' | 'lg'

export interface STextareaProps extends SValidationProps<string> {
  /** Field size: affects the font and inner padding (height comes from `rows`/resizing). */
  size?: STextareaSize
  /** Field id. Generated automatically when not set (SSR-safe). */
  id?: string
  /** Field label. */
  label?: string
  /**
   * Floating label: the label sits inside the border (at rest, at the first line, like a
   * placeholder) and floats up to the top edge on focus or when filled. On by default; `false`
   * renders a regular label above the field. The label size is fixed and does not depend on
   * `size`.
   */
  floatingLabel?: boolean
  /** Hint below the field. */
  hint?: string
  /** Error message. When set, the field is marked invalid. */
  error?: string
  /** Explicitly marks the field invalid (in addition to `error`). */
  invalid?: boolean
  /** Read-only field: the text is visible and selectable but cannot be edited. */
  readonly?: boolean
  /** Square corners: removes the field border radius (rounded by default). */
  square?: boolean
  /** Required field: adds a `*` marker to the label. */
  required?: boolean
  /** Placeholder text in an empty field. */
  placeholder?: string
  /** Disables input and makes the field inactive. */
  disabled?: boolean
  /** Number of visible rows (the default height). */
  rows?: number
}
