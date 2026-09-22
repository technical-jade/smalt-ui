import type { SElevation } from '../../composables/useElevationProp'
import type { SValidationProps } from '../../composables/useValidation'

export interface SSelectOption {
  label: string
  value: string
  disabled?: boolean
  /** Leading option icon (a registry name or a raw path), drawn before the label. */
  icon?: string
}

export type SSelectSize = 'sm' | 'md' | 'lg'

export interface SSelectProps extends SValidationProps<string | string[]> {
  /** List of options. */
  options: readonly SSelectOption[]
  /** Field size: `sm` (32px), `md` (40px), or `lg` (48px). */
  size?: SSelectSize
  /** Field label (rendered via `SFormField`/`SLabel`). */
  label?: string
  /**
   * Floating label (Material notched outline): the label sits inside the frame and floats up
   * on focus or when a value is selected. Enabled by default. Not applicable in `use-tags` mode
   * (the frame grows), where a regular label stays on top.
   */
  floatingLabel?: boolean
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
  /** Required field: a `*` marker next to the label. */
  required?: boolean
  /** Trigger id. Generated (SSR-safe) when not set. */
  id?: string
  /** Trigger placeholder text shown until a value is selected. */
  placeholder?: string
  /**
   * Enables filtering options by typing (combobox behavior): an input renders instead of the
   * trigger, and the list narrows to the typed query.
   */
  searchable?: boolean
  /**
   * Multiple selection. `modelValue` becomes `string[]`; the selected labels are listed
   * separated by commas. Combines with `searchable`.
   */
  multiple?: boolean
  /**
   * Multiple selection as tags (implies `multiple`): the selected options render as `STag`
   * chips with a remove button. `modelValue` is `string[]`.
   */
  useTags?: boolean
  /**
   * Text shown when nothing matches (`searchable` only; taken from the locale dictionary by
   * default).
   */
  emptyText?: string
  /** Accessible name of the clear button (taken from the locale dictionary by default). */
  clearLabel?: string
  /**
   * Accessible name of the list toggle button with `searchable` (taken from the locale
   * dictionary by default).
   */
  showOptionsLabel?: string
  /** Leading icon inside the field (a registry name or a raw path), drawn on the left. */
  icon?: string
  /** Accessible name of the trigger (when there is no visible label). */
  ariaLabel?: string
  /** Disables the select. */
  disabled?: boolean
  /** Registry name or raw path of the dropdown indicator icon. */
  dropdownIcon?: string
  /** Shows a clear button that resets the selection; visible when a value is selected. */
  clearable?: boolean
  /** Registry name or raw path of the clear button icon. */
  clearIcon?: string
  /**
   * Maximum height of the dropdown list (`20rem` by default). A number means pixels. The panel
   * also never grows past the space left to the window edge; the smaller of the two wins.
   */
  maxHeight?: string | number
  /**
   * Virtualizes a long list: only visible rows stay in the DOM. `true` means always, a number
   * is the option count threshold, `false` means never. Enabled from 100 options by default.
   * Works only with `searchable`: Reka has no suitable primitive for a dropdown without search,
   * so enable `searchable` for thousands of options.
   */
  virtualize?: boolean | number
  /** Removes the shadow. Overridden by the `elevation` prop when it is set. */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
}
