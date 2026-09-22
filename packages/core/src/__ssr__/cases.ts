import { h, type VNode } from 'vue'
import * as components from '../components'
import { ToastProvider } from '../providers'

/**
 * Components that cannot render on their own: they need required props or a Reka parent
 * context. The key is the export name, the value is a VNode factory. Everything not listed here
 * renders as `h(Component)` without props.
 */
export const SSR_CASES: Record<string, () => VNode> = {
  SAutocomplete: () =>
    h(components.SAutocomplete, {
      options: [
        { label: 'New York', value: 'nyc' },
        { label: 'London', value: 'lon' },
      ],
      label: 'City',
    }),
  SSelect: () =>
    h(components.SSelect, {
      options: [
        { label: 'New York', value: 'nyc' },
        { label: 'London', value: 'lon' },
      ],
      label: 'City',
    }),
  SPagination: () => h(components.SPagination, { total: 50, page: 2 }),
  SStepper: () =>
    h(components.SStepper, {
      items: [{ title: 'First' }, { title: 'Second', description: 'Description' }],
    }),
  SSplitter: () => h(components.SSplitter, { panels: [{ defaultSize: 50 }, { defaultSize: 50 }] }),
  STree: () =>
    h(components.STree, {
      items: [{ label: 'Root', children: [{ label: 'Leaf' }] }],
    }),
  SAccordionItem: () =>
    h(components.SAccordion, null, {
      default: () => h(components.SAccordionItem, { value: 'a', title: 'Title' }),
    }),
  SRadio: () =>
    h(
      components.SRadioGroup,
      { ariaLabel: 'Group' },
      {
        default: () => h(components.SRadio, { value: 'a', label: 'Option' }),
      },
    ),
  SToast: () =>
    h(ToastProvider, null, {
      default: () => h(components.SToast, { title: 'Title' }),
    }),
  SImage: () =>
    h(components.SImage, { src: '/media/cover.jpg', alt: 'Mountain lake', ratio: 16 / 9 }),
  STimeline: () =>
    h(components.STimeline, {
      items: [
        { title: 'Order created', date: 'March 3' },
        { title: 'Shipped', date: 'March 5' },
      ],
    }),
}

/**
 * Components deliberately excluded from the SSR smoke test, with the reason.
 * An empty object is the goal; every entry must be justified.
 */
export const SSR_SKIP: Record<string, string> = {}

/**
 * Open portals are the riskiest SSR scenario: Reka teleports the content to body, which does
 * not exist on the server.
 */
export const SSR_OPEN_CASES: Record<string, () => VNode> = {
  SDialog: () =>
    h(components.SDialog, { open: true, title: 'Title' }, { default: () => 'Content' }),
  SDrawer: () =>
    h(components.SDrawer, { open: true, title: 'Title' }, { default: () => 'Content' }),
  SPopover: () =>
    h(components.SPopover, { open: true }, { default: () => 'Content', trigger: () => 'Trigger' }),
  SAlertDialog: () =>
    h(components.SAlertDialog, { open: true, title: 'Title' }, { default: () => 'Content' }),
}
