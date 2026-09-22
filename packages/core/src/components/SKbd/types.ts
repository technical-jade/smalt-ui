export type SKbdVariant = 'outline' | 'solid' | 'subtle'
export type SKbdSize = 'sm' | 'md' | 'lg'

export interface SKbdProps {
  /**
   * Key to show. A known name (`meta`, `ctrl`, `shift`, `enter`, `escape`, `arrowup`, …, case
   * insensitive) is rendered as its symbol and announced by its name; any other text is shown
   * as given. Ignored when the default slot is filled.
   */
  value?: string
  /** Size: `sm`, `md` or `lg`. */
  size?: SKbdSize
  /** Visual variant: bordered `outline`, filled `solid` or tinted `subtle`. */
  variant?: SKbdVariant
}
