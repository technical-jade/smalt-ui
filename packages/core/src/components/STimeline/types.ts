import type { SColorName } from '../../composables/useColorProp'

export type STimelineOrientation = 'vertical' | 'horizontal'

export type STimelineLabelPlacement = 'top' | 'bottom' | 'start' | 'end'

export type STimelineSize = 'sm' | 'md' | 'lg'

export interface STimelineItem {
  /** Identifier for `v-model`. Without it the item is addressed by its index. */
  value?: string | number
  /** Event title. */
  title?: string
  /** Text under the title. */
  description?: string
  /** Date or time of the event, shown above the title. */
  date?: string
  /** Icon in the indicator (a registry name or a raw SVG path); replaces the dot. */
  icon?: string
  /**
   * Accent color of this item: a name from the [palette](/style/palette)
   * (`primary`/`teal`/`teal-10`). Overrides the timeline color.
   */
  color?: SColorName
  /**
   * Color of the content on this item's own accent — the check or the icon inside a completed
   * indicator. Defaults to the timeline's `text-color`, which a light item accent may need to
   * override.
   */
  textColor?: SColorName
  /** Dims the item: the event is cancelled or not applicable. */
  disabled?: boolean
}

/** Payload of the scoped item slots. */
export interface STimelineSlotProps {
  /** The item being rendered. */
  item: STimelineItem
  /** Position of the item in `items`, starting from 0. */
  index: number
  /** The item is the current one (matches the model value). */
  active: boolean
  /** The item comes before the current one. */
  completed: boolean
}

export interface STimelineProps {
  /** Events in display order. */
  items: STimelineItem[]
  /**
   * Layout direction: a column of events or a row with a horizontal rail.
   * @defaultValue 'vertical'
   */
  orientation?: STimelineOrientation
  /**
   * Side of the indicator where the event text goes: `top` and `bottom` are above and below the
   * dot, `start` and `end` are before and after it (left and right in a left-to-right layout).
   * Alongside the dot the text is centred on it; above or below it the event becomes a centred
   * column. Works in both orientations. Without a value the text is beside the dot in the
   * vertical layout and below it in the horizontal one — there is no shared default, otherwise
   * changing the orientation would move the text.
   */
  labelPlacement?: STimelineLabelPlacement
  /**
   * Width in pixels below which a horizontal timeline switches to vertical. It is compared with
   * the width available to the timeline, not the window: in a narrow column or a modal the rail
   * breaks even on a wide screen. Without the prop the layout never changes.
   */
  stackAt?: number
  /**
   * Orientation below the `stack-at` threshold. `vertical` by default; `horizontal` together
   * with `orientation="vertical"` gives the reverse: a column when wide and a row when narrow.
   * @defaultValue 'vertical'
   */
  narrowOrientation?: STimelineOrientation
  /**
   * Size: scales the indicator, the spacing and the type scale.
   * @defaultValue 'md'
   */
  size?: STimelineSize
  /**
   * Accent color of the completed part: a name from the [palette](/style/palette)
   * (`primary`/`teal`/`teal-10`).
   */
  color?: SColorName
  /**
   * Color of the content on the completed indicator fill: a name from the
   * [palette](/style/palette). White by default.
   */
  textColor?: SColorName
}
