export interface SCollapsibleProps {
  /** Trigger title (an alternative to the `trigger` slot). */
  title?: string
  /** Square corners: removes the border radius (rounded by default). */
  square?: boolean
  /** Prevents expanding and disables the trigger. */
  disabled?: boolean
  /** Icon of the expand indicator (a `SIcon` registry name), `chevron-down` by default. */
  expandIcon?: string
  /**
   * Unmounts the content while collapsed. `false` keeps it in the DOM, hidden with
   * `hidden="until-found"`: nested fields keep their state, and the browser page search finds the
   * collapsed text and expands the block.
   */
  unmountOnHide?: boolean
}
