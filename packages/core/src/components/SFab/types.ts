import type { SColorName } from '../../composables/useColorProp'
import type { SButtonSize, SButtonVariant } from '../SButton'

export type SFabPosition = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start' | 'static'
export type SFabDirection = 'up' | 'down' | 'start' | 'end'
export type SFabOpenOn = 'click' | 'hover'

export interface SFabAction {
  /** Identifier of the action, passed back with the `select` event. */
  id: string
  /**
   * Action name: shown as a chip next to the button and used as the button's accessible name.
   */
  label: string
  /** Action icon: a registry name (see `registerIcons`) or a raw SVG path (`d`). */
  icon?: string
  /** Disables the action: it stays visible but is skipped by the keyboard and by clicks. */
  disabled?: boolean
}

export interface SFabProps {
  /** Icon of the main button: a registry name (see `registerIcons`) or a raw SVG path (`d`). */
  icon?: string
  /**
   * Text label. With it the button becomes an extended FAB — an icon and text in one pill;
   * without it the button is a circle and needs `ariaLabel`.
   */
  label?: string
  /**
   * Accessible name of the button. Required for a circular FAB, which has no visible text.
   * An extended FAB is named by its `label`.
   */
  ariaLabel?: string
  /** Button size: `sm` (40px), `md` (56px) or `lg` (72px). */
  size?: SButtonSize
  /**
   * Visual variant: filled `primary`/`secondary`/`negative`, outlined `outline` or transparent
   * `ghost`. The actions of the fan follow the same variant.
   */
  variant?: SButtonVariant
  /**
   * Accent color: a name from the [palette](/style/palette) (`primary`/`teal`/`teal-10`).
   * Overrides the variant color, for the fan actions as well.
   */
  color?: SColorName
  /**
   * Corner the button is pinned to. Pinned positions are `position: fixed`; `static` leaves the
   * button in the flow, where the page places it. The distance from the corner is set by the
   * `--s-fab-top`/`--s-fab-right`/`--s-fab-bottom`/`--s-fab-left` custom properties.
   */
  position?: SFabPosition
  /**
   * Actions of the fan (speed dial). With them the button opens a fan of secondary actions
   * instead of acting on its own click.
   */
  actions?: readonly SFabAction[]
  /** Direction the fan of actions unfolds in. */
  direction?: SFabDirection
  /**
   * What opens the fan: a click (`click`) or the pointer entering the button (`hover`). Hover
   * keeps the click working, because a touch screen has no hover.
   */
  openOn?: SFabOpenOn
  /**
   * Accessible name of the button and of the fan when actions are set and the button has no
   * visible `label`. Defaults to the locale dictionary entry (`showActions`).
   */
  actionsLabel?: string
}
