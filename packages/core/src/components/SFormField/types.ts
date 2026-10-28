export type SFormFieldSize = 'sm' | 'md' | 'lg'

export interface SFormFieldProps {
  /** Field label (rendered via `SLabel`). */
  label?: string
  /** Hint below the field. It is hidden while an error is shown. */
  hint?: string
  /** Error message. When set, the field is marked invalid. */
  error?: string
  /** Explicitly marks the field invalid (in addition to `error`). */
  invalid?: boolean
  /** Required field: a `*` marker next to the label. */
  required?: boolean
  /** Id of the controlled element. Generated when omitted (SSR-safe). */
  id?: string
  /**
   * Field size: the `s-label--{size}` modifier of the label. The font size of the label above the
   * field does not depend on it: the label always matches the hint and the error.
   */
  size?: SFormFieldSize
  /**
   * Floating label: the top label is NOT rendered — the field draws the label inside its border
   * itself (see the `floatingLabel` slot prop). The hint/error layout stays the same.
   */
  floatingLabel?: boolean
  /** Square corners: removes the field border radius (rounded by default). */
  square?: boolean
  /**
   * The field takes the content width instead of the full row. For compact controls
   * (checkbox, switch) that need a hint and an error but no stretched block.
   */
  inline?: boolean
}

/** Scoped props passed to the default slot (the control). */
export interface SFormFieldSlotProps {
  /** Id for the control, linked to the label via `<label for>`. */
  id: string
  /** Label text: the field draws it as a floating label inside its border. */
  label: string | undefined
  /** Whether floating label mode is on (the field renders the label itself). */
  floatingLabel: boolean
  /**
   * Label id for `aria-labelledby` of group fields (Reka `role="group"`), where a native
   * `<label for>` does not work. `undefined` when there is no label. With `floatingLabel`
   * `SFormField` renders no element with this id — the field has to draw it itself.
   */
  labelId: string | undefined
  /** The `aria-describedby` value (hint/error ids) or `undefined`. */
  describedBy: string | undefined
  /** Whether the field is invalid, for `aria-invalid`. */
  invalid: boolean
  /** Whether square corners are on, for controls with their own floating panel. */
  square: boolean
}

/** Scoped props of the label slot. */
export interface SFormFieldLabelSlotProps {
  /** Id of the label element, for `aria-labelledby` of group fields. */
  id: string | undefined
  /** Id of the controlled element, the same as in the label `for` attribute. */
  for: string
  /** Whether the field is marked as required. */
  required: boolean
}
