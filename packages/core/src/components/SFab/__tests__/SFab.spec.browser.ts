import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SFab } from '../index'
import type { SFabAction } from '../types'

const actions: SFabAction[] = [
  { id: 'note', label: 'New note', icon: 'file-text' },
  { id: 'mail', label: 'New message', icon: 'mail' },
  { id: 'event', label: 'New event', icon: 'calendar', disabled: true },
]

/**
 * happy-dom has no focus order, no layout and no fixed positioning: the fan is hand-rolled, so
 * its keyboard and its geometry are only proven here.
 */
describe('SFab · browser', () => {
  function mount(props: Record<string, unknown> = {}) {
    const { container } = render(SFab, {
      props: { icon: 'plus', actions, ...props },
    })
    const root = container.querySelector<HTMLElement>('.s-fab')!
    const toggle = container.querySelector<HTMLButtonElement>('.s-fab__toggle')!
    const items = () =>
      Array.from(root.querySelectorAll<HTMLButtonElement>('.s-fab__action-button'))
    return { root, toggle, items }
  }

  it('opens the fan on click and moves focus into it', async () => {
    const { toggle, items } = mount()

    await userEvent.click(toggle)

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(document.activeElement).toBe(items()[0])
  })

  it('opens the fan from the keyboard and walks it with the arrows', async () => {
    const { toggle, items } = mount()
    toggle.focus()

    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toBe(items()[0])

    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toBe(items()[1])

    // The third action is disabled: focus wraps around to the first instead of stopping on it.
    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toBe(items()[0])

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(items()[1])

    await userEvent.keyboard('{End}')
    expect(document.activeElement).toBe(items()[1])

    await userEvent.keyboard('{Home}')
    expect(document.activeElement).toBe(items()[0])
  })

  it('closes on Escape and gives focus back to the button', async () => {
    const { toggle } = mount()
    toggle.focus()

    await userEvent.keyboard('{ArrowUp}')
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).toBeNull()
    expect(document.activeElement).toBe(toggle)
  })

  it('emits the action picked with the keyboard', async () => {
    const { container, emitted } = render(SFab, { props: { icon: 'plus', actions } })
    const toggle = container.querySelector<HTMLButtonElement>('.s-fab__toggle')!
    toggle.focus()

    await userEvent.keyboard('{ArrowUp}')
    await userEvent.keyboard('{ArrowUp}')
    await userEvent.keyboard('{Enter}')

    expect(emitted('select')).toEqual([[actions[1]]])
    expect(document.activeElement).toBe(toggle)
  })

  it('unfolds the fan upward, centered on the button', () => {
    const { toggle, items } = mount({ open: true })
    const button = toggle.getBoundingClientRect()

    for (const item of items()) {
      const rect = item.getBoundingClientRect()
      expect(rect.bottom).toBeLessThanOrEqual(button.top)
      expect(
        Math.abs((rect.left + rect.right) / 2 - (button.left + button.right) / 2),
      ).toBeLessThan(2)
    }
    // The order follows the fan: the first action is the one next to the button.
    expect(items()[0].getBoundingClientRect().top).toBeGreaterThan(
      items()[1].getBoundingClientRect().top,
    )
  })

  it('unfolds the fan sideways when asked', () => {
    const { toggle, items } = mount({ open: true, direction: 'end', position: 'bottom-start' })
    const button = toggle.getBoundingClientRect()

    for (const item of items()) {
      const rect = item.getBoundingClientRect()
      expect(rect.left).toBeGreaterThanOrEqual(button.right)
      expect(
        Math.abs((rect.top + rect.bottom) / 2 - (button.top + button.bottom) / 2),
      ).toBeLessThan(2)
    }
    expect(items()[0].getBoundingClientRect().left).toBeLessThan(
      items()[1].getBoundingClientRect().left,
    )
  })

  it('sits at the corner named by the position, at the offsets of its variables', () => {
    const { root, toggle } = mount({ position: 'bottom-end' })
    root.style.setProperty('--s-fab-right', '40px')
    root.style.setProperty('--s-fab-bottom', '40px')
    const rect = toggle.getBoundingClientRect()

    expect(getComputedStyle(root).position).toBe('fixed')
    expect(window.innerWidth - rect.right).toBeCloseTo(40, 0)
    expect(window.innerHeight - rect.bottom).toBeCloseTo(40, 0)
    // MD standard FAB: larger than a regular control of the same size name.
    expect(Math.round(rect.height)).toBe(56)
    expect(Math.round(rect.width)).toBe(56)
  })

  it('closes when a press lands outside it', async () => {
    const { toggle } = mount()
    await userEvent.click(toggle)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await userEvent.click(document.body, { position: { x: 5, y: 5 } })

    expect(screen.queryByRole('menu')).toBeNull()
  })
})
