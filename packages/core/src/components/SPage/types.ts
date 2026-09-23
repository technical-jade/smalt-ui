export interface SPageProps {
  /**
   * Inner padding around the content.
   * @defaultValue true
   */
  padded?: boolean
  /**
   * Wraps the content in the `.s-container` utility: centred and limited to the readable width of
   * the current breakpoint.
   * @defaultValue false
   */
  container?: boolean
  /**
   * Maximum content width: a CSS length or a number of pixels. The content stays centred, with or
   * without `container`.
   */
  maxWidth?: string | number
  /**
   * Marks the area as the page's `main` landmark. Turn it off where the page is not the
   * document's main content — a preview inside a panel, or a second page area.
   * @defaultValue true
   */
  landmark?: boolean
}
