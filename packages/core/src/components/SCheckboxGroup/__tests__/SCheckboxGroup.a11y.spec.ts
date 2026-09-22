import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SCheckboxGroup } from '../index'

const options = [
  { label: 'Courier', value: 'courier' },
  { label: 'Pickup', value: 'pickup', hint: 'Ready in an hour' },
]

describe('SCheckboxGroup · a11y', () => {
  it('has no violations with an aria-label', async () => {
    const { container } = render(SCheckboxGroup, {
      props: { ariaLabel: 'Delivery options', options },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with a title, a hint and an error', async () => {
    const { container } = render(SCheckboxGroup, {
      props: {
        label: 'Delivery options',
        hint: 'Choose any',
        error: 'Pick at least one',
        required: true,
        options,
      },
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
