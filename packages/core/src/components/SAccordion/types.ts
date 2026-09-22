import type { SAccordionHeadingLevel } from '../SAccordionItem/types'

export type SAccordionType = 'single' | 'multiple'

export interface SAccordionOption {
  /** Unique section value. */
  value: string
  /** Section title. */
  title?: string
  /** Section content. */
  content?: string
  /** Disables the section. */
  disabled?: boolean
}

export interface SAccordionProps {
  /**
   * Mode: `single` expands one section at a time, `multiple` expands any number. Without it the
   * mode follows `v-model`: an array means `multiple`.
   */
  type?: SAccordionType
  /** In `single` mode, allows collapsing the open section (closing all). Ignored in `multiple`. */
  collapsible?: boolean
  /** Sections (an alternative to the default slot with hand-written `SAccordionItem`s). */
  items?: readonly SAccordionOption[]
  /** Disables the whole accordion. */
  disabled?: boolean
  /** Square corners: removes the border radius (rounded by default). */
  square?: boolean
  /**
   * Unmounts the content of collapsed sections. `false` keeps it mounted and hidden, so nested
   * fields keep their state and the browser page search finds collapsed text. A section can
   * override it with its own `unmount-on-hide`.
   */
  unmountOnHide?: boolean
  /** Heading level of the section headers (`aria-level`); pick it to fit the page outline. */
  headingLevel?: SAccordionHeadingLevel
}
