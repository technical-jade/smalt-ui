import type { SValidationProps } from '../../composables/useValidation'

export type SFileUploadSize = 'sm' | 'md' | 'lg'

/** Which check a file failed: `accept`, `maxSize` or `maxFiles`. */
export type SFileUploadRejectReason = 'type' | 'size' | 'count'

/** A file that was refused, with the reason and the message of the current locale. */
export interface SFileUploadRejection {
  /** The refused file; it never reaches `modelValue`. */
  file: File
  /** Which check failed. */
  reason: SFileUploadRejectReason
  /** Ready-made text from the locale dictionary, the same one the field shows. */
  message: string
}

/** Scoped props of the `file` slot: one row of the selected list. */
export interface SFileUploadFileSlotProps {
  /** The selected file. */
  file: File
  /** Its position in `modelValue`. */
  index: number
  /** Removes this file from `modelValue`. */
  remove: () => void
}

export interface SFileUploadProps extends SValidationProps<File[]> {
  /** Id of the native file input. Generated automatically when not set (SSR-safe). */
  id?: string
  /** Field label, linked to the input via `for`/`id`. */
  label?: string
  /** Hint below the field. The text inside the drop zone is a separate prop, `dropHint`. */
  hint?: string
  /**
   * Error message below the field. When set, the field is marked invalid and the message wins
   * over the component's own rejection text.
   */
  error?: string
  /** Explicitly marks the field invalid (in addition to `error`). */
  invalid?: boolean
  /** Marks the field as required: adds `*` to the label and `aria-required` to the input. */
  required?: boolean
  /** Field size: `sm`, `md` or `lg`. */
  size?: SFileUploadSize
  /** Disables the field: the dialog does not open and dropped files are ignored. */
  disabled?: boolean
  /** Square corners: removes the border radius of the drop zone (rounded by default). */
  square?: boolean
  /**
   * Allows selecting several files. With it off the model is still an array — of a single file,
   * so the value type does not change with the prop.
   */
  multiple?: boolean
  /**
   * Accepted file types in the native `accept` syntax: `image/*,.pdf`. Dropped files go through
   * the same check, which the native attribute alone does not cover.
   */
  accept?: string
  /** Maximum size of one file, in bytes. A larger file is refused. */
  maxSize?: number
  /** Maximum number of files in the model. Files over the limit are refused. */
  maxFiles?: number
  /**
   * Large drop area (on by default). `false` renders a compact button with the selected files
   * next to it; dropping works in both modes.
   */
  dropzone?: boolean
  /** Icon of the drop zone and of the compact button: a registry name or a raw SVG path. */
  icon?: string
  /** Text of the compact button (taken from the locale dictionary by default). */
  buttonLabel?: string
  /**
   * Text inside the drop zone (taken from the locale dictionary by default). Unlike `hint`, it
   * sits in the drop area itself rather than under the field.
   */
  dropHint?: string
  /** Shows a remove button on every file row. */
  removable?: boolean
  /** Remove button icon: a registry name or a raw SVG path. */
  removeIcon?: string
  /**
   * Accessible name of the remove button (taken from the locale dictionary by default). The file
   * name is appended to it, so the buttons of a list differ from one another.
   */
  removeLabel?: string
  /** Renders the selected files: name, readable size and the remove button. */
  showList?: boolean
}
