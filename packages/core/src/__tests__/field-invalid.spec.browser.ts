import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import type { Component } from 'vue'
import {
  SCheckbox,
  SColorField,
  SDatePicker,
  SInput,
  SNumberField,
  SRadioGroup,
  SRating,
  SSwitch,
} from '../index'

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

// Controls without a frame mark the invalid state on the part that is always visible.
describe('invalid control without a frame', () => {
  it.each<[string, Component, string, 'borderTopColor' | 'color']>([
    ['SSwitch', SSwitch, '.s-switch__track', 'borderTopColor'],
    ['SSwitch on', SSwitch, '.s-switch__track', 'borderTopColor'],
    ['SRating', SRating, '.s-rating__star--bg', 'color'],
    ['SCheckbox', SCheckbox, '.s-checkbox__box', 'borderTopColor'],
    ['SCheckbox on', SCheckbox, '.s-checkbox__box', 'borderTopColor'],
    ['SRadioGroup', SRadioGroup, '.s-radio__control', 'borderTopColor'],
    ['SRadioGroup on', SRadioGroup, '.s-radio__control', 'borderTopColor'],
  ])('%s', (name, component, selector, property) => {
    const negative = tokenColor('--s-color-negative')
    const extra = {
      'SSwitch on': { modelValue: true },
      'SCheckbox on': { modelValue: true },
      SRadioGroup: { options: [{ label: 'A', value: 'a' }] },
      'SRadioGroup on': { options: [{ label: 'A', value: 'a' }], modelValue: 'a' },
    }[name]
    const paint = (props: Record<string, unknown>) => {
      const { container, unmount } = render(component, {
        props: { ariaLabel: 'Field', ...extra, ...props },
      })
      const value = getComputedStyle(container.querySelector(selector)!)[property]
      unmount()
      return value
    }
    expect(paint({})).not.toBe(negative)
    expect(paint({ invalid: true })).toBe(negative)
    expect(paint({ error: 'Required' })).toBe(negative)
  })
})
