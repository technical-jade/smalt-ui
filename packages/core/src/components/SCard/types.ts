import type { HTMLAttributes } from 'vue'
import type { AsTag } from 'reka-ui'
import type { SElevation } from '../../composables/useElevationProp'

export type SCardVariant = 'outline' | 'elevated'

export interface SCardProps {
  /**
   * Root tag. `label` wraps a native radio/checkbox to get a selectable card with keyboard
   * support and screen reader announcements out of the box; `a`/`button` for a link card.
   */
  as?: AsTag
  /** Style: border (`outline`) or shadow (`elevated`). */
  variant?: SCardVariant
  /** Square corners: removes the border radius. */
  square?: boolean
  /**
   * The card responds to hover and focus: state layer, pointer cursor, focus ring. It does not
   * make the card clickable by itself — set `as` and a handler or put a control inside.
   */
  interactive?: boolean
  /** The card is selected: accent border and `data-selected` for custom styles. */
  selected?: boolean
  /**
   * The card is disabled: dimmed and ignores the pointer. A button or link card (`as`) also
   * stops responding to the keyboard.
   */
  disabled?: boolean
  /**
   * Class of the content wrapper (`.s-card__body`) for a custom layout inside the card.
   * Header, body and footer padding is set by the `--s-card-padding` variable on the card itself.
   */
  bodyClass?: HTMLAttributes['class']
  /** Removes the shadow. Overridden by the `elevation` prop when it is set. */
  flat?: boolean
  /** Shadow level 0–5 ([scale](/style/elevation)); `0` means no shadow. Overrides `flat`. */
  elevation?: SElevation
}
