import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SSeparator } from '../index'

describe('SSeparator · a11y', () => {
  it('has no violations (basic)', async () => {
    const { container } = render(SSeparator)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations (with a label)', async () => {
    const { container } = render(SSeparator, { props: { label: 'or' } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('a label passed through the slot names the separator', () => {
    const { getByRole } = render(SSeparator, { slots: { default: 'or continue with' } })
    expect(getByRole('separator')).toHaveAccessibleName('or continue with')
  })

  it('a decorative labeled separator has no separator role', () => {
    const { queryByRole, getByText } = render(SSeparator, {
      props: { decorative: true },
      slots: { default: 'or' },
    })
    expect(queryByRole('separator')).toBeNull()
    expect(getByText('or')).toBeInTheDocument()
  })
})
