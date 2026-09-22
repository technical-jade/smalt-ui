import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SEmptyState } from '../index'

describe('SEmptyState · a11y', () => {
  it('has no violations with an icon, a description and actions', async () => {
    const { container } = render(SEmptyState, {
      props: {
        icon: 'search',
        title: 'Nothing found',
        description: 'Try another query.',
      },
      slots: { actions: '<button type="button">Reset filters</button>' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with a decorative image', async () => {
    const { container } = render(SEmptyState, {
      props: { image: '/illustration.svg', title: 'No invoices yet' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
