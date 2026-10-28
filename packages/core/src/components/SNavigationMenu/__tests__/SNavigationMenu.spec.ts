import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SNavigationMenu } from '../index'
import { createSUI } from '../../../plugin'
import { compact } from '../../../presets'

const items = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: 'https://example.com/blog', target: '_blank', rel: 'noopener' },
  {
    label: 'Products',
    links: [
      { label: 'Analytics', href: '/analytics', description: 'Reports and dashboards' },
      { label: 'CRM', href: '/crm', target: '_blank', rel: 'noopener' },
    ],
  },
]

describe('SNavigationMenu', () => {
  it('renders navigation with direct links and triggers', () => {
    render(SNavigationMenu, { props: { items, ariaLabel: 'Main' } })
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('button', { name: /Products/ })).toBeInTheDocument()
  })

  it('passes target and rel to a direct link and to a panel link', async () => {
    render(SNavigationMenu, { props: { items } })
    const blog = screen.getByRole('link', { name: 'Blog' })
    expect(blog).toHaveAttribute('target', '_blank')
    expect(blog).toHaveAttribute('rel', 'noopener')

    await fireEvent.click(screen.getByRole('button', { name: /Products/ }))
    const crm = await screen.findByRole('link', { name: 'CRM' })
    expect(crm).toHaveAttribute('target', '_blank')
    expect(crm).toHaveAttribute('rel', 'noopener')
  })

  it('size and columns land on the root', () => {
    render(SNavigationMenu, { props: { items, ariaLabel: 'Main', size: 'sm', columns: 1 } })
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(nav).toHaveClass('s-navigation-menu--sm')
    expect(nav.style.getPropertyValue('--s-navigation-menu-columns')).toBe('1')
  })

  it('a density preset sets the size', () => {
    render(SNavigationMenu, {
      props: { items, ariaLabel: 'Main' },
      global: { plugins: [createSUI({ preset: compact })] },
    })
    expect(screen.getByRole('navigation', { name: 'Main' })).toHaveClass('s-navigation-menu--sm')
  })

  it('opens a panel with nested links', async () => {
    render(SNavigationMenu, { props: { items } })
    await fireEvent.click(screen.getByRole('button', { name: /Products/ }))
    expect(await screen.findByRole('link', { name: /Analytics/ })).toHaveAttribute(
      'href',
      '/analytics',
    )
  })
})
