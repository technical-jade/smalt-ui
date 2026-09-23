import type { SSidebarBreakpoint } from './breakpoints'

export type { SSidebarBreakpoint }

export type SSidebarSide = 'start' | 'end'

export interface SSidebarProps {
  /**
   * Edge the sidebar sits on, in logical terms: `start` is the left side in a left-to-right
   * document and the right one in RTL.
   * @defaultValue 'start'
   */
  side?: SSidebarSide
  /**
   * Width of the expanded column: a CSS length or a number of pixels. `16rem` by default. The
   * value is published as `--s-sidebar-width` on the shell, so the page reserves the same width
   * without measuring anything.
   */
  width?: string | number
  /**
   * Width of the collapsed rail: a CSS length or a number of pixels. `4rem` by default, published
   * as `--s-sidebar-collapsed-width`.
   */
  collapsedWidth?: string | number
  /**
   * Breakpoint at which the column appears: below it the sidebar is a drawer opened through
   * `v-model:open`. A name from the grid scale — `sm` (600px), `md` (1024px), `lg` (1440px) or
   * `xl` (1920px).
   * @defaultValue 'md'
   */
  breakpoint?: SSidebarBreakpoint
  /**
   * Hairline between the column and the page.
   * @defaultValue true
   */
  bordered?: boolean
  /**
   * Shows the button that collapses the column to a rail of icons. Turning it off leaves
   * `v-model:collapsed` under the application's own control.
   * @defaultValue true
   */
  collapsible?: boolean
  /**
   * Accessible name of the navigation landmark. Set it whenever a page holds more than one
   * navigation region, so screen readers can tell them apart.
   */
  ariaLabel?: string
  /**
   * Accessible name of the toggle while the rail is collapsed (taken from the locale dictionary by
   * default).
   */
  expandLabel?: string
  /**
   * Accessible name of the toggle while the column is expanded (taken from the locale dictionary
   * by default).
   */
  collapseLabel?: string
}
