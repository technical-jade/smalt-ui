export type SAlertDialogInitialFocus = 'cancel' | 'confirm' | 'none'

export interface SAlertDialogProps {
  /** Square corners: removes the rounding (rounded by default). */
  square?: boolean
  /** Title (can be replaced with the `title` slot). */
  title?: string
  /** Explanatory text (can be replaced with the `description` slot). */
  description?: string
  /** Confirm button label. */
  confirmLabel?: string
  /** Cancel button label. */
  cancelLabel?: string
  /** Destructive (irreversible) action: the confirm button uses the `negative` variant. */
  danger?: boolean
  /**
   * What gets focus when the dialog opens: the `cancel` button (the safe choice), the `confirm`
   * button, or `none` for the dialog itself, so that no button is one keypress away.
   */
  initialFocus?: SAlertDialogInitialFocus
}
