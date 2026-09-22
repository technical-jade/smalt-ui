import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import type { Component } from 'vue'
import { SColorField, SDatePicker, SInput, SNumberField } from '../index'

/** The computed value of a color token, read the same way as the field border. */
function tokenColor(token: string): string {
  const probe = document.createElement('div')
  probe.style.color = `var(${token})`
  document.body.append(probe)
  const color = getComputedStyle(probe).color
  probe.remove()
  return color
}

// The error text alone is easy to miss: an invalid field also turns its frame red.
describe('invalid field frame', () => {
  it.each<[string, Component, string]>([
    ['SInput', SInput, '.s-input__wrap'],
    ['SNumberField', SNumberField, '.s-number-field__control'],
    ['SColorField', SColorField, '.s-color-field__control'],
    ['SDatePicker', SDatePicker, '.s-date-picker__control'],
  ])('%s', (_, component, selector) => {
    const negative = tokenColor('--s-color-negative')
    const frame = (props: Record<string, unknown>) => {
      const { container, unmount } = render(component, { props: { label: 'Field', ...props } })
      const color = getComputedStyle(container.querySelector(selector)!).borderTopColor
      unmount()
      return color
    }
    expect(frame({})).not.toBe(negative)
    expect(frame({ invalid: true })).toBe(negative)
    expect(frame({ error: 'Required' })).toBe(negative)
  })
})
