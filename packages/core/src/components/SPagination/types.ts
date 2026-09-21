export interface SPaginationProps {
  /** Total number of items; the page count is computed from it and `itemsPerPage`. */
  total: number
  /** Number of items per page. */
  itemsPerPage?: number
  /** How many sibling pages to show on each side of the current one. */
  siblingCount?: number
  /** Always shows the first and last pages with an ellipsis between the blocks. */
  showEdges?: boolean
  /** Disables the pagination and all its buttons. */
  disabled?: boolean
  /** Icon of the previous page button. */
  prevIcon?: string
  /** Icon of the next page button. */
  nextIcon?: string
  /** Accessible name of the previous page button (taken from the locale dictionary by default). */
  prevPageLabel?: string
  /** Accessible name of the next page button (taken from the locale dictionary by default). */
  nextPageLabel?: string
  /** Accessible name of the navigation landmark (taken from the locale dictionary by default). */
  ariaLabel?: string
}
