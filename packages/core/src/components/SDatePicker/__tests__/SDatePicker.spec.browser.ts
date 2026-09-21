import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { h } from 'vue'
import { SDatePicker } from '../index'

/**
 * Focus leaving is judged by real moves between the segments, the button and the calendar in
 * the portal; happy-dom does not reproduce the focusin/focusout order or relatedTarget.
 */
describe('SDatePicker · browser', () => {
  function setup() {
    const events: string[] = []
    render(() => [
      h(SDatePicker, {
        label: 'Pickup date',
        locale: 'en-US',
        onFocus: () => events.push('focus'),
        onBlur: () => events.push('blur'),
      }),
      h('button', { type: 'button' }, 'Next'),
    ])
    return events
  }

  it('moving between segments does not count as leaving the field', async () => {
    const events = setup()
    const [firstSegment] = screen.getAllByRole('spinbutton')
    await userEvent.click(firstSegment)
    await userEvent.keyboard('{Tab}{Tab}')
    expect(events).toEqual(['focus'])

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(events).toEqual(['focus', 'blur'])
  })

  it('the calendar is part of the field: blur fires when focus leaves it too', async () => {
    const events = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
    await expect.poll(() => document.querySelector('.s-date-picker__content')).not.toBeNull()
    await expect.poll(() => document.activeElement?.closest('.s-date-picker__content')).toBeTruthy()
    expect(events).toEqual(['focus'])

    await userEvent.keyboard('{Escape}')
    await expect.poll(() => document.querySelector('.s-date-picker__content')).toBeNull()
    expect(events).toEqual(['focus'])

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(events).toEqual(['focus', 'blur'])
  })

  it('closes the calendar once a day is picked, unless close-on-select is off', async () => {
    const content = () => document.querySelector('.s-date-picker__content')
    const { unmount } = render(SDatePicker, { props: { label: 'Date', locale: 'en-US' } })
    await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
    await expect.poll(content).not.toBeNull()
    await userEvent.click(
      document.querySelector<HTMLElement>(
        '[data-reka-calendar-cell-trigger]:not([data-outside-view])',
      )!,
    )
    await expect.poll(content).toBeNull()
    unmount()

    render(SDatePicker, { props: { label: 'Date', locale: 'en-US', closeOnSelect: false } })
    await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
    await expect.poll(content).not.toBeNull()
    await userEvent.click(
      document.querySelector<HTMLElement>(
        '[data-reka-calendar-cell-trigger]:not([data-outside-view])',
      )!,
    )
    expect(content()).not.toBeNull()
  })
})
