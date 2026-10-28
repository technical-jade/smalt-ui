import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { CalendarDate } from '@internationalized/date'
import { SDateField } from '../index'
import { installLocale } from '../../../composables'

describe('SDateField', () => {
  it('renders the label and the segment group', () => {
    render(SDateField, { props: { label: 'Date of birth', locale: 'en-US' } })
    expect(screen.getByText('Date of birth')).toBeInTheDocument()
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('renders editable segments (spinbutton) for the value', () => {
    render(SDateField, {
      props: { modelValue: new CalendarDate(2026, 7, 11), locale: 'en-US' },
    })
    expect(screen.getAllByRole('spinbutton')).toHaveLength(3)
  })

  it('names the segments and an empty value from the dictionary', () => {
    render(SDateField, { props: { locale: 'en-GB' } })
    const [day, month, year] = screen.getAllByRole('spinbutton')
    expect(day).toHaveAttribute('aria-label', 'day')
    expect(month).toHaveAttribute('aria-label', 'month')
    expect(year).toHaveAttribute('aria-label', 'year')
    expect(day).toHaveAttribute('aria-valuetext', 'Empty')
  })

  it('takes the segment names from a translated dictionary', () => {
    render(SDateField, {
      props: { locale: 'de-DE' },
      global: {
        plugins: [
          (app) => installLocale(app, { messages: { segmentDay: 'Tag', segmentEmpty: 'Leer' } }),
        ],
      },
    })
    const [day] = screen.getAllByRole('spinbutton')
    expect(day).toHaveAttribute('aria-label', 'Tag')
    expect(day).toHaveAttribute('aria-valuetext', 'Leer')
  })

  it('leaves the value text of a filled segment to Reka', () => {
    render(SDateField, {
      props: { modelValue: new CalendarDate(2026, 7, 11), locale: 'en-GB' },
    })
    const [day, month] = screen.getAllByRole('spinbutton')
    expect(day).toHaveAttribute('aria-valuetext', '11')
    expect(month.getAttribute('aria-valuetext')).toMatch(/^7 - July/)
  })

  it('links the error and marks the field invalid', () => {
    render(SDateField, { props: { label: 'Date', error: 'Required field', locale: 'en-US' } })
    expect(screen.getByText('Required field')).toBeInTheDocument()
    expect(screen.getByRole('group')).toHaveAttribute('aria-invalid', 'true')
  })

  it('passes disabled through', () => {
    const { container } = render(SDateField, {
      props: { disabled: true, locale: 'en-US' },
    })
    expect(container.querySelector('.s-date-field__control')).toHaveAttribute('data-disabled')
  })

  it('applies the size class', () => {
    const { container } = render(SDateField, { props: { size: 'lg', locale: 'en-US' } })
    expect(container.querySelector('.s-date-field')).toHaveClass('s-date-field--lg')
  })
})
