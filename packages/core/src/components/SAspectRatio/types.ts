export interface SAspectRatioProps {
  /**
   * Target aspect ratio (width / height). For example `16 / 9` for widescreen media, `1` for
   * a square, `4 / 3` for a classic frame.
   * @defaultValue 1
   */
  ratio?: number
  /** Square corners: removes the border radius (rounded by default). */
  square?: boolean
}
