import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SBreadcrumb } from '../index'

const items = [
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/catalog' },
  { label: 'Smartphones' },
]

describe('SBreadcrumb', () => {
  it('renders nav with an accessible name', () => {
    render(SBreadcrumb, { props: { items } })
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
  })

  it('intermediate crumbs are links, the last one is the current page', () => {
    render(SBreadcrumb, { props: { items } })
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute('href', '/catalog')
    const current = screen.getByText('Smartphones')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: 'Smartphones' })).toBeNull()
  })

  it('supports a custom aria-label', () => {
    render(SBreadcrumb, { props: { items, ariaLabel: 'Path' } })
    expect(screen.getByRole('navigation', { name: 'Path' })).toBeInTheDocument()
  })

  it('renders the item leading icon from item.icon', () => {
    render(SBreadcrumb, {
      props: {
        items: [{ label: 'Home', href: '/', icon: 'star' }, { label: 'Current' }],
      },
    })
    const link = screen.getByRole('link', { name: /Home/ })
    expect(link.querySelector('.s-icon')).not.toBeNull()
  })

  it('a last item with href stays a link and is not marked current', () => {
    render(SBreadcrumb, {
      props: {
        items: [
          { label: 'Home', href: '/' },
          { label: 'Orders', href: '/orders' },
        ],
      },
    })
    const last = screen.getByRole('link', { name: 'Orders' })
    expect(last).toHaveAttribute('href', '/orders')
    expect(last).not.toHaveAttribute('aria-current')
  })

  it('current marks one item, which keeps its link', () => {
    render(SBreadcrumb, {
      props: {
        items: [
          { label: 'Home', href: '/' },
          { label: 'Orders', href: '/orders', current: true },
          { label: 'Filters' },
        ],
      },
    })
    expect(screen.getByRole('link', { name: 'Orders' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Filters')).not.toHaveAttribute('aria-current')
  })
})
