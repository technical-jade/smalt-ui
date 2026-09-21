import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { nextTick } from 'vue'
import type { Component } from 'vue'
import { CalendarDate, Time } from '@internationalized/date'
import { SCalendar, SDateField, SDatePicker, SDateRangePicker, STimeField } from '../index'

const jan = (day: number) => new CalendarDate(2026, 1, day)

describe('date and time fields mark a value outside minValue/maxValue', () => {
  it.each<[string, Component, Record<string, unknown>, string]>([
    ['SDateField', SDateField, { modelValue: jan(1), minValue: jan(10) }, '.s-date-field__wrap'],
    [
      'STimeField',
      STimeField,
      { modelValue: new Time(7), minValue: new Time(9) },
      '.s-time-field__wrap',
    ],
    [
      'SDatePicker',
      SDatePicker,
      { modelValue: jan(20), maxValue: jan(10) },
      '.s-date-picker__control',
    ],
    [
      'SDateRangePicker',
      SDateRangePicker,
      { modelValue: { start: jan(1), end: jan(5) }, minValue: jan(3) },
      '.s-date-range-picker__control',
    ],
  ])('%s', async (_, component, props, frame) => {
    const { container } = render(component, { props: { label: 'When', ...props } })
    await nextTick()
    expect(container.querySelector('.s-field')).toHaveClass('s-field--invalid')
    expect(container.querySelector(frame)).toHaveAttribute('data-invalid')
    expect(container.querySelector('[aria-invalid="true"]')).not.toBeNull()
  })

  it('a value in range stays valid', async () => {
    const { container } = render(SDateField, {
      props: { label: 'When', modelValue: jan(15), minValue: jan(10) },
    })
    await nextTick()
    expect(container.querySelector('.s-field')).not.toHaveClass('s-field--invalid')
  })
})

describe('SCalendar placeholder', () => {
  it('shows the placeholder month when there is no value', () => {
    render(SCalendar, { props: { placeholder: new CalendarDate(2030, 5, 1), locale: 'en-US' } })
    expect(screen.getByRole('heading')).toHaveTextContent(/may 2030/i)
  })
})
