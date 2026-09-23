import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SPage } from '../index'

describe('SPage · a11y', () => {
  it('has no violations as the main landmark', async () => {
    const { container } = render(SPage, { slots: { default: 'Reports' } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations inside a container', async () => {
    const { container } = render(SPage, {
      props: { container: true, maxWidth: '60rem' },
      slots: { default: 'Reports' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
