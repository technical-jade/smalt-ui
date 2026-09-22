import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { Time } from '@internationalized/date'
import { STimePicker } from '../index'

describe('STimePicker · a11y', () => {
  it('has no violations (closed)', async () => {
    const { container } = render(STimePicker, {
      props: { label: 'Appointment', locale: 'en-GB' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations (with a value and an error)', async () => {
    const { container } = render(STimePicker, {
      props: {
        label: 'Appointment',
        error: 'Enter a time',
        modelValue: new Time(14, 30),
        locale: 'en-GB',
      },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  /**
   * The panel is portalled to body, where the popover adds focus guards around it, so the scan
   * takes the panel subtree instead of the whole document.
   */
  it('has no violations (the open panel)', async () => {
    render(STimePicker, {
      props: {
        label: 'Appointment',
        locale: 'en-US',
        hourCycle: 12,
        granularity: 'second',
        modelValue: new Time(14, 30, 15),
      },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Open time picker' }))
    const panel = document.querySelector('.s-time-picker__content') as HTMLElement
    expect(panel).not.toBeNull()
    expect(await axe(panel)).toHaveNoViolations()
  })
})
