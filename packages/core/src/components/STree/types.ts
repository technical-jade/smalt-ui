export interface STreeItem {
  /** Node label. */
  label: string
  /**
   * Unique node value (the key for selection/expansion). When not set, `label` is the key, so
   * nodes with identical labels on the same level **must** have explicit values, otherwise the
   * duplicates are selected/expanded together.
   */
  value?: string
  /**
   * Node icon (before the label): a registry name (see `registerIcons`) or a raw SVG path (`d`).
   * Rendered with `SIcon`.
   */
  icon?: string
  /** Child nodes. Their presence makes the node expandable. */
  children?: readonly STreeItem[]
  /** Disables the node so it cannot be selected. */
  disabled?: boolean
}

export interface STreeProps {
  /** Hierarchical list of nodes. */
  items: readonly STreeItem[]
  /** Allows selecting multiple nodes. */
  multiple?: boolean
  /** Keys of the nodes expanded on first render: the node `value`, or its `label` without one. */
  defaultExpanded?: string[]
}
