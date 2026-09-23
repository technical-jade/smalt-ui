import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SBanner } from '../index'

describe('SBanner', () => {
  it('renders the title and the message in a live region', () => {
    render(SBanner, { props: { title: 'Maintenance' }, slots: { default: 'We are back at 9am' } })
    // Everything but `negative` is announced politely (role=status).
    const banner = screen.getByRole('status')
    expect(banner).toHaveTextContent('Maintenance')
    expect(banner).toHaveTextContent('We are back at 9am')
  })

  it('announces negative with the alert role', () => {
    render(SBanner, { props: { variant: 'negative' }, slots: { default: 'You are offline' } })
    expect(screen.getByRole('alert')).toHaveTextContent('You are offline')
  })

  it('announcement urgency follows the variant', async () => {
    const { container, rerender } = render(SBanner, {
      props: { variant: 'info' },
      slots: { default: () => 'Text' },
    })
    const banner = () => container.querySelector('.s-banner')!
    expect(banner().getAttribute('role')).toBe('status')
    expect(banner().getAttribute('aria-live')).toBe('polite')
    await rerender({ variant: 'negative' })
    expect(banner().getAttribute('aria-live')).toBe('assertive')
  })

  it('renders the status icon of every status variant', () => {
    for (const variant of ['info', 'positive', 'warning', 'negative'] as const) {
      const { container } = render(SBanner, { props: { variant }, slots: { default: 'X' } })
      const banner = container.querySelector(`.s-banner--${variant}`)
      expect(banner, variant).not.toBeNull()
      expect(banner?.querySelector('.s-banner__icon .s-icon'), variant).not.toBeNull()
    }
  })

  it('neutral carries no status icon', () => {
    const { container } = render(SBanner, { slots: { default: 'Cookies' } })
    expect(container.querySelector('.s-banner')).toHaveClass('s-banner--neutral')
    expect(container.querySelector('.s-banner__icon')).toBeNull()
  })

  it('the icon prop overrides the status icon and false removes it', () => {
    const custom = render(SBanner, {
      props: { variant: 'info', icon: 'star' },
      slots: { default: 'X' },
    })
    expect(custom.container.querySelector('.s-banner__icon .s-icon')).not.toBeNull()

    const none = render(SBanner, {
      props: { variant: 'info', icon: false },
      slots: { default: 'X' },
    })
    expect(none.container.querySelector('.s-banner__icon')).toBeNull()
  })

  it('renders the title, icon and actions slots', () => {
    const { container } = render(SBanner, {
      slots: {
        default: 'Message',
        title: '<span class="custom-title">New release</span>',
        icon: '<i class="custom-icon" />',
        actions: '<button type="button">Reload</button>',
      },
    })
    expect(container.querySelector('.custom-title')).not.toBeNull()
    expect(container.querySelector('.custom-icon')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
  })

  it('the close button hides the banner, updates the model and emits close', async () => {
    const { emitted } = render(SBanner, {
      props: { closable: true },
      slots: { default: 'A new version is available' },
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('A new version is available')).toBeNull()
    expect(emitted()['update:visible']).toEqual([[false]])
    expect(emitted().close).toHaveLength(1)
  })

  it('v-model:visible controls whether the banner is shown', async () => {
    const { rerender } = render(SBanner, {
      props: { visible: false },
      slots: { default: 'Trial ends in 3 days' },
    })
    expect(screen.queryByText('Trial ends in 3 days')).toBeNull()
    await rerender({ visible: true })
    expect(screen.getByText('Trial ends in 3 days')).toBeInTheDocument()
  })

  it('has no close button without closable', () => {
    render(SBanner, { slots: { default: 'X' } })
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
  })

  it('the close slot replaces the button and receives the close handler', async () => {
    const { emitted } = render(SBanner, {
      props: { closable: true },
      slots: {
        default: 'X',
        close: ({ close }: { close: () => void }) =>
          h('button', { type: 'button', onClick: close }, 'Dismiss'),
      },
    })
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
    await fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(emitted().close).toHaveLength(1)
  })

  it('takes the close button name from the dictionary and from the prop', () => {
    render(SBanner, {
      props: { closable: true, closeLabel: 'Hide banner' },
      slots: { default: 'X' },
    })
    expect(screen.getByRole('button', { name: 'Hide banner' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
  })

  it('is square by default and rounds the corners with :square="false"', () => {
    const square = render(SBanner, { slots: { default: 'X' } })
    expect(square.container.querySelector('.s-banner')).toHaveClass('s-banner--square')

    const rounded = render(SBanner, { props: { square: false }, slots: { default: 'X' } })
    expect(rounded.container.querySelector('.s-banner')).not.toHaveClass('s-banner--square')
  })

  it('applies the sticky and bordered classes', () => {
    const { container } = render(SBanner, {
      props: { sticky: true, bordered: true },
      slots: { default: 'X' },
    })
    const banner = container.querySelector('.s-banner')
    expect(banner).toHaveClass('s-banner--sticky')
    expect(banner).toHaveClass('s-banner--bordered')
  })

  it('the color prop emits the accent variables', () => {
    const { container } = render(SBanner, {
      props: { color: 'teal' },
      slots: { default: 'X' },
    })
    const style = container.querySelector<HTMLElement>('.s-banner')!.style
    expect(style.getPropertyValue('--s-banner-c')).toBe('var(--s-teal)')
    expect(style.getPropertyValue('--s-banner-c-subtle')).toContain('color-mix')
  })
})
