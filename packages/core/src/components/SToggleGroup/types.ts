import type { SToggleSize } from '../SToggle'

export type SToggleGroupType = 'single' | 'multiple'

export interface SToggleGroupOption {
  /** Item label. When not set, `value` is shown. */
  label?: string
  /** Unique value of the item within the group. */
  value: string
  /** Disables a single item. */
  disabled?: boolean
}

export interface SToggleGroupProps {
  /**
   * Selection mode: `single` allows one active item, `multiple` any subset. Without it the mode
   * follows `v-model`: an array means `multiple`.
   */
  type?: SToggleGroupType
  /** Size of the toggles in the group. */
  size?: SToggleSize
  /** Group items (an alternative to the default slot with hand-written `SToggle`s). */
  options?: readonly SToggleGroupOption[]
  /** Disables the whole group and all its items. */
  disabled?: boolean
  /** Accessible name of the group (`aria-label`). */
  ariaLabel?: string
  /**
   * In `single` mode, clicking the active item keeps it selected instead of clearing the value.
   * Ignored in `multiple`.
   */
  mandatory?: boolean
}
