import type { SValidateOn } from '../../composables/useValidation'

export interface SFormProps {
  /**
   * When the fields check their rules: `blur`, `input` or `submit`. A field's own `validate-on`
   * wins. `blur` by default.
   */
  validateOn?: SValidateOn
  /** Keeps focus where it is when a submission fails, instead of moving it to the first error. */
  noErrorFocus?: boolean
}

/** A field that failed validation. */
export interface SFormError {
  /** Internal field id (not the id of the control in the DOM). */
  id: string
  /** The field `name`, when set. */
  name: string | undefined
  /** Error texts of the field. A field shows one error: that of the first failing rule. */
  messages: string[]
}

/** Result of `validate()`. */
export interface SFormValidateResult {
  /** Whether every field passed. */
  valid: boolean
  /** Fields that failed, in page order. */
  errors: SFormError[]
}

/** Scoped props of the default slot. */
export interface SFormSlotProps {
  /**
   * `true` when every field with rules is checked and valid, `false` with an error, otherwise
   * `null`.
   */
  valid: boolean | null
  /** Whether an async rule is running in some field. */
  validating: boolean
  /** Fields that currently show an error, in page order. */
  errors: SFormError[]
  /** Checks every field. */
  validate: () => Promise<SFormValidateResult>
  /** Clears the errors of every field and drops a submission waiting for async rules. */
  resetValidation: () => void
}
