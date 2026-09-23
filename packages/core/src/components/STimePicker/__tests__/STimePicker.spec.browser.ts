import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { h, shallowRef } from 'vue'
import { Time } from '@internationalized/date'
import { STimePicker } from '../index'
import type { STimeValue } from '../../STimeField/types'

/**
 * The panel is portalled, keeps its own roving focus and scrolls its columns; happy-dom has
 * neither layout nor real focus moves between a portal and its trigger.
 */
describe('STimePicker · browser', () => {
  function setup(props: Record<string, unknown> = {}, initial?: STimeValue) {
    const value = shallowRef<STimeValue | undefined>(initial)
    render(() => [
      h(STimePicker, {
        label: 'Appointment',
        locale: 'en-GB',
        ...props,
        modelValue: value.value,
        'onUpdate:modelValue': (next: STimeValue | undefined) => (value.value = next),
      }),
      h('button', { type: 'button' }, 'Next'),
    ])
    return value
  }

  const trigger = () => screen.getByRole('button', { name: 'Open time picker' })
  const panel = () => document.querySelector<HTMLElement>('.s-time-picker__content')
  const hours = () => document.querySelectorAll<HTMLElement>('[role="listbox"]')[0]!

  it('opens with the mouse and puts focus on the hour column', async () => {
    setup({}, new Time(9, 0))
    await userEvent.click(trigger())
    await expect.poll(panel).not.toBeNull()
    await expect.poll(() => document.activeElement?.closest('[role="listbox"]')).toBe(hours())
    expect(document.activeElement?.textContent?.trim()).toBe('09')
  })

  it('opens from the keyboard', async () => {
    setup()
    trigger().focus()
    await userEvent.keyboard('{Enter}')
    await expect.poll(panel).not.toBeNull()
    await expect.poll(() => document.activeElement?.getAttribute('role')).toBe('option')
  })

  it('moves focus inside a column with the arrows and jumps with Home/End', async () => {
    setup({}, new Time(9, 0))
    await userEvent.click(trigger())
    await expect.poll(() => document.activeElement?.textContent?.trim()).toBe('09')

    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    expect(document.activeElement?.textContent?.trim()).toBe('11')
    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement?.textContent?.trim()).toBe('10')

    await userEvent.keyboard('{End}')
    expect(document.activeElement?.textContent?.trim()).toBe('23')
    await userEvent.keyboard('{Home}')
    expect(document.activeElement?.textContent?.trim()).toBe('00')
    expect(document.activeElement?.closest('[role="listbox"]')).toBe(hours())
  })

  it('crosses to the neighbouring column with the left and right arrows', async () => {
    setup({}, new Time(9, 30))
    await userEvent.click(trigger())
    await expect.poll(() => document.activeElement?.textContent?.trim()).toBe('09')

    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement?.textContent?.trim()).toBe('30')
    await userEvent.keyboard('{ArrowLeft}')
    expect(document.activeElement?.textContent?.trim()).toBe('09')
  })

  it('picks the focused value with Enter', async () => {
    const value = setup()
    await userEvent.click(trigger())
    await expect.poll(() => document.activeElement?.getAttribute('role')).toBe('option')
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}')
    await expect.poll(() => String(value.value)).toBe('02:00:00')
  })

  it('closes on Escape and returns focus to the field', async () => {
    setup({}, new Time(9, 0))
    await userEvent.click(trigger())
    await expect.poll(panel).not.toBeNull()

    await userEvent.keyboard('{Escape}')
    await expect.poll(panel).toBeNull()
    expect(document.activeElement).toBe(trigger())
    expect(trigger().closest('.s-time-picker')).not.toBeNull()
  })

  it('scrolls the selected value into view when the panel opens', async () => {
    setup({}, new Time(21, 45))
    await userEvent.click(trigger())
    await expect.poll(panel).not.toBeNull()

    const viewport = hours()
      .closest('.s-scroll-area')!
      .querySelector<HTMLElement>('[data-reka-scroll-area-viewport]')!
    await expect.poll(() => viewport.scrollTop).toBeGreaterThan(0)
    const selected = hours().querySelector<HTMLElement>('[data-selected]')!
    const column = viewport.getBoundingClientRect()
    const option = selected.getBoundingClientRect()
    expect(option.top).toBeGreaterThanOrEqual(column.top)
    expect(option.bottom).toBeLessThanOrEqual(column.bottom)
  })
})
