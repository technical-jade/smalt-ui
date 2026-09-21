import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { nextTick } from 'vue'
import type { Component } from 'vue'
import { CalendarDate, CalendarDateTime, Time } from '@internationalized/date'
import { SDateField, SDatePicker, SDateRangePicker, STimeField } from '../index'

// Without a value Reka keeps its own state and emits the update on the next tick.
async function paste(target: Element, text: string) {
  const clipboardData = new DataTransfer()
  clipboardData.setData('text', text)
  const event = new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true })
  target.dispatchEvent(event)
  await nextTick()
  return event
}

const segment = (container: Element, type?: 'start' | 'end') =>
  container.querySelector(
    type
      ? `[data-reka-date-range-field-segment-type="${type}"]:not([data-reka-date-field-segment="literal"])`
      : ':is([data-reka-date-field-segment], [data-reka-time-field-segment]):not([data-segment="literal"])',
  )!

const lastEmitted = (emitted: Record<string, unknown[]>) =>
  (emitted['update:modelValue']?.at(-1) as unknown[] | undefined)?.[0]
const lastValue = (emitted: Record<string, unknown[]>) => String(lastEmitted(emitted))

/** Reka's contenteditable segments reject input events; a real clipboard event is needed. */
describe('pasting into date and time segments', () => {
  it.each<[string, Component, Record<string, unknown>, string, string]>([
    ['SDateField, ISO', SDateField, {}, '2024-03-15', '2024-03-15'],
    ['SDateField, locale format', SDateField, { locale: 'en-GB' }, '15/03/2024', '2024-03-15'],
    [
      'SDateField with time',
      SDateField,
      { modelValue: new CalendarDateTime(2020, 1, 1, 8, 0), granularity: 'minute' },
      '2024-03-15T09:30',
      '2024-03-15T09:30:00',
    ],
    ['STimeField', STimeField, { modelValue: new Time(8) }, '9:30 PM', '21:30:00'],
    ['SDatePicker', SDatePicker, {}, '03/15/2024', '2024-03-15'],
  ])('%s', async (_, component, props, text, expected) => {
    const { container, emitted } = render(component, { props: { label: 'When', ...props } })
    const event = await paste(segment(container), text)
    expect(event.defaultPrevented).toBe(true)
    expect(lastValue(emitted())).toBe(expected)
  })

  it('SDateRangePicker takes both ends from one paste', async () => {
    const { container, emitted } = render(SDateRangePicker, { props: { label: 'Stay' } })
    await paste(segment(container, 'start'), '2024-03-15/2024-03-20')
    const range = lastEmitted(emitted()) as { start: unknown; end: unknown }
    expect([String(range.start), String(range.end)]).toEqual(['2024-03-15', '2024-03-20'])
  })

  it('SDateRangePicker sets the end the text was pasted into', async () => {
    const { container, emitted } = render(SDateRangePicker, {
      props: { label: 'Stay', modelValue: { start: new CalendarDate(2024, 3, 1), end: undefined } },
    })
    await paste(segment(container, 'end'), '2024-03-20')
    const range = lastEmitted(emitted()) as { start: unknown; end: unknown }
    expect([String(range.start), String(range.end)]).toEqual(['2024-03-01', '2024-03-20'])
  })

  it('text that is not a date leaves the value alone', async () => {
    const { container, emitted } = render(SDateField, {
      props: { label: 'When', modelValue: new CalendarDate(2024, 1, 1) },
    })
    await paste(segment(container), 'tomorrow')
    expect(emitted()['update:modelValue']).toBeUndefined()
  })
})
