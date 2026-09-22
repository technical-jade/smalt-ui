import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { SSelect } from '../index'

const options = [
  { label: 'New York', value: 'ny' },
  { label: 'Chicago', value: 'chi' },
]

/**
 * Floating layer: positioning is computed from the trigger's real size, which happy-dom lacks;
 * there the list always sits at zero coordinates.
 */
describe('SSelect · browser', () => {
  it('opens on click and selects an option with the mouse', async () => {
    const { emitted } = render(SSelect, {
      props: { options, ariaLabel: 'City' },
    })
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(await screen.findByText('Chicago'))
    expect(emitted('update:modelValue')?.at(-1)).toEqual(['chi'])
  })

  it('the list aligns with the field frame and opens below it', async () => {
    const { container } = render(SSelect, { props: { options, ariaLabel: 'City' } })
    await userEvent.click(screen.getByRole('combobox'))
    const listbox = await screen.findByRole('listbox')
    // The popup anchor is the whole frame (PopperAnchor.reference), not the narrow trigger in it.
    const control = container.querySelector('.s-select__control')!.getBoundingClientRect()
    const l = listbox.getBoundingClientRect()
    expect(l.width).toBeGreaterThan(0)
    expect(l.height).toBeGreaterThan(0)
    /**
     * Exact edge alignment is not checked: Reka keeps a margin from the window edges
     * (collision padding). What matters is that the popup overlaps the frame horizontally and
     * opens below it instead of flying off to a corner or covering the field.
     */
    expect(l.left).toBeLessThan(control.right)
    expect(l.right).toBeGreaterThan(control.left)
    expect(l.top).toBeGreaterThanOrEqual(control.bottom - 1)
  })

  it('a long list does not grow forever: the panel is capped and scrolls', async () => {
    const many = Array.from({ length: 300 }, (_, i) => ({
      label: `Option ${i + 1}`,
      value: String(i),
    }))
    render(SSelect, { props: { options: many, ariaLabel: 'Quantity' } })
    await userEvent.click(screen.getByRole('combobox'))
    await screen.findByRole('listbox')
    const viewport = document.querySelector<HTMLElement>('.s-select__viewport')!
    expect(viewport.getBoundingClientRect().height).toBeLessThanOrEqual(320)
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
  })

  it('square also removes the rounding from the dropdown panel', async () => {
    render(SSelect, { props: { options, ariaLabel: 'City', square: true } })
    await userEvent.click(screen.getByRole('combobox'))
    await screen.findByRole('listbox')
    const content = document.querySelector('.s-select__content')!
    expect(getComputedStyle(content).borderTopLeftRadius).toBe('0px')
  })

  it('searchable: a long list is virtualized, not all options are in the DOM', async () => {
    const many = Array.from({ length: 500 }, (_, i) => ({
      label: `Option ${i + 1}`,
      value: String(i),
    }))
    render(SSelect, { props: { options: many, ariaLabel: 'City', searchable: true } })
    await userEvent.click(screen.getByRole('button', { name: 'Show options' }))
    await screen.findByRole('option', { name: 'Option 1' })
    const rendered = document.querySelectorAll('.s-select__item').length
    expect(rendered).toBeGreaterThan(0)
    expect(rendered).toBeLessThan(many.length)
  })

  it('the frame shrinks with a narrow container instead of overflowing it', async () => {
    const { container } = render(SSelect, {
      props: { options, ariaLabel: 'City' },
      attrs: { style: 'width: 120px' },
    })
    const control = container.querySelector('.s-select__control')!
    expect(control.getBoundingClientRect().width).toBeLessThanOrEqual(120)
  })

  function withEvents() {
    const events: string[] = []
    render(() => [
      h(SSelect, {
        options,
        label: 'City',
        onFocus: () => events.push('focus'),
        onBlur: () => events.push('blur'),
      }),
      h('button', { type: 'button' }, 'Next'),
    ])
    return events
  }
  const focusInList = () => document.activeElement?.closest('.s-select__content')

  it('opened with the mouse, the field reports focus at once and blur on leaving', async () => {
    const events = withEvents()
    // Reka opens the list on pointerdown and moves focus straight into it, past the trigger.
    await userEvent.click(screen.getByRole('combobox'))
    await expect.poll(focusInList).toBeTruthy()
    expect(events).toEqual(['focus'])
    await userEvent.click(await screen.findByText('Chicago'))
    await userEvent.tab()
    expect(events).toEqual(['focus', 'blur'])
  })

  it('opened from the keyboard, moving into the list and back is not a leave', async () => {
    const events = withEvents()
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    await expect.poll(focusInList).toBeTruthy()
    await userEvent.keyboard('{Escape}')
    await expect.poll(() => document.querySelector('.s-select__content')).toBeNull()
    expect(events).toEqual(['focus'])
    await userEvent.tab()
    expect(events).toEqual(['focus', 'blur'])
  })
})
