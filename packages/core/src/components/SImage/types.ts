export type SImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

export interface SImageProps {
  /** Image URL. */
  src: string
  /**
   * Text alternative. Required: an image without one is silent to a screen reader and leaves
   * nothing behind when it fails to load. A purely decorative image passes an empty string.
   */
  alt: string
  /** Candidate sources for a responsive image — the `srcset` attribute. */
  srcset?: string
  /** Slot widths the browser picks `srcset` candidates by — the `sizes` attribute. */
  sizes?: string
  /**
   * Aspect ratio of the frame (width / height, e.g. `16 / 9`). The image is wrapped in
   * `SAspectRatio`, so the frame keeps its height and the layout does not jump while loading.
   * Without it the frame is sized by the consumer's own CSS.
   */
  ratio?: number
  /**
   * How the image fills the frame — the `object-fit` value.
   * @defaultValue 'cover'
   */
  fit?: SImageFit
  /**
   * Which part of the image stays in view when it is cropped — the `object-position` value
   * (`'center'`, `'top'`, `'50% 20%'`).
   * @defaultValue 'center'
   */
  position?: string
  /**
   * Defers the request until the image nears the viewport (`loading="lazy"` plus asynchronous
   * decoding). Turn it off for an image above the fold.
   * @defaultValue true
   */
  lazy?: boolean
  /**
   * Shows a skeleton while the image loads; it goes away both on success and on failure. The
   * `placeholder` slot replaces the skeleton.
   * @defaultValue true
   */
  placeholder?: boolean
  /**
   * URL loaded instead of `src` after `src` fails. Without it a failure shows the `error` slot,
   * or a muted surface when that slot is empty.
   */
  fallback?: string
  /** Square corners: removes the border radius (rounded by default). */
  square?: boolean
}
