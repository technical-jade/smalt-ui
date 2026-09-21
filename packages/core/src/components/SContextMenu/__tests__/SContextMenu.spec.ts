import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SContextMenu } from '../index'

const area = '<div>area</div>'
const items = [
  { label: 'Copy', value: 'copy' },
  { label: 'Paste', value: 'paste' },
  { type: 'separator' as const },
  { label: 'Delete', value: 'delete', danger: true },
]

describe('SContextMenu', () => {
  it('renders the trigger area with the menu closed', () => {
    render(SContextMenu, { props: { items }, slots: { default: area } })
    expect(screen.getByText('area')).toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: 'Copy' })).toBeNull()
  })

  it('opens the menu on right-click', async () => {
    render(SContextMenu, { props: { items }, slots: { default: area } })
    await fireEvent.contextMenu(screen.getByText('area'))
    expect(await screen.findByRole('menuitem', { name: 'Copy' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument()
  })

  it('emits select with the item value', async () => {
    const { emitted } = render(SContextMenu, { props: { items }, slots: { default: area } })
    await fireEvent.contextMenu(screen.getByText('area'))
    const item = await screen.findByRole('menuitem', { name: 'Paste' })
    await fireEvent.click(item)
    expect(emitted().select[0]).toEqual(['paste'])
  })

  it('renders the item icon by its registry name', async () => {
    const iconItems = [{ label: 'Favorites', value: 'fav', icon: 'star' }]
    render(SContextMenu, { props: { items: iconItems }, slots: { default: area } })
    await fireEvent.contextMenu(screen.getByText('area'))
    await screen.findByRole('menuitem', { name: 'Favorites' })
    const path = document.querySelector('.s-context-menu__icon path')
    expect(path).not.toBeNull()
    expect(path?.getAttribute('d')).toBeTruthy()
  })

  it('class and data attributes from the component land on the menu', async () => {
    render(SContextMenu, {
      props: { items },
      attrs: { class: 'file-menu', 'data-testid': 'file' },
      slots: { default: area },
    })
    await fireEvent.contextMenu(screen.getByText('area'))
    const menu = await screen.findByRole('menu')
    expect(menu).toHaveClass('s-context-menu__content', 'file-menu')
    expect(menu).toHaveAttribute('data-testid', 'file')
  })
})
