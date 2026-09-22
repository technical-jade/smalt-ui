import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import type { Component } from 'vue'
import { SAutocomplete, SColorField, SInput, SNumberField, SSelect, STextarea } from '../index'

const options = [{ label: 'One', value: 'one' }]

/**
 * Consumer attributes land on the control and override its own attributes, except the
 * bindings built by SFormField: those keep the field linked to its label, hint and error.
 */
describe('field attribute merge', () => {
  it.each<[string, Component, Record<string, unknown>, string]>([
    ['SInput', SInput, {}, 'input'],
    ['SInput use-tags', SInput, { useTags: true }, '.s-input__tags-field'],
    ['STextarea', STextarea, {}, 'textarea'],
    ['SAutocomplete', SAutocomplete, { options }, 'input'],
    ['SSelect', SSelect, { options }, '.s-select__trigger'],
    ['SSelect searchable', SSelect, { options, searchable: true }, 'input'],
    ['SNumberField', SNumberField, {}, 'input'],
    ['SColorField', SColorField, {}, 'input'],
  ])('%s keeps the field bindings', (_, component, props, selector) => {
    const { container } = render(component, {
      props: { label: 'Field', hint: 'Hint', invalid: true, ...props },
      attrs: {
        'aria-describedby': 'foreign-hint',
        'aria-invalid': 'false',
        'data-testid': 'control',
      },
    })
    const control = container.querySelector(selector)!
    expect(control).toHaveAttribute('data-testid', 'control')
    const hint = container.querySelector('.s-field__hint')!
    expect(control.getAttribute('aria-describedby')).toContain(hint.id)
    expect(control).toHaveAttribute('aria-invalid', 'true')
  })

  it('SInput: the consumer overrides the own inputmode', () => {
    const { container } = render(SInput, {
      props: { numeric: true },
      attrs: { inputmode: 'numeric' },
    })
    expect(container.querySelector('input')).toHaveAttribute('inputmode', 'numeric')
  })
})
