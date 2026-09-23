import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SFab } from '../index'
import { resetDevWarnings } from '../../../internal/dev'
import type { SFabAction } from '../types'

const actions: SFabAction[] = [
  { id: 'note', label: 'New note', icon: 'file-text' },
  { id: 'mail', label: 'New message', icon: 'mail' },
  { id: 'event', label: 'New event', icon: 'calendar', disabled: true },
]

let warn: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  resetDevWarnings()
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  warn.mockRestore()
})

describe('SFab', () => {
  it('renders a circular button named by ariaLabel', () => {
    const { container } = render(SFab, { props: { icon: 'plus', ariaLabel: 'Create' } })

    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
    expect(container.querySelector('.s-fab__toggle--extended')).toBeNull()
    expect(warn).not.toHaveBeenCalled()
  })

  it('renders an extended button named by its visible label', () => {
    const { container } = render(SFab, { props: { icon: 'plus', label: 'Compose' } })
    const toggle = screen.getByRole('button', { name: 'Compose' })

    expect(toggle).toHaveTextContent('Compose')
    // The visible text is the accessible name: an aria-label would hide the word it reads.
    expect(toggle).not.toHaveAttribute('aria-label')
    expect(container.querySelector('.s-fab__toggle--extended')).not.toBeNull()
  })

  it('warns in dev about a circular button without an accessible name', () => {
    render(SFab, { props: { icon: 'plus' } })

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[SFab]'))
  })

  it('applies the position class and passes the offset variables to the root', () => {
    const { container } = render(SFab, {
      props: { icon: 'plus', ariaLabel: 'Create', position: 'top-start' },
      attrs: { style: '--s-fab-top: 12px; --s-fab-left: 12px' },
    })
    const root = container.querySelector<HTMLElement>('.s-fab')!

    expect(root).toHaveClass('s-fab--top-start', 's-fab--fixed', 's-fab--edge-start')
    expect(root.style.getPropertyValue('--s-fab-top')).toBe('12px')
    expect(root.style.getPropertyValue('--s-fab-left')).toBe('12px')
  })

  it('leaves a static button in the flow', () => {
    const { container } = render(SFab, {
      props: { icon: 'plus', ariaLabel: 'Create', position: 'static' },
    })

    expect(container.querySelector('.s-fab')).not.toHaveClass('s-fab--fixed')
  })

  it('marks the requested fan direction', () => {
    const { container } = render(SFab, {
      props: { icon: 'plus', ariaLabel: 'Create', actions, direction: 'end' },
    })

    expect(container.querySelector('.s-fab')).toHaveClass('s-fab--fan-end')
  })

  it('opens the fan on click and renders an action per entry', async () => {
    render(SFab, { props: { icon: 'plus', actions } })
    const toggle = screen.getByRole('button', { name: 'Show actions' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menu')).toBeNull()

    await fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAttribute('aria-haspopup', 'menu')
    expect(screen.getByRole('menu', { name: 'Show actions' })).toBeInTheDocument()
    const items = screen.getAllByRole('menuitem')
    expect(items.map((item) => item.getAttribute('aria-label'))).toEqual([
      'New note',
      'New message',
      'New event',
    ])
    expect(screen.getByText('New note')).toHaveClass('s-fab__action-label')
  })

  it('links the toggle to the open fan', async () => {
    render(SFab, { props: { icon: 'plus', actions } })
    await fireEvent.click(screen.getByRole('button', { name: 'Show actions' }))

    const toggle = screen.getByRole('button', { name: 'Show actions' })
    expect(toggle.getAttribute('aria-controls')).toBe(screen.getByRole('menu').id)
  })

  it('emits select with the chosen action and closes the fan', async () => {
    const { emitted } = render(SFab, { props: { icon: 'plus', actions, open: true } })

    await fireEvent.click(screen.getByRole('menuitem', { name: 'New message' }))

    expect(emitted('select')).toEqual([[actions[1]]])
    expect(emitted('update:open')!.at(-1)).toEqual([false])
  })

  it('does not act on a disabled action', async () => {
    const { emitted } = render(SFab, { props: { icon: 'plus', actions, open: true } })
    const item = screen.getByRole('menuitem', { name: 'New event' })
    expect(item).toBeDisabled()

    await fireEvent.click(item)

    expect(emitted('select')).toBeUndefined()
  })

  it('supports v-model:open', async () => {
    const { emitted, rerender } = render(SFab, { props: { icon: 'plus', actions, open: false } })

    await fireEvent.click(screen.getByRole('button', { name: 'Show actions' }))
    expect(emitted('update:open')).toEqual([[true]])

    await rerender({ open: true })
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await rerender({ open: false })
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('takes the name of a fan toggle from the dictionary and from actionsLabel', () => {
    const { unmount } = render(SFab, { props: { icon: 'plus', actions } })
    expect(screen.getByRole('button', { name: 'Show actions' })).toBeInTheDocument()
    unmount()

    render(SFab, { props: { icon: 'plus', actions, actionsLabel: 'Quick actions' } })
    expect(screen.getByRole('button', { name: 'Quick actions' })).toBeInTheDocument()
  })

  it('keeps the visible label as the name of an extended fan toggle', () => {
    render(SFab, { props: { icon: 'plus', label: 'Compose', actions } })

    expect(screen.getByRole('button', { name: 'Compose' })).toBeInTheDocument()
    expect(warn).not.toHaveBeenCalled()
  })

  it('closes the fan on Escape and returns focus to the toggle', async () => {
    render(SFab, { props: { icon: 'plus', actions } })
    const toggle = screen.getByRole('button', { name: 'Show actions' })

    await fireEvent.click(toggle)
    await fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })

    expect(screen.queryByRole('menu')).toBeNull()
    expect(document.activeElement).toBe(toggle)
  })

  it('opens the fan on hover when openOn is hover', async () => {
    const { container } = render(SFab, { props: { icon: 'plus', actions, openOn: 'hover' } })
    const root = container.querySelector('.s-fab')!

    await fireEvent.pointerEnter(root)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await fireEvent.pointerLeave(root)
    expect(screen.queryByRole('menu')).toBeNull()
  })
})
