export type SScrollAreaType = 'auto' | 'always' | 'scroll' | 'hover'
export type SScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'
export type SScrollAreaSize = 'sm' | 'md' | 'lg'

export interface SScrollAreaProps {
  /**
   * When the scrollbars are visible: `auto` — while the content overflows, `always` — at all
   * times, `scroll` — while scrolling, `hover` — while scrolling or pointing at the area.
   * @defaultValue 'hover'
   */
  type?: SScrollAreaType
  /**
   * How long the scrollbars stay visible after the interaction ends, in milliseconds
   * (`scroll` and `hover` only).
   * @defaultValue 600
   */
  scrollHideDelay?: number
  /**
   * Which scrollbars are rendered. The other axis keeps its content instead of scrolling it.
   * @defaultValue 'vertical'
   */
  orientation?: SScrollAreaOrientation
  /**
   * Height of the area; a number means pixels. Without it (and without `maxHeight`) the area is
   * as tall as its content, and the size comes from the consumer's own layout.
   */
  height?: string | number
  /**
   * Height the area is allowed to grow to before it starts scrolling; a number means pixels.
   */
  maxHeight?: string | number
  /**
   * Scrollbar thickness.
   * @defaultValue 'md'
   */
  size?: SScrollAreaSize
}
