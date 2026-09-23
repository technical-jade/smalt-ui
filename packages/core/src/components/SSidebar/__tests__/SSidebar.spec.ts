import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/vue'
import { SSidebar } from '../index'

/**
 * happy-dom reports a 1024px window, so `sm` keeps the wide column and `xl` forces the drawer.
 * The branch is chosen in `onMounted`, hence the tick before every assertion.
 */
const WIDE = 'sm'
const NARROW = 'xl'

async function mount(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const utils = render(SSidebar, {
    props: { breakpoint: WIDE, ariaLabel: 'Main', ...props },
    slots,
  })
  await nextTick()
  return utils
}

const column = (container: Element) => container.querySelector<HTMLElement>('.s-sidebar')!

describe('SSidebar', () => {
  it('renders a named navigation column on wide screens', async () => {
    const { container } = await mount({}, { default: 'Reports' })

    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(nav).toHaveTextContent('Reports')
    expect(column(container)).toHaveClass('s-sidebar--fixed', 's-sidebar--start')
    expect(column(container)).toHaveClass(`s-sidebar--bp-${WIDE}`)
  })

  it('places the column on the trailing edge', async () => {
    const { container } = await mount({ side: 'end' })
    expect(column(container)).toHaveClass('s-sidebar--end')
  })

  it('is bordered by default and loses the border on demand', async () => {
    const { container } = await mount()
    expect(column(container)).toHaveClass('s-sidebar--bordered')

    const plain = await mount({ bordered: false })
    expect(column(plain.container)).not.toHaveClass('s-sidebar--bordered')
  })

  it('renders the header, footer and navigation slots', async () => {
    await mount({}, { header: 'Acme', default: 'Reports', footer: 'Sign out' })

    expect(screen.getByText('Acme')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Sign out')).toBeInTheDocument()
  })

  it('passes the rail state to the slots', async () => {
    render({
      components: { SSidebar },
      template: `
        <SSidebar
          breakpoint="${WIDE}"
          aria-label="Main"
          :collapsed="true"
        >
          <template #default="{ collapsed }">rail: {{ collapsed }}</template>
        </SSidebar>
      `,
    })
    await nextTick()

    expect(screen.getByText('rail: true')).toBeInTheDocument()
  })

  it('names the toggle from the dictionary and follows the rail state', async () => {
    const { rerender } = await mount()
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    await rerender({ breakpoint: WIDE, ariaLabel: 'Main', collapsed: true })
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('takes the toggle names from the props', async () => {
    await mount({ collapseLabel: 'Shrink the menu' })
    expect(screen.getByRole('button', { name: 'Shrink the menu' })).toBeInTheDocument()

    const collapsedBar = await mount({ collapsed: true, expandLabel: 'Widen the menu' })
    expect(await collapsedBar.findByRole('button', { name: 'Widen the menu' })).toBeInTheDocument()
  })

  it('collapses the column to a rail through the model', async () => {
    const { container, emitted } = await mount()
    expect(column(container)).not.toHaveClass('s-sidebar--collapsed')

    await fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }))

    expect(emitted()['update:collapsed']).toEqual([[true]])
    expect(column(container)).toHaveClass('s-sidebar--collapsed')
  })

  it('hides the toggle when the column is not collapsible', async () => {
    await mount({ collapsible: false })
    expect(screen.queryByRole('button', { name: 'Collapse sidebar' })).toBeNull()
  })

  it('takes the toggle from the slot', async () => {
    await mount({}, { toggle: '<button type="button">Fold</button>' })

    expect(screen.getByRole('button', { name: 'Fold' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Collapse sidebar' })).toBeNull()
  })

  it('publishes the widths as custom properties, taking numbers as pixels', async () => {
    const { container } = await mount({ width: 280, collapsedWidth: '3rem' })

    expect(column(container).style.getPropertyValue('--s-sidebar-width')).toBe('280px')
    expect(column(container).style.getPropertyValue('--s-sidebar-collapsed-width')).toBe('3rem')
  })

  it('becomes a drawer below the breakpoint', async () => {
    const { container } = await mount({ breakpoint: NARROW }, { default: 'Reports' })

    expect(container.querySelector('.s-sidebar--fixed')).toBeNull()
    expect(screen.queryByRole('navigation')).toBeNull()
  })

  it('shows the drawer content once it is open', async () => {
    await mount({ breakpoint: NARROW, open: true }, { default: 'Reports' })

    const dialog = await screen.findByRole('dialog')
    expect(dialog.querySelector('.s-sidebar--drawer')).not.toBeNull()
    expect(within(dialog).getByRole('navigation', { name: 'Main' })).toHaveTextContent('Reports')
  })
})
