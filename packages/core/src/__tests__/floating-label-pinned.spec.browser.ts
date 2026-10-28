import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { SDateField, SInput, SSelect } from '../components'

const labelCenterOffset = (container: Element, frameSelector: string) => {
  const frame = container.querySelector(frameSelector)!.getBoundingClientRect()
  const label = container.querySelector(`${frameSelector} > label`)!.getBoundingClientRect()
  return Math.abs(label.top + label.height / 2 - frame.top)
}

// Label position and placeholder color are computed styles that happy-dom does not provide.
describe('floating-label="pinned" · browser', () => {
  it('SInput: the label sits on the frame of an empty field, the placeholder is visible', () => {
    const { container } = render(SInput, {
      props: { label: 'City', placeholder: 'London', floatingLabel: 'pinned' },
    })
    expect(labelCenterOffset(container, '.s-input__wrap')).toBeLessThanOrEqual(1.5)
    const field = container.querySelector('.s-input__field')!
    expect(getComputedStyle(field, '::placeholder').color).not.toBe('rgba(0, 0, 0, 0)')
  })

  it('SInput: a regular floating label rests inside an empty field and hides the placeholder', () => {
    const { container } = render(SInput, {
      props: { label: 'City', placeholder: 'London', floatingLabel: true },
    })
    expect(labelCenterOffset(container, '.s-input__wrap')).toBeGreaterThan(5)
    const field = container.querySelector('.s-input__field')!
    expect(getComputedStyle(field, '::placeholder').color).toBe('rgba(0, 0, 0, 0)')
  })

  it('SSelect: the placeholder of an empty list is visible with a pinned label', () => {
    const { container } = render(SSelect, {
      props: {
        label: 'City',
        placeholder: 'Choose a city',
        floatingLabel: 'pinned',
        options: [{ value: 'ldn', label: 'London' }],
      },
    })
    expect(labelCenterOffset(container, '.s-select__control')).toBeLessThanOrEqual(1.5)
    const trigger = container.querySelector('.s-select__trigger')!
    expect(trigger).toHaveTextContent('Choose a city')
    // The placeholder is dimmed instead of looking like a selected value.
    expect(getComputedStyle(trigger).color).not.toBe(
      getComputedStyle(container.querySelector('.s-select__control')!).color,
    )
  })

  it('SDateField: placeholder segments are visible with a pinned label', () => {
    const { container } = render(SDateField, {
      props: { label: 'Date', floatingLabel: 'pinned' },
    })
    expect(labelCenterOffset(container, '.s-date-field__wrap')).toBeLessThanOrEqual(1.5)
    const segment = container.querySelector('.s-date-field__segment')!
    expect(getComputedStyle(segment).color).not.toBe('rgba(0, 0, 0, 0)')
  })
})
