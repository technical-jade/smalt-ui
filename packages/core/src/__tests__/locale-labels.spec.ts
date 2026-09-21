import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { h } from 'vue'
import type { Component } from 'vue'
import { CalendarDate } from '@internationalized/date'
import { SCalendar, SDatePicker, SDateRangePicker, SPagination, SPinInput } from '../index'
import { ConfigProvider, ToastProvider } from '../providers'
import type { SMessages } from '../composables'

/**
 * Accessible names that Reka would otherwise hardcode in English must follow the dictionary and
 * yield to a per-instance prop.
 */
function renderWith(
  component: Component,
  props: Record<string, unknown>,
  messages?: Partial<SMessages>,
) {
  const node = () => h(component, props)
  return render({
    render: () => (messages ? h(ConfigProvider, { messages }, { default: node }) : node()),
  })
}

const date = new CalendarDate(2026, 7, 11)

// The pickers render the calendar only in the open popup.
async function calendarName(component: Component) {
  if (component !== SCalendar) {
    await fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
  }
  const calendar = await waitFor(() => {
    const el = document.querySelector('.s-calendar, [class$="picker__calendar"]')
    expect(el).not.toBeNull()
    return el!
  })
  return calendar.getAttribute('aria-label')
}

describe('localized accessible names', () => {
  describe.each<[string, Component, Record<string, unknown>]>([
    ['SCalendar', SCalendar, { modelValue: date, locale: 'en-US' }],
    ['SDatePicker', SDatePicker, { modelValue: date, locale: 'en-US' }],
    [
      'SDateRangePicker',
      SDateRangePicker,
      { modelValue: { start: date, end: date.add({ days: 3 }) }, locale: 'en-US' },
    ],
  ])('%s calendar', (_, component, props) => {
    it('takes its name from the dictionary', async () => {
      renderWith(component, props, { calendar: 'Kalender' })
      expect(await calendarName(component)).toMatch(/^Kalender, July/)
    })

    it('calendarLabel overrides the dictionary', async () => {
      renderWith(component, { ...props, calendarLabel: 'Due date' }, { calendar: 'Kalender' })
      expect(await calendarName(component)).toMatch(/^Due date, July/)
    })
  })

  it('SPagination names its landmark', () => {
    renderWith(SPagination, { total: 50 })
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
  })

  it('SPagination takes the landmark name from the dictionary and the ariaLabel prop', () => {
    renderWith(SPagination, { total: 50 }, { pagination: 'Seiten' })
    expect(screen.getByRole('navigation', { name: 'Seiten' })).toBeInTheDocument()
    renderWith(SPagination, { total: 50, ariaLabel: 'Results pages' }, { pagination: 'Seiten' })
    expect(screen.getByRole('navigation', { name: 'Results pages' })).toBeInTheDocument()
  })

  it('SPinInput names each cell from the dictionary template', () => {
    const { container } = renderWith(
      SPinInput,
      { length: 3, label: 'Code' },
      { pinCell: 'Ziffer {index} von {length}' },
    )
    const names = [...container.querySelectorAll('.s-pin-input__cell')].map((c) =>
      c.getAttribute('aria-label'),
    )
    expect(names).toEqual(['Ziffer 1 von 3', 'Ziffer 2 von 3', 'Ziffer 3 von 3'])
  })

  it('SPinInput cellLabel overrides the dictionary', () => {
    const { container } = renderWith(SPinInput, {
      length: 2,
      label: 'Code',
      cellLabel: 'Digit {index}',
    })
    expect(container.querySelector('.s-pin-input__cell')).toHaveAttribute('aria-label', 'Digit 1')
  })

  it('ToastProvider names the region from label, the per-toast prefix from the dictionary', async () => {
    renderWith(ToastProvider, { label: 'Benachrichtigungen' })
    await waitFor(() =>
      expect(document.querySelector('[role="region"]')).toHaveAttribute(
        'aria-label',
        'Benachrichtigungen (F8)',
      ),
    )
  })

  it('ToastProvider takes the region name from the dictionary', async () => {
    renderWith(ToastProvider, {}, { notifications: 'Mitteilungen' })
    await waitFor(() =>
      expect(document.querySelector('[role="region"]')).toHaveAttribute(
        'aria-label',
        'Mitteilungen (F8)',
      ),
    )
  })
})
