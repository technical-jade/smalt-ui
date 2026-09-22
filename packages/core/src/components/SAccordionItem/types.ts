export type SAccordionHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface SAccordionItemProps {
  /** Unique item value within `SAccordion` (used to control expansion). */
  value: string
  /** Item title (alternative to the `title` slot). */
  title?: string
  /** Disables the item: it cannot be expanded or collapsed. */
  disabled?: boolean
  /** Expand indicator icon. */
  expandIcon?: string
  /**
   * Unmounts the content while the item is collapsed; `false` keeps it mounted and hidden. By
   * default the item follows `unmount-on-hide` of its `SAccordion`.
   */
  unmountOnHide?: boolean
  /**
   * Heading level of the item header (`aria-level`). By default the item follows
   * `heading-level` of its `SAccordion`.
   */
  headingLevel?: SAccordionHeadingLevel
}
