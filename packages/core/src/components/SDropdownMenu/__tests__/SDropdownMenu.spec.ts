import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SDropdownMenu } from '../index'

const triggerBtn = '<button type="button">Menu</button>'
const items = [
  { type: 'label' as const, label: 'Account' },
  { label: 'Profile', value: 'profile' },
  { label: 'Settings', value: 'settings' },
  { type: 'separator' as const },
  { label: 'Log out', value: 'logout', danger: true },
]

describe('SDropdownMenu', () => {
  it('renders the trigger with the menu closed by default', () => {
    render(SDropdownMenu, { props: { items }, slots: { trigger: triggerBtn } })
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: 'Profile' })).toBeNull()
  })

  it('opens the menu and shows the items', async () => {
    render(SDropdownMenu, { props: { items }, slots: { trigger: triggerBtn } })
    await fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
    expect(await screen.findByRole('menuitem', { name: 'Profile' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Log out' })).toBeInTheDocument()
  })

  it('emits select with the selected item value', async () => {
    const { emitted } = render(SDropdownMenu, {
      props: { items },
      slots: { trigger: triggerBtn },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
    const item = await screen.findByRole('menuitem', { name: 'Settings' })
    await fireEvent.click(item)
    expect(emitted().select[0]).toEqual(['settings'])
  })

  it('renders the item icon by its registry name', async () => {
    const iconItems = [{ label: 'Favorites', value: 'fav', icon: 'star' }]
    render(SDropdownMenu, { props: { items: iconItems }, slots: { trigger: triggerBtn } })
    await fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
    await screen.findByRole('menuitem', { name: 'Favorites' })
    const path = document.querySelector('.s-dropdown-menu__icon path')
    expect(path).not.toBeNull()
    expect(path?.getAttribute('d')).toBeTruthy()
  })

  it('class and data attributes from the component land on the menu', async () => {
    render(SDropdownMenu, {
      props: { items, open: true },
      attrs: { class: 'account-menu', 'data-testid': 'account' },
      slots: { trigger: triggerBtn },
    })
    const menu = await screen.findByRole('menu')
    expect(menu).toHaveClass('s-dropdown-menu__content', 'account-menu')
    expect(menu).toHaveAttribute('data-testid', 'account')
  })
})
