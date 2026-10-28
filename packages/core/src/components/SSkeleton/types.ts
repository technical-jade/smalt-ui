export type SSkeletonVariant = 'text' | 'rect' | 'circle'

export interface SSkeletonProps {
  /**
   * Placeholder shape: a line of text (`text`), a rectangle (`rect`) or a circle (`circle`,
   * e.g. for an avatar). The skeleton is hidden from screen readers (`aria-hidden`).
   */
  variant?: SSkeletonVariant
  /**
   * Width: a number is treated as pixels, a string as a CSS value (`'100%'`, `'12rem'`). By
   * default `text`/`rect` stretch to the full width, `circle` is `2.5rem`.
   */
  width?: string | number
  /**
   * Height: a number is treated as pixels, a string as a CSS value. By default `text` is `1em`,
   * `circle` is `2.5rem`, `rect` is `100%` of the parent height.
   */
  height?: string | number
  /**
   * Enables the shimmer animation. Turn it off for a static skeleton; under
   * `prefers-reduced-motion: reduce` it stops by itself.
   */
  animated?: boolean
}
