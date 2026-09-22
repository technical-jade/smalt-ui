import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SSwitch } from '../index'

describe('SSwitch · a11y', () => {
  it('has no violations with a label', async () => {
    const { container } = render(SSwitch, { props: { label: 'Receive notifications' } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations when disabled', async () => {
    const { container } = render(SSwitch, {
      props: { label: 'Receive notifications', disabled: true },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations without a visible label when ariaLabel is set', async () => {
    const { container } = render(SSwitch, { props: { ariaLabel: 'Wi-Fi' } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations when required', async () => {
    const { container } = render(SSwitch, {
      props: { label: 'Receive notifications', required: true },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with a hint and with an error', async () => {
    const { container } = render(SSwitch, {
      props: { label: 'Receive notifications', hint: 'Sent daily' },
    })
    expect(await axe(container)).toHaveNoViolations()
    const { container: invalid } = render(SSwitch, {
      props: { label: 'Accept the terms', error: 'Accept the terms to continue' },
    })
    expect(await axe(invalid)).toHaveNoViolations()
  })
})
