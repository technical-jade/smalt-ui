import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { CalendarDate } from '@internationalized/date'
import { SCalendar } from '../index'

// Roving focus over the day grid: happy-dom neither moves focus nor tracks tabindex changes.
describe('SCalendar · browser', () => {
  const focusedDay = () => document.activeElement?.textContent?.trim()

  it('the grid has one tab stop, and arrows move focus between days', async () => {
    const { container } = render(SCalendar, {
      props: { modelValue: new CalendarDate(2026, 1, 14), locale: 'en-US' },
    })
    const tabStops = container.querySelectorAll('[data-reka-calendar-cell-trigger][tabindex="0"]')
    expect(tabStops).toHaveLength(1)

    await userEvent.click(tabStops[0] as HTMLElement)
    await userEvent.keyboard('{ArrowRight}')
    expect(focusedDay()).toBe('15')
    await userEvent.keyboard('{ArrowDown}')
    expect(focusedDay()).toBe('22')
  })

  it('an arrow past the last day turns the month', async () => {
    const { container } = render(SCalendar, {
      props: { modelValue: new CalendarDate(2026, 1, 31), locale: 'en-US' },
    })
    await userEvent.click(
      container.querySelector<HTMLElement>('[data-reka-calendar-cell-trigger][tabindex="0"]')!,
    )
    await userEvent.keyboard('{ArrowRight}')
    expect(focusedDay()).toBe('1')
    expect(screen.getByText('February 2026')).toBeInTheDocument()
  })
})
