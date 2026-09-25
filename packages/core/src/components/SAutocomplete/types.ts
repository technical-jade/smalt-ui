import type { SElevation } from '../../composables/useElevationProp'
import type { SValidationProps } from '../../composables/useValidation'

export type SAutocompleteSize = 'sm' | 'md' | 'lg'

export interface SAutocompleteOption {
  /** Row label in the suggestion list. */
  label: string
  /** Value that goes into `v-model` on selection. */
  value: string
  /** The row is shown but cannot be selected. */
  disabled?: boolean
}

export interface SAutocompleteProps extends SValidationProps<string> {
  /**
   * Current suggestions: the result of the application-side search. The list is not filtered
   * again; whatever arrives is shown (fuzzy search, transliteration, index search).
   */
  options: readonly SAutocompleteOption[]
  /**
   * Free-text mode: `v-model` is the input text itself, and suggestions only help complete it
   * (an address, an email, a search string). Picking a suggestion puts its `label` into the input
   * and passes the option in the `select` event. `v-model:search` and `selected-label` are not
   * needed in this mode.
   */
  freeText?: boolean
  /**
   * Label of the selected value. A separate prop, because after a selection the suggestion list
   * is usually empty and the label cannot be taken from it.
   */
  selectedLabel?: string
  /** A request is in flight: a loading indicator is shown instead of the list. */
  loading?: boolean
  /** Text shown when there are no suggestions (defaults to the locale dictionary). */
  emptyText?: string
  /** Field label (rendered via `SFormField`/`SLabel`). */
  label?: string
  /** Hint below the field. */
  hint?: string
  /** Error message. When set, the field is marked invalid. */
  error?: string
  /** Explicitly marks the field invalid (in addition to `error`). */
  invalid?: boolean
  /**
   * Field name in native form submission: the value is sent in a hidden input, and with
   * `free-text` the input text is sent.
   */
  name?: string
  /** Required field: a `*` marker next to the label. */
  required?: boolean
  /** Disables the field. */
  disabled?: boolean
  /** Placeholder text in an empty field. */
  placeholder?: string
  /** Input id. Generated when not set (SSR-safe). */
  id?: string
  /** Field size: `sm` (32px), `md` (40px) or `lg` (48px). */
  size?: SAutocompleteSize
  /** Square corners: removes the rounding of the frame and the suggestion panel. */
  square?: boolean
  /** Shows the clear button: it resets both the selection and the query text. */
  clearable?: boolean
  /** Clear button icon: a registry name or a raw path. */
  clearIcon?: string
  /** Accessible name of the clear button (defaults to the locale dictionary). */
  clearLabel?: string
  /** Leading icon inside the field (a registry name or a raw path), drawn on the left. */
  icon?: string
  /** Accessible name of the field (when there is no visible `label`). */
  ariaLabel?: string
  /**
   * Maximum height of the suggestion panel (`20rem` by default). A number means pixels. The panel
   * also never grows past the free space to the window edge; the smaller of the two wins.
   */
  maxHeight?: string | number
  /** Removes the shadow. Overridden by the `elevation` prop when it is set. */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
}
