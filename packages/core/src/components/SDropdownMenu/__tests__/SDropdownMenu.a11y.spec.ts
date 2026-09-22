import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SDropdownMenu } from '../index'

const triggerBtn = '<button type="button">Menu</button>'

describe('SDropdownMenu · a11y', () => {
  it('has no violations (closed)', async () => {
    const { container } = render(SDropdownMenu, {
      props: { items: [{ label: 'Profile', value: 'p' }] },
      slots: { trigger: triggerBtn },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations (open)', async () => {
    render(SDropdownMenu, {
      props: {
        open: true,
        ariaLabel: 'User menu',
        items: [
          { type: 'label', label: 'Account' },
          { label: 'Profile', value: 'profile' },
          { type: 'separator' },
          { label: 'Log out', value: 'logout', danger: true },
        ],
      },
      slots: { trigger: triggerBtn },
    })
    await screen.findByRole('menuitem', { name: 'Profile' })
    /**
     * The menu is modal: Reka hides the background (aria-hidden) and adds focus guards,
     * so check the subtree of the menu panel itself, not the whole body.
     */
    const menu = await screen.findByRole('menu')
    expect(await axe(menu)).toHaveNoViolations()
  })

  it('ariaLabel names the menu instead of the trigger', async () => {
    render(SDropdownMenu, {
      props: { open: true, ariaLabel: 'User menu', items: [{ label: 'Profile', value: 'p' }] },
      slots: { trigger: triggerBtn },
    })
    const menu = await screen.findByRole('menu')
    expect(menu).not.toHaveAttribute('aria-labelledby')
    expect(menu).toHaveAccessibleName('User menu')
  })

  it('ariaLabel still names the menu after it reopens', async () => {
    const props = { ariaLabel: 'User menu', items: [{ label: 'Profile', value: 'p' }] }
    const { rerender } = render(SDropdownMenu, {
      props: { ...props, open: true },
      slots: { trigger: triggerBtn },
    })
    await screen.findByRole('menu')
    await rerender({ ...props, open: false })
    await rerender({ ...props, open: true })
    expect(await screen.findByRole('menu')).toHaveAccessibleName('User menu')
  })

  it('without ariaLabel the menu is still named by its trigger', async () => {
    render(SDropdownMenu, {
      props: { open: true, items: [{ label: 'Profile', value: 'p' }] },
      slots: { trigger: triggerBtn },
    })
    expect(await screen.findByRole('menu')).toHaveAccessibleName('Menu')
  })
})
