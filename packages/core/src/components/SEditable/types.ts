import type { SValidationProps } from '../../composables/useValidation'

export type SEditableSize = 'sm' | 'md' | 'lg'

/** What turns the preview into an input. */
export type SEditableActivationMode = 'focus' | 'dblclick' | 'none'

/** What commits the typed value. */
export type SEditableSubmitMode = 'blur' | 'enter' | 'both' | 'none'

export interface SEditableProps extends SValidationProps<string> {
  /** Field id. Generated automatically when not set (SSR-safe). */
  id?: string
  /** Field label (linked to the input via `for`/`id`). */
  label?: string
  /** Hint below the field. */
  hint?: string
  /** Error message. When set, the field is marked invalid. */
  error?: string
  /** Explicitly marks the field invalid (in addition to `error`). */
  invalid?: boolean
  /** Marks the field as required: adds `*` to the label and to the hidden form input. */
  required?: boolean
  /**
   * Text shown instead of an empty value, in the preview and as the input placeholder. Consumer
   * content: it is not taken from the locale dictionary.
   */
  placeholder?: string
  /** Field size: `sm` (32px), `md` (40px) or `lg` (48px). */
  size?: SEditableSize
  /** Disables the field: the value stays visible but the editor never opens. */
  disabled?: boolean
  /** Read-only field: the value is visible and selectable, but the editor never opens. */
  readonly?: boolean
  /** Square corners: removes the field border radius (rounded by default). */
  square?: boolean
  /**
   * What opens the editor: `focus` (entering the preview with Tab or a click), `dblclick` (a
   * double click) or `none` (only the controls and the exposed `edit()`). Enter and Space on the
   * focused preview open it in every mode but `none`.
   */
  activationMode?: SEditableActivationMode
  /**
   * What commits the value: `enter` (the Enter key), `blur` (focus leaving the field), `both`
   * (the default) or `none` — with `none` the value is committed only by the submit control or
   * the exposed `submit()`, and leaving the field discards the edit. Escape always cancels.
   */
  submitMode?: SEditableSubmitMode
  /** Maximum number of characters accepted by the input. */
  maxLength?: number
  /**
   * The field takes the width of its value instead of the whole row: the value and the input
   * share one grid cell. Typing does not widen the box — the input scrolls, as any field does.
   */
  autoResize?: boolean
  /** Selects the whole value when the editor opens, so typing replaces it. */
  selectOnFocus?: boolean
  /** Opens the editor on mount, with the input focused. */
  startWithEditView?: boolean
  /** Renders the edit, save and cancel buttons next to the value. */
  withControls?: boolean
  /** Accessible name of the edit button (defaults to the locale dictionary). */
  editLabel?: string
  /** Accessible name of the save button (defaults to the locale dictionary). */
  saveLabel?: string
  /** Accessible name of the cancel button (defaults to the locale dictionary). */
  cancelLabel?: string
  /** Accessible name of the input, for a field rendered without a `label`. */
  ariaLabel?: string
  /** Name of the value in native form submission: renders a hidden input inside a `<form>`. */
  name?: string
}

/** Scoped props of the `preview` slot. */
export interface SEditablePreviewSlotProps {
  /** The committed value (an empty string when the field is empty). */
  value: string
  /** Whether the editor is open. */
  isEditing: boolean
}

/** Scoped props of the `controls` slot. */
export interface SEditableControlsSlotProps {
  /** Whether the editor is open. */
  isEditing: boolean
  /** Opens the editor. */
  edit: () => void
  /** Commits the typed value. */
  submit: () => void
  /** Closes the editor, keeping the committed value. */
  cancel: () => void
}
