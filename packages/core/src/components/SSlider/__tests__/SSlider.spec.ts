import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SSlider } from '../index'

/**
 * In happy-dom, Reka thumbs without layout get display: none (and do not compute
 * aria-valuenow/name), so they are queried with { hidden: true } and attributes are checked
 * directly.
 */
describe('SSlider', () => {
  it('range edges are labeled separately', () => {
    const { container } = render(SSlider, {
      props: { modelValue: [20, 60], label: 'Price', min: 0, max: 100 },
    })
    const labels = [...container.querySelectorAll('.s-slider__thumb')].map((t) =>
      t.getAttribute('aria-label'),
    )
    expect(labels).toEqual(['Price: start', 'Price: end'])
  })

  it('renders the thumb with a label and bounds', () => {
    render(SSlider, { props: { modelValue: 40, label: 'Volume' } })
    const slider = screen.getByRole('slider', { hidden: true })
    expect(slider).toHaveAttribute('aria-label', 'Volume')
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '100')
  })

  it('links the label to the thumb via id', () => {
    const { container } = render(SSlider, { props: { modelValue: 20, label: 'Brightness' } })
    const label = container.querySelector('.s-field__label') as HTMLLabelElement
    const slider = screen.getByRole('slider', { hidden: true })
    expect(label.getAttribute('for')).toBe(slider.id)
  })

  it('a range renders two thumbs', () => {
    render(SSlider, { props: { modelValue: [20, 60], label: 'Price range' } })
    expect(screen.getAllByRole('slider', { hidden: true })).toHaveLength(2)
  })

  it('respects min/max', () => {
    render(SSlider, { props: { modelValue: 5, min: 0, max: 10, label: 'V' } })
    const slider = screen.getByRole('slider', { hidden: true })
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '10')
  })

  it('disabled marks the control', () => {
    const { container } = render(SSlider, { props: { modelValue: 30, disabled: true } })
    expect(container.querySelector('.s-slider__control')).toHaveAttribute('data-disabled')
  })

  it('showValue renders the value bubble', () => {
    const { container } = render(SSlider, { props: { modelValue: 40, showValue: true } })
    const bubble = container.querySelector('.s-slider__value')
    expect(bubble).toBeTruthy()
    // The value does not duplicate aria-valuenow for screen readers.
    expect(bubble).toHaveAttribute('aria-hidden', 'true')
    expect(bubble).toHaveTextContent('40')
    // At rest (no hover/focus/drag) the bubble is hidden.
    expect(bubble).not.toHaveClass('s-slider__value--visible')
  })

  it('there is no bubble without showValue', () => {
    const { container } = render(SSlider, { props: { modelValue: 40 } })
    expect(container.querySelector('.s-slider__value')).toBeNull()
  })

  it('valueAlways stays visible and reserves space above the track', () => {
    const { container } = render(SSlider, {
      props: { modelValue: 40, showValue: true, valueAlways: true },
    })
    expect(container.querySelector('.s-slider__value')).toHaveClass('s-slider__value--visible')
    expect(container.querySelector('.s-slider__control')).toHaveClass(
      's-slider__control--value-always',
    )
  })

  it('the value slot formats the bubble for each thumb', () => {
    const { container } = render(SSlider, {
      props: { modelValue: [20, 60], showValue: true, valueAlways: true },
      slots: {
        value: (scope: { value: number }) => `${scope.value}%`,
      },
    })
    const bubbles = [...container.querySelectorAll('.s-slider__value')]
    expect(bubbles.map((b) => b.textContent)).toEqual(['20%', '60%'])
  })

  it('ariaLabel names the thumb without a visible label', () => {
    const { container } = render(SSlider, { props: { modelValue: 40, ariaLabel: 'Volume' } })
    expect(screen.getByRole('slider', { hidden: true })).toHaveAttribute('aria-label', 'Volume')
    expect(container.querySelector('.s-field')).not.toHaveAttribute('aria-label')
  })

  it('ariaLabel labels range edges separately', () => {
    const { container } = render(SSlider, { props: { modelValue: [20, 60], ariaLabel: 'Price' } })
    const labels = [...container.querySelectorAll('.s-slider__thumb')].map((t) =>
      t.getAttribute('aria-label'),
    )
    expect(labels).toEqual(['Price: start', 'Price: end'])
  })

  it('emits valueCommit with a number for a single thumb', async () => {
    const { emitted } = render(SSlider, { props: { modelValue: 40, label: 'Volume' } })
    await fireEvent.keyDown(screen.getByRole('slider', { hidden: true }), { key: 'ArrowRight' })
    expect(emitted().valueCommit).toEqual([[41]])
  })

  it('emits valueCommit with an array for a range', async () => {
    const { container, emitted } = render(SSlider, {
      props: { modelValue: [20, 60], label: 'Price' },
    })
    await fireEvent.keyDown(container.querySelector('.s-slider__thumb')!, { key: 'ArrowRight' })
    expect(emitted().valueCommit).toEqual([[[21, 60]]])
  })

  it('consumer attributes go to the first thumb, class and style stay on the field', () => {
    const { container } = render(SSlider, {
      props: { modelValue: [20, 60], ariaLabel: 'Price' },
      attrs: { class: 'outer', style: 'margin: 4px', 'data-testid': 'price' },
    })
    const thumbs = container.querySelectorAll('.s-slider__thumb')
    expect(thumbs[0]).toHaveAttribute('data-testid', 'price')
    expect(thumbs[1]).not.toHaveAttribute('data-testid')
    const field = container.querySelector('.s-field')!
    expect(field).toHaveClass('s-slider', 'outer')
    expect(field).toHaveStyle({ margin: '4px' })
    expect(field).not.toHaveAttribute('data-testid')
  })
})
