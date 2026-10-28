export interface SDialogProps {
  /** Square corners: removes the border radius (rounded by default). */
  square?: boolean
  /**
   * Window width: a CSS length or a number in pixels. On a narrow screen the window is still no
   * wider than 92vw. Without the prop the width comes from the `--s-dialog-width` variable
   * (`32rem` by default).
   */
  width?: string | number
  /**
   * Dialog title (can be replaced with the `title` slot). Without a title the window takes its
   * accessible name from a hidden "Dialog" label in the locale dictionary.
   */
  title?: string
  /**
   * Dialog description (can be replaced with the `description` slot), linked to the window
   * through `aria-describedby`.
   */
  description?: string
  /** Accessible name of the close button (defaults to the locale dictionary). */
  closeLabel?: string
}
