import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SSlider } from '../index'

describe('SSlider · a11y', () => {
  it('has no violations (single)', async () => {
    const { container } = render(SSlider, {
      props: { modelValue: 40, label: 'Volume', hint: 'From 0 to 100' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations (range, invalid)', async () => {
    const { container } = render(SSlider, {
      props: { modelValue: [20, 70], label: 'Price', error: 'Choose a range' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations without a visible label when ariaLabel is set', async () => {
    const { container } = render(SSlider, { props: { modelValue: 40, ariaLabel: 'Volume' } })
    expect(await axe(container)).toHaveNoViolations()
  })
})
