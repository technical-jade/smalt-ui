import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { nextTick } from 'vue'
import type { Component } from 'vue'
import { CalendarDate, Time } from '@internationalized/date'
import {
  SAutocomplete,
  SCheckbox,
  SColorField,
  SDateField,
  SDatePicker,
  SDateRangePicker,
  SInput,
  SNumberField,
  SPinInput,
  SRadioGroup,
  SSelect,
  SSlider,
  SSwitch,
  STimeField,
} from '../index'

const options = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
]

/** Renders the component inside a `<form>`: Reka adds its hidden inputs only there. */
async function submit(component: Component, props: Record<string, unknown>) {
  const { container } = render({
    components: { Field: component },
    setup: () => ({ props }),
    template: '<form><Field v-bind="props" /></form>',
  })
  await nextTick()
  const form = container.querySelector('form')!
  return { form, data: new FormData(form) }
}

describe('native form submission', () => {
  it.each<[string, Component, Record<string, unknown>, string]>([
    ['SCheckbox', SCheckbox, { modelValue: true, value: 'yes' }, 'yes'],
    ['SSwitch', SSwitch, { modelValue: true }, 'on'],
    ['SRadioGroup', SRadioGroup, { modelValue: 'two', options }, 'two'],
    ['SSlider', SSlider, { modelValue: 40 }, '40'],
    ['SSelect', SSelect, { modelValue: 'two', options }, 'two'],
    ['SSelect searchable', SSelect, { modelValue: 'two', options, searchable: true }, 'two'],
    ['SAutocomplete', SAutocomplete, { modelValue: 'two', selectedLabel: 'Two', options }, 'two'],
    ['SColorField', SColorField, { modelValue: '#3b82f6' }, '#3b82f6'],
    ['SNumberField', SNumberField, { modelValue: 3 }, '3'],
    ['SPinInput', SPinInput, { modelValue: ['1', '2'], length: 2 }, '12'],
    ['SDateField', SDateField, { modelValue: new CalendarDate(2026, 1, 2) }, '2026-01-02'],
    ['SDatePicker', SDatePicker, { modelValue: new CalendarDate(2026, 1, 2) }, '2026-01-02'],
    ['STimeField', STimeField, { modelValue: new Time(9, 30) }, '09:30:00'],
    [
      'SDateRangePicker',
      SDateRangePicker,
      { modelValue: { start: new CalendarDate(2026, 1, 2), end: new CalendarDate(2026, 1, 5) } },
      '2026-01-02/2026-01-05',
    ],
  ])('%s submits its value under name', async (_, component, props, expected) => {
    const { form, data } = await submit(component, { name: 'field', ...props })
    expect(data.get('field')).toBe(expected)
    // The name belongs to the value, not to the field frame.
    expect(form.querySelector('.s-field[name]')).toBeNull()
  })

  it.each<[string, Component, Record<string, unknown>]>([
    ['SCheckbox', SCheckbox, {}],
    ['SSwitch', SSwitch, {}],
    ['SRadioGroup', SRadioGroup, { options }],
    ['SSelect', SSelect, { options }],
    ['SAutocomplete', SAutocomplete, { options }],
    ['SColorField', SColorField, {}],
    ['SNumberField', SNumberField, {}],
    ['SPinInput', SPinInput, { length: 2 }],
    ['SDateField', SDateField, {}],
    ['SDatePicker', SDatePicker, {}],
    ['STimeField', STimeField, {}],
    ['SDateRangePicker', SDateRangePicker, {}],
  ])('%s: an empty required field fails native validation', async (_, component, props) => {
    const { form } = await submit(component, { name: 'field', required: true, ...props })
    expect(form.checkValidity()).toBe(false)
  })

  it('SDateRangePicker leaves the value empty until both bounds are picked', async () => {
    const { data } = await submit(SDateRangePicker, {
      name: 'period',
      modelValue: { start: new CalendarDate(2026, 1, 2), end: undefined },
    })
    expect(data.get('period')).toBe('')
  })

  it('SSlider range submits each edge', async () => {
    const { data } = await submit(SSlider, { name: 'price', modelValue: [20, 60] })
    expect([data.get('price[0]'), data.get('price[1]')]).toEqual(['20', '60'])
  })

  it('multiple SSelect submits every selected value', async () => {
    const { form } = await submit(SSelect, {
      name: 'tags',
      modelValue: ['one', 'two'],
      options,
      multiple: true,
    })
    expect(new FormData(form).getAll('tags')).toEqual(['one', 'two'])
  })

  it("SInput use-tags submits every tag from Reka's hidden inputs", async () => {
    const { form, data } = await submit(SInput, {
      name: 'tags',
      useTags: true,
      modelValue: ['a', 'b'],
    })
    expect([data.get('tags[0]'), data.get('tags[1]')]).toEqual(['a', 'b'])
    expect(form.querySelector('.s-input__tags-field')).not.toHaveAttribute('name')
  })

  it('SInput use-tags: required passes with tags and fails without them', async () => {
    const filled = await submit(SInput, {
      name: 'tags',
      useTags: true,
      required: true,
      modelValue: ['a'],
    })
    expect(filled.form.checkValidity()).toBe(true)
    expect(filled.form.querySelector('.s-input__tags-field')).toHaveAttribute(
      'aria-required',
      'true',
    )
    const empty = await submit(SInput, { name: 'tags', useTags: true, required: true })
    expect(empty.form.checkValidity()).toBe(false)
  })
})
