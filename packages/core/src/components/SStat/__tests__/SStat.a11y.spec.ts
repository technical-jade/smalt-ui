import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SStat } from '../index'

const base = { label: 'Revenue', value: 1234567 }

describe('SStat · a11y', () => {
  it('has no violations as a plain tile', async () => {
    const { container } = render(SStat, {
      props: { ...base, icon: 'credit-card', description: 'Last 30 days' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations in the card variant with actions', async () => {
    const { container } = render(SStat, {
      props: { ...base, variant: 'card' },
      slots: { actions: '<button type="button">Report</button>' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with a trend in both directions', async () => {
    for (const trend of [12.4, -3, 0]) {
      const { container } = render(SStat, {
        props: { ...base, trend, trendLabel: 'vs last month' },
      })
      expect(await axe(container)).toHaveNoViolations()
    }
  })

  it('has no violations while loading', async () => {
    const { container } = render(SStat, { props: { ...base, loading: true } })
    expect(await axe(container)).toHaveNoViolations()
  })
})
