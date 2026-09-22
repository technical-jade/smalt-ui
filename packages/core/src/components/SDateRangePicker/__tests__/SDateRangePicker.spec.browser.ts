import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { h } from 'vue'
import { SDateRangePicker } from '../index'

/**
 * Focus leaving is judged by real moves between the segments, the button and the calendar in
 * the portal; happy-dom does not reproduce the focusin/focusout order or relatedTarget.
 */
describe('SDateRangePicker · browser', () => {
  function setup() {
    const events: string[] = []
    render(() => [
      h(SDateRangePicker, {
        label: 'Trip',
        locale: 'en-US',
        onFocus: () => events.push('focus'),
        onBlur: () => events.push('blur'),
      }),
      h('button', { type: 'button' }, 'Next'),
    ])
    return events
  }

  it('moving between the segments of both dates does not count as leaving', async () => {
    const events = setup()
    const [firstSegment] = screen.getAllByRole('spinbutton')
    await userEvent.click(firstSegment!)
    await userEvent.keyboard('{Tab}{Tab}{Tab}{Tab}')
    expect(events).toEqual(['focus'])

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(events).toEqual(['focus', 'blur'])
  })

  it('the calendar is part of the field: blur fires when focus leaves it too', async () => {
    const content = () => document.querySelector('.s-date-range-picker__content')
    const events = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
    await expect.poll(content).not.toBeNull()
    await expect
      .poll(() => document.activeElement?.closest('.s-date-range-picker__content'))
      .toBeTruthy()
    expect(events).toEqual(['focus'])

    await userEvent.keyboard('{Escape}')
    await expect.poll(content).toBeNull()
    expect(events).toEqual(['focus'])

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(events).toEqual(['focus', 'blur'])
  })
})
