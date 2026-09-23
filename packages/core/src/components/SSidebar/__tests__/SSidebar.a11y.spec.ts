import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SSidebar } from '../index'

describe('SSidebar · a11y', () => {
  it('has no violations as an expanded column', async () => {
    const { container } = render(SSidebar, {
      props: { breakpoint: 'sm', ariaLabel: 'Main' },
      slots: { header: 'Acme', default: 'Reports', footer: 'Sign out' },
    })
    await nextTick()

    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations as a collapsed rail', async () => {
    const { container } = render(SSidebar, {
      props: { breakpoint: 'sm', ariaLabel: 'Main', collapsed: true },
      slots: { default: 'Reports' },
    })
    await nextTick()

    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations inside the drawer', async () => {
    render(SSidebar, {
      props: { breakpoint: 'xl', ariaLabel: 'Main', open: true },
      slots: { default: 'Reports' },
    })
    await nextTick()

    // The dialog subtree, not the body: an open Reka overlay adds focus guards that trip the
    // `aria-hidden-focus` rule.
    expect(await axe(await screen.findByRole('dialog'))).toHaveNoViolations()
  })
})
