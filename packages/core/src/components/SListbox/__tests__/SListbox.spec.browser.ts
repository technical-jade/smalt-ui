import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SListbox } from '../index'
import type { SListboxOption } from '../types'

/**
 * Roving focus, typeahead and scrolling the active option into view: happy-dom has no real focus
 * and no layout, so none of it can be trusted there.
 */
const options: SListboxOption[] = [
  { label: 'Amsterdam', value: 'ams' },
  { label: 'Berlin', value: 'ber', disabled: true },
  { label: 'Chicago', value: 'chi' },
  { label: 'Delhi', value: 'del' },
  { label: 'London', value: 'lon' },
]

const renderListbox = (props: Record<string, unknown> = {}) =>
  render(SListbox, { props: { options, label: 'City', ...props } })

const option = (name: string) => screen.getByRole('option', { name })

/**
 * Reka highlights an option as soon as the list mounts and moves the tab stop from the list onto
 * it, so Tab lands on that option — which is where a keyboard session starts.
 */
const enterList = async () => {
  const first = await vi.waitFor(() => {
    const el = option('Amsterdam')
    expect(el).toHaveAttribute('tabindex', '0')
    return el
  })
  expect(screen.getByRole('listbox')).toHaveAttribute('tabindex', '-1')
  first.focus()
  expect(first).toHaveFocus()
  return first
}

describe('SListbox · browser', () => {
  it('moves the highlight with the arrow keys and skips disabled options', async () => {
    renderListbox()
    const first = await enterList()
    expect(first).toHaveAttribute('data-highlighted')

    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(option('Chicago')).toHaveFocus())
    expect(option('Berlin')).not.toHaveAttribute('data-highlighted')

    await userEvent.keyboard('{ArrowUp}')
    await vi.waitFor(() => expect(option('Amsterdam')).toHaveFocus())
  })

  it('jumps to the first and the last option with Home and End', async () => {
    renderListbox()
    await enterList()

    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(option('London')).toHaveFocus())

    await userEvent.keyboard('{Home}')
    await vi.waitFor(() => expect(option('Amsterdam')).toHaveFocus())
  })

  it('highlights an option by typing its label', async () => {
    renderListbox()
    await enterList()

    await userEvent.keyboard('de')
    await vi.waitFor(() => expect(option('Delhi')).toHaveFocus())
  })

  it('selects the highlighted option with Space', async () => {
    const { emitted } = renderListbox()
    await enterList()

    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(option('Chicago')).toHaveFocus())
    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(emitted()['update:modelValue']?.at(-1)).toEqual(['chi']))
    expect(option('Chicago')).toHaveAttribute('aria-selected', 'true')
  })

  it('selects the highlighted option with Enter', async () => {
    const { emitted } = renderListbox()
    await enterList()

    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(emitted()['update:modelValue']?.at(-1)).toEqual(['ams']))
  })

  it('collects several values with multiple', async () => {
    const { emitted } = renderListbox({ multiple: true })
    await enterList()

    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(option('Chicago')).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(emitted()['update:modelValue']?.at(-1)).toEqual([['ams', 'chi']]))
  })

  it('scrolls the active option into view past maxHeight', async () => {
    renderListbox({ maxHeight: 96 })
    const viewport = document.querySelector<HTMLElement>('.s-scroll-area__viewport')!
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
    expect(viewport.scrollTop).toBe(0)

    await enterList()
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(option('London')).toHaveFocus())
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))

    const last = option('London').getBoundingClientRect()
    const frame = viewport.getBoundingClientRect()
    expect(Math.round(last.bottom)).toBeLessThanOrEqual(Math.ceil(frame.bottom))
  })
})
