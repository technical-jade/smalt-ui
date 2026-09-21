export type SSplitterDirection = 'horizontal' | 'vertical'

export interface SSplitterPanel {
  /** Name of the slot with the panel content. Defaults to `panel-<index>`. */
  name?: string
  /** Initial panel size in percent. */
  defaultSize?: number
  /** Minimum panel size in percent. @defaultValue 10 */
  minSize?: number
  /** Maximum panel size in percent. @defaultValue 100 */
  maxSize?: number
  /**
   * Allows collapsing the panel when dragged below `minSize`. Enter on the handle after the panel
   * collapses it and restores the previous size.
   */
  collapsible?: boolean
}

export interface SSplitterProps {
  /** Panel definitions. A resize handle is inserted automatically between adjacent panels. */
  panels: SSplitterPanel[]
  /**
   * Split direction: `horizontal` places panels side by side, `vertical` stacks them.
   * @defaultValue 'horizontal'
   */
  direction?: SSplitterDirection
  /** Accessible name of the resize handles (defaults to the locale dictionary). */
  handleLabel?: string
}
