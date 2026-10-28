import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { CalendarDate } from '@internationalized/date'
import { SDatePicker } from '../index'

describe('SDatePicker', () => {
  it('renders the label and the segmented field', () => {
    render(SDatePicker, { props: { label: 'Delivery date', locale: 'en-US' } })
    expect(screen.getByText('Delivery date')).toBeInTheDocument()
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('renders the open-calendar button', () => {
    render(SDatePicker, { props: { locale: 'en-US' } })
    expect(screen.getByRole('button', { name: 'Open calendar' })).toBeInTheDocument()
  })

  it('renders editable segments for the value', () => {
    render(SDatePicker, {
      props: { modelValue: new CalendarDate(2026, 7, 11), locale: 'en-US' },
    })
    expect(screen.getAllByRole('spinbutton')).toHaveLength(3)
  })

  it('names the segments from the dictionary', () => {
    render(SDatePicker, { props: { locale: 'en-GB' } })
    const [day] = screen.getAllByRole('spinbutton')
    expect(day).toHaveAttribute('aria-label', 'day')
    expect(day).toHaveAttribute('aria-valuetext', 'Empty')
  })

  it('links the error and marks the field invalid', () => {
    render(SDatePicker, { props: { label: 'Date', error: 'Enter a date', locale: 'en-US' } })
    expect(screen.getByText('Enter a date')).toBeInTheDocument()
    expect(screen.getByRole('group')).toHaveAttribute('aria-invalid', 'true')
  })

  it('applies the size class', () => {
    const { container } = render(SDatePicker, { props: { size: 'lg', locale: 'en-US' } })
    expect(container.querySelector('.s-date-picker')).toHaveClass('s-date-picker--lg')
  })

  it('the calendar is closed by default', () => {
    render(SDatePicker, { props: { locale: 'en-US' } })
    expect(screen.queryByRole('button', { name: 'Next month' })).toBeNull()
  })

  it('renders the prepend/append slots inside the frame', () => {
    const { container } = render(SDatePicker, {
      props: { locale: 'en-US' },
      slots: { prepend: () => 'P', append: () => 'A' },
    })
    const control = container.querySelector('.s-date-picker__control')
    expect(control?.querySelector('.s-date-picker__prepend')?.textContent).toBe('P')
    expect(control?.querySelector('.s-date-picker__append')?.textContent).toBe('A')
  })

  it('opens the calendar popup on trigger click', async () => {
    render(SDatePicker, {
      props: { modelValue: new CalendarDate(2026, 7, 11), locale: 'en-US' },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
    expect(await screen.findByRole('button', { name: 'Next month' })).toBeInTheDocument()
  })

  it('emits update:modelValue when a day is selected', async () => {
    const { emitted } = render(SDatePicker, {
      props: { modelValue: new CalendarDate(2026, 7, 11), locale: 'en-US' },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
    /**
     * The day is rendered by DatePickerCellTrigger, whose accessible name is the full date,
     * so search by the visible number inside the calendar cell.
     */
    const day = await screen.findByText('15', { selector: '.s-date-picker__day' })
    await fireEvent.click(day)
    const events = emitted()['update:modelValue'] as unknown[][]
    expect(events).toBeTruthy()
    const value = events.at(-1)?.[0] as CalendarDate
    expect(value.toString()).toBe('2026-07-15')
  })

  it('switches the month with the "Next month" button', async () => {
    render(SDatePicker, {
      props: { modelValue: new CalendarDate(2026, 7, 11), locale: 'en-US' },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
    await screen.findByRole('button', { name: 'Next month' })
    // The popup content is portaled to body, so look for the heading in document, not container.
    const heading = document.querySelector('.s-date-picker__heading') as HTMLElement
    expect(heading.textContent).toMatch(/july 2026/i)
    await fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
    await waitFor(() => expect(heading.textContent).toMatch(/august 2026/i))
  })
})
