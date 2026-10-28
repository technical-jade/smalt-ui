import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SNumberField } from '../index'

// The floating label is placed by absolute positioning and a transform, which happy-dom ignores.
describe('SNumberField · browser', () => {
  it('the floating label sits on the top edge of the frame, before the first step button', () => {
    render(SNumberField, { props: { modelValue: 5, label: 'Quantity', floatingLabel: true } })
    const control = document.querySelector('.s-number-field__control')!.getBoundingClientRect()
    const label = document.querySelector('.s-number-field__label')!.getBoundingClientRect()
    const decrement = screen.getByRole('button', { name: 'Decrease' }).getBoundingClientRect()
    expect(Math.abs(label.top + label.height / 2 - control.top)).toBeLessThanOrEqual(1)
    expect(label.left).toBeGreaterThan(control.left)
    expect(label.left).toBeLessThan(decrement.right)
  })
})
