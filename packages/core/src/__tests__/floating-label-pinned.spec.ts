import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import type { Component } from 'vue'
import {
  SAutocomplete,
  SColorField,
  SDateField,
  SDatePicker,
  SDateRangePicker,
  SInput,
  SSelect,
  STextarea,
  STimeField,
  STimePicker,
} from '../components'

const fields: [string, Component, Record<string, unknown>][] = [
  ['SInput', SInput, {}],
  ['STextarea', STextarea, {}],
  ['SSelect', SSelect, { options: [{ value: 'a', label: 'A' }] }],
  ['SSelect searchable', SSelect, { options: [{ value: 'a', label: 'A' }], searchable: true }],
  ['SAutocomplete', SAutocomplete, { options: [] }],
  ['SColorField', SColorField, {}],
  ['SDateField', SDateField, {}],
  ['STimeField', STimeField, {}],
  ['SDatePicker', SDatePicker, {}],
  ['SDateRangePicker', SDateRangePicker, {}],
  ['STimePicker', STimePicker, {}],
]

describe('floating-label="pinned"', () => {
  for (const [name, component, props] of fields) {
    it(`${name}: pins the label to the frame of an empty field`, () => {
      const { container } = render(component, {
        props: { ...props, label: 'Label', floatingLabel: 'pinned' },
      })
      const frame = container.querySelector('[data-label-pinned]')
      expect(frame).not.toBeNull()
      expect(frame!.querySelector(':scope > label')).toHaveTextContent('Label')
      expect(frame).not.toHaveAttribute('data-filled')
    })

    it(`${name}: a regular floating label is not pinned`, () => {
      const { container } = render(component, {
        props: { ...props, label: 'Label', floatingLabel: true },
      })
      expect(container.querySelector('[data-label-pinned]')).toBeNull()
    })
  }

  it('the attribute without a value still turns on a regular floating label', () => {
    const { container } = render({
      components: { SInput },
      template: '<SInput label="Label" floating-label />',
    })
    expect(container.querySelector('.s-input__wrap--floating')).not.toBeNull()
    expect(container.querySelector('[data-label-pinned]')).toBeNull()
  })
})
