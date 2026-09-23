import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SAppBar } from '../../SAppBar'
import { SPage } from '../../SPage'
import { SSidebar } from '../index'

/**
 * The shell is geometry: the column is taken out of the flow and the page pays for it with
 * padding, the rail narrows through a media-query-scoped rule, and the drawer traps focus. None of
 * that exists in happy-dom. The browser viewport is 1280×800, so `sm` keeps the column and `xl`
 * forces the drawer.
 */
describe('app shell · browser', () => {
  function mount(props = '') {
    const collapsed = ref(false)
    const open = ref(false)
    const { container } = render({
      components: { SAppBar, SSidebar, SPage },
      setup: () => ({ collapsed, open }),
      template: `
        <div
          class="s-root s-root--app"
          style="position: relative; transform: translateZ(0); block-size: 480px"
        >
          <SAppBar>Dashboard</SAppBar>
          <SSidebar
            v-model:collapsed="collapsed"
            v-model:open="open"
            aria-label="Main"
            ${props}
          >
            <span class="s-sidebar__label">Reports</span>
          </SSidebar>
          <SPage>Content</SPage>
        </div>
      `,
    })
    return {
      collapsed,
      open,
      shell: container.querySelector<HTMLElement>('.s-root')!,
      bar: container.querySelector<HTMLElement>('.s-app-bar')!,
      page: container.querySelector<HTMLElement>('.s-page')!,
      content: container.querySelector<HTMLElement>('.s-page__content')!,
      column: () => container.querySelector<HTMLElement>('.s-sidebar--fixed'),
    }
  }

  it('puts the column beside the page and the page below the bar', async () => {
    const { bar, page, content, column } = mount('breakpoint="sm"')
    await vi.waitFor(() => expect(column()).not.toBeNull())

    const sidebar = column()!.getBoundingClientRect()
    expect(sidebar.top).toBeCloseTo(bar.getBoundingClientRect().bottom, 0)
    expect(page.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      bar.getBoundingClientRect().bottom - 1,
    )
    expect(content.getBoundingClientRect().left).toBeGreaterThanOrEqual(sidebar.right)
  })

  it('narrows the rail and the page padding when collapsed', async () => {
    const { collapsed, page, column } = mount('breakpoint="sm"')
    await vi.waitFor(() => expect(column()).not.toBeNull())

    const expanded = column()!.getBoundingClientRect().width
    const expandedPadding = parseFloat(getComputedStyle(page).paddingLeft)

    collapsed.value = true
    await vi.waitFor(() => expect(column()!.getBoundingClientRect().width).toBeLessThan(expanded))

    expect(parseFloat(getComputedStyle(page).paddingLeft)).toBeLessThan(expandedPadding)
    expect(getComputedStyle(screen.getByText('Reports')).display).toBe('none')
  })

  it('becomes a focus-trapping drawer below the breakpoint', async () => {
    const { open, column } = mount('breakpoint="xl"')
    await vi.waitFor(() => expect(column()).toBeNull())

    open.value = true
    const dialog = await screen.findByRole('dialog')
    await vi.waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))

    expect(dialog.querySelector('.s-sidebar--drawer')).not.toBeNull()
    expect(screen.getByRole('navigation', { name: 'Main' })).toHaveTextContent('Reports')
  })
})
