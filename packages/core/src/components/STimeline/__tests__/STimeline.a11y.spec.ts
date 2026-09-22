import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { STimeline } from '../index'

const items = [
  { value: 'created', title: 'Order created', description: 'Paid by card', date: 'Mar 3' },
  { value: 'packed', title: 'Packed', date: 'Mar 4' },
  { value: 'shipped', title: 'Shipped', icon: 'package', date: 'Mar 5' },
]

describe('STimeline · a11y', () => {
  it('has no violations as a plain feed', async () => {
    const { container } = render(STimeline, { props: { items } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with a current item', async () => {
    const { container } = render(STimeline, {
      props: { items, modelValue: 'packed', orientation: 'horizontal' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
