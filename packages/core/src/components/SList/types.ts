export type SListVariant = 'plain' | 'bordered' | 'divided'
export type SListSize = 'sm' | 'md' | 'lg'

export interface SListProps {
  /**
   * Framing: `plain` draws nothing, `bordered` puts a border with rounded corners around the
   * whole list, `divided` separates the rows with a hairline.
   */
  variant?: SListVariant
  /** Row density: height, padding and text size of every `SListItem` inside. */
  size?: SListSize
  /**
   * Accessible name of the list. Set it when the surrounding markup does not already name the
   * list — a screen reader announces it together with the number of rows.
   */
  label?: string
}
