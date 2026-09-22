import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SEmptyState } from '../index'

describe('SEmptyState', () => {
  it('falls back to the dictionary title', () => {
    render(SEmptyState)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('renders the title and description props', () => {
    render(SEmptyState, {
      props: { title: 'No invoices yet', description: 'Create the first one to get started.' },
    })
    expect(screen.getByText('No invoices yet')).toBeInTheDocument()
    expect(screen.getByText('Create the first one to get started.')).toBeInTheDocument()
  })

  it('renders the icon through SIcon', () => {
    const { container } = render(SEmptyState, { props: { icon: 'search' } })
    expect(container.querySelector('.s-empty-state__media svg')).toBeInTheDocument()
    expect(container.querySelector('.s-empty-state__image')).toBeNull()
  })

  it('renders the image instead of the icon', () => {
    const { container } = render(SEmptyState, {
      props: { icon: 'search', image: '/illustration.svg' },
    })
    const image = container.querySelector('.s-empty-state__image')
    expect(image).toHaveAttribute('src', '/illustration.svg')
    expect(container.querySelector('.s-empty-state__media svg')).toBeNull()
  })

  it('the icon slot replaces the icon and the image', () => {
    const { container } = render(SEmptyState, {
      props: { icon: 'search', image: '/illustration.svg' },
      slots: { icon: '<span class="custom-media">media</span>' },
    })
    expect(container.querySelector('.custom-media')).toBeInTheDocument()
    expect(container.querySelector('.s-empty-state__image')).toBeNull()
  })

  it('has no media block without an icon, an image or the slot', () => {
    const { container } = render(SEmptyState)
    expect(container.querySelector('.s-empty-state__media')).toBeNull()
  })

  it('renders the title, description, default and actions slots', () => {
    const { container } = render(SEmptyState, {
      slots: {
        title: 'Nothing found',
        description: 'Try another query.',
        default: '<span class="extra">extra</span>',
        actions: '<button type="button">Reset</button>',
      },
    })
    expect(screen.getByText('Nothing found')).toBeInTheDocument()
    expect(screen.getByText('Try another query.')).toBeInTheDocument()
    expect(container.querySelector('.extra')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('applies the size class', () => {
    const { container } = render(SEmptyState, { props: { size: 'lg' } })
    expect(container.querySelector('.s-empty-state')).toHaveClass('s-empty-state--lg')
  })

  it('is medium by default', () => {
    const { container } = render(SEmptyState)
    expect(container.querySelector('.s-empty-state')).toHaveClass('s-empty-state--md')
  })

  it('exposes the accent color as an inline variable', () => {
    const { container } = render(SEmptyState, { props: { icon: 'search', color: 'teal' } })
    expect(container.querySelector<HTMLElement>('.s-empty-state')?.style.cssText).toContain(
      '--s-empty-state-c: var(--s-teal)',
    )
  })
})
