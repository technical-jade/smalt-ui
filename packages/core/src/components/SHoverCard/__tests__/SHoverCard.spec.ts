import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SHoverCard } from '../index'

const trigger = '<a href="#">@alex</a>'

describe('SHoverCard', () => {
  it('renders the trigger with the card hidden by default', () => {
    render(SHoverCard, { slots: { trigger, default: 'Profile' } })
    expect(screen.getByRole('link', { name: '@alex' })).toBeInTheDocument()
    expect(screen.queryByText('Profile')).toBeNull()
  })

  it('shows the content when open=true', async () => {
    render(SHoverCard, {
      props: { open: true },
      slots: { trigger, default: 'Profile card' },
    })
    expect(await screen.findByText('Profile card')).toBeInTheDocument()
  })

  it('class and data attributes from the component land on the card, not the trigger', async () => {
    render(SHoverCard, {
      props: { open: true },
      attrs: { class: 'profile-card', 'data-testid': 'profile' },
      slots: { trigger, default: 'Profile card' },
    })
    const card = (await screen.findByText('Profile card')).closest('.s-hover-card__content')
    expect(card).toHaveClass('profile-card')
    expect(card).toHaveAttribute('data-testid', 'profile')
    expect(screen.getByRole('link', { name: '@alex' })).not.toHaveAttribute('data-testid')
  })

  it('enable-touch opens the card on tap', async () => {
    const { emitted } = render(SHoverCard, {
      props: { enableTouch: true },
      slots: { trigger, default: 'Profile' },
    })
    await fireEvent.pointerUp(screen.getByRole('link'), { pointerType: 'touch' })
    expect(emitted()['update:open']).toEqual([[true]])
  })

  it('ignores taps by default', async () => {
    const { emitted } = render(SHoverCard, { slots: { trigger, default: 'Profile' } })
    await fireEvent.pointerUp(screen.getByRole('link'), { pointerType: 'touch' })
    expect(emitted()['update:open']).toBeUndefined()
  })
})
