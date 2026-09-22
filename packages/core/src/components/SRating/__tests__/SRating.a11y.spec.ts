import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SRating } from '../index'

describe('SRating · a11y', () => {
  it('has no violations', async () => {
    const { container } = render(SRating, {
      props: { modelValue: 3, length: 5, ariaLabel: 'Product rating' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations when readonly', async () => {
    const { container } = render(SRating, {
      props: { modelValue: 4, length: 5, readonly: true, ariaLabel: 'Average rating' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations when disabled', async () => {
    const { container } = render(SRating, {
      props: { modelValue: 3, length: 5, disabled: true, ariaLabel: 'Product rating' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with an error', async () => {
    const { container } = render(SRating, {
      props: { length: 5, ariaLabel: 'Product rating', error: 'Rate the product' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
