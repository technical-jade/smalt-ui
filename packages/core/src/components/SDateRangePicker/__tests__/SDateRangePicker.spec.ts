import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { CalendarDate } from '@internationalized/date'
import { SDateRangePicker } from '../index'

const range = {
  start: new CalendarDate(2026, 7, 11),
  end: new CalendarDate(2026, 7, 20),
}

describe('SDateRangePicker', () => {
  it('renders the label and the range field', () => {
    render(SDateRangePicker, { props: { label: 'Period', locale: 'en-US' } })
    expect(screen.getByText('Period')).toBeInTheDocument()
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('renders start and end segments (three spinbuttons each)', () => {
    render(SDateRangePicker, { props: { modelValue: range, locale: 'en-US' } })
    expect(screen.getAllByRole('spinbutton')).toHaveLength(6)
  })

  it('names the segments of both dates from the dictionary', () => {
    render(SDateRangePicker, { props: { locale: 'en-GB' } })
    const segments = screen.getAllByRole('spinbutton')
    expect(segments.map((segment) => segment.getAttribute('aria-label'))).toEqual([
      'day',
      'month',
      'year',
      'day',
      'month',
      'year',
    ])
    expect(segments[3]).toHaveAttribute('aria-valuetext', 'Empty')
  })

  it('renders a separator between start and end', () => {
    const { container } = render(SDateRangePicker, {
      props: { modelValue: range, locale: 'en-US' },
    })
    expect(container.querySelectorAll('.s-date-range-picker__dash')).toHaveLength(1)
  })

  it('renders the open-calendar button', () => {
    render(SDateRangePicker, { props: { locale: 'en-US' } })
    expect(screen.getByRole('button', { name: 'Open calendar' })).toBeInTheDocument()
  })

  it('links the error and marks the field invalid', () => {
    render(SDateRangePicker, {
      props: { label: 'Period', error: 'Enter a range', locale: 'en-US' },
    })
    expect(screen.getByText('Enter a range')).toBeInTheDocument()
    expect(screen.getByRole('group')).toHaveAttribute('aria-invalid', 'true')
  })

  it('the calendar is closed by default', () => {
    render(SDateRangePicker, { props: { locale: 'en-US' } })
    expect(screen.queryByRole('button', { name: 'Next month' })).toBeNull()
  })

  it('renders the prepend/append slots inside the frame', () => {
    const { container } = render(SDateRangePicker, {
      props: { locale: 'en-US' },
      slots: { prepend: () => 'P', append: () => 'A' },
    })
    const control = container.querySelector('.s-date-range-picker__control')
    expect(control?.querySelector('.s-date-range-picker__prepend')?.textContent).toBe('P')
    expect(control?.querySelector('.s-date-range-picker__append')?.textContent).toBe('A')
  })
})
