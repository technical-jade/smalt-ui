import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { Time } from '@internationalized/date'
import { STimeField } from '../index'

describe('STimeField', () => {
  it('renders the label and the segment group', () => {
    render(STimeField, { props: { label: 'Time', locale: 'en-US' } })
    expect(screen.getByText('Time')).toBeInTheDocument()
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('renders editable hour and minute segments', () => {
    render(STimeField, { props: { modelValue: new Time(14, 30), locale: 'en-US' } })
    expect(screen.getAllByRole('spinbutton').length).toBeGreaterThanOrEqual(2)
  })

  it('names the time segments from the dictionary', () => {
    render(STimeField, { props: { locale: 'en-US', granularity: 'second' } })
    const [hour, minute, second, dayPeriod] = screen.getAllByRole('spinbutton')
    expect(hour).toHaveAttribute('aria-label', 'hour')
    expect(minute).toHaveAttribute('aria-label', 'minute')
    expect(second).toHaveAttribute('aria-label', 'second')
    expect(dayPeriod).toHaveAttribute('aria-label', 'AM/PM')
    expect(hour).toHaveAttribute('aria-valuetext', 'Empty')
  })

  it('links the error and marks the field invalid', () => {
    render(STimeField, { props: { label: 'Time', error: 'Enter a time', locale: 'en-US' } })
    expect(screen.getByText('Enter a time')).toBeInTheDocument()
    expect(screen.getByRole('group')).toHaveAttribute('aria-invalid', 'true')
  })

  it('passes disabled through', () => {
    const { container } = render(STimeField, { props: { disabled: true, locale: 'en-US' } })
    expect(container.querySelector('.s-time-field__control')).toHaveAttribute('data-disabled')
  })

  it('adds a seconds segment with granularity="second"', () => {
    const withMinute = render(STimeField, {
      props: { modelValue: new Time(14, 30), granularity: 'minute', locale: 'en-US' },
    })
    const minuteCount = withMinute.getAllByRole('spinbutton').length
    withMinute.unmount()

    const withSecond = render(STimeField, {
      props: { modelValue: new Time(14, 30, 15), granularity: 'second', locale: 'en-US' },
    })
    expect(withSecond.getAllByRole('spinbutton').length).toBeGreaterThan(minuteCount)
  })
})
