import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SPopover } from '../index'

const triggerBtn = '<button type="button">Menu</button>'

describe('SPopover · a11y', () => {
  it('has no violations (closed)', async () => {
    const { container } = render(SPopover, { slots: { trigger: triggerBtn } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations (open)', async () => {
    render(SPopover, {
      props: { open: true, ariaLabel: 'Quick actions' },
      slots: { trigger: triggerBtn, default: 'Panel content' },
    })
    await screen.findByText('Panel content')
    expect(await axe(document.body)).toHaveNoViolations()
  })

  it('ariaLabel names the panel instead of the trigger', async () => {
    render(SPopover, {
      props: { open: true, ariaLabel: 'Quick actions' },
      slots: { trigger: '<button type="button">Open</button>', default: 'Body' },
    })
    const panel = await screen.findByRole('dialog')
    expect(panel).not.toHaveAttribute('aria-labelledby')
    expect(panel).toHaveAccessibleName('Quick actions')
  })

  it('ariaLabel still names the panel after it reopens', async () => {
    const { rerender } = render(SPopover, {
      props: { open: true, ariaLabel: 'Quick actions' },
      slots: { trigger: '<button type="button">Open</button>', default: 'Body' },
    })
    await screen.findByRole('dialog')
    await rerender({ open: false, ariaLabel: 'Quick actions' })
    await rerender({ open: true, ariaLabel: 'Quick actions' })
    expect(await screen.findByRole('dialog')).toHaveAccessibleName('Quick actions')
  })

  it('without ariaLabel the panel is still named by its trigger', async () => {
    render(SPopover, {
      props: { open: true },
      slots: { trigger: '<button type="button">Filters</button>', default: 'Body' },
    })
    expect(await screen.findByRole('dialog')).toHaveAccessibleName('Filters')
  })
})
