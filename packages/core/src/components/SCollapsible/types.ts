export interface SCollapsibleProps {
  /** Trigger title (an alternative to the `trigger` slot). */
  title?: string
  /** Square corners: removes the border radius (rounded by default). */
  square?: boolean
  /** Prevents expanding and disables the trigger. */
  disabled?: boolean
  /** Icon of the expand indicator. */
  expandIcon?: string
  /**
   * Unmounts the content while collapsed. `false` keeps it mounted and hidden, so nested fields
   * keep their state and the browser page search finds collapsed text.
   */
  unmountOnHide?: boolean
}
