import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SCheckbox } from '../index'

describe('SCheckbox · a11y', () => {
  it('has no violations with a label', async () => {
    const { container } = render(SCheckbox, { props: { label: 'I agree to the terms' } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations when disabled', async () => {
    const { container } = render(SCheckbox, {
      props: { label: 'I agree to the terms', disabled: true },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations when indeterminate', async () => {
    const { container } = render(SCheckbox, {
      props: { label: 'Select all', modelValue: 'indeterminate' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations without a visible label when ariaLabel is set', async () => {
    const { container } = render(SCheckbox, { props: { ariaLabel: 'Select row' } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations when required', async () => {
    const { container } = render(SCheckbox, {
      props: { label: 'I agree to the terms', required: true },
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
