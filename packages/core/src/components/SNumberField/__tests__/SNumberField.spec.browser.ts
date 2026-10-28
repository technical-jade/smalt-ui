import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SNumberField } from '../index'

const renderIn = (props: Record<string, unknown>) =>
  render({
    components: { SNumberField },
    setup: () => ({ props }),
    template: `<div style="width: 400px"><SNumberField v-bind="props" label="Weight" /></div>`,
  })

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

  it('without stretch the field is as wide as its content', () => {
    const { container } = renderIn({})
    const control = container.querySelector('.s-number-field__control')!
    expect(control.getBoundingClientRect().width).toBeLessThan(200)
  })

  it('stretch spreads the frame across the container', () => {
    const { container } = renderIn({ stretch: true })
    const control = container.querySelector('.s-number-field__control')!
    expect(control.getBoundingClientRect().width).toBe(400)
  })

  it('stretch also fills a narrow column instead of keeping the input width', () => {
    const { container } = render({
      components: { SNumberField },
      template: `<div style="width: 120px"><SNumberField stretch label="Weight" /></div>`,
    })
    const control = container.querySelector('.s-number-field__control')!
    expect(control.getBoundingClientRect().width).toBe(120)
  })
})
