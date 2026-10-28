import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SHoverCard } from '../index'

describe('SHoverCard · browser', () => {
  it('the arrow is stroked with the panel border color and visible without a shadow', async () => {
    render(SHoverCard, {
      props: { open: true, flat: true },
      slots: { trigger: '<a href="#">@alex</a>', default: 'Profile card' },
    })
    await screen.findByText('Profile card')
    const panel = document.querySelector('.s-hover-card__content')!
    const styles = getComputedStyle(panel.querySelector('.s-hover-card__arrow')!)
    expect(styles.stroke).toBe(getComputedStyle(panel).borderTopColor)
    expect(styles.overflow).toBe('visible')
  })

  it('--s-hover-card-border colors both the card border and the arrow stroke', async () => {
    render(SHoverCard, {
      props: { open: true },
      attrs: { class: 'brand-card', style: '--s-hover-card-border: rgb(0, 128, 0)' },
      slots: { trigger: '<a href="#">@alex</a>', default: 'Profile card' },
    })
    await screen.findByText('Profile card')
    const panel = document.querySelector('.s-hover-card__content')!
    expect(getComputedStyle(panel).borderTopColor).toBe('rgb(0, 128, 0)')
    expect(getComputedStyle(panel.querySelector('.s-hover-card__arrow')!).stroke).toBe(
      'rgb(0, 128, 0)',
    )
  })

  it('the arrow stroke does not scale with the arrow', async () => {
    render(SHoverCard, {
      props: { open: true },
      slots: { trigger: '<a href="#">@alex</a>', default: 'Profile card' },
    })
    await screen.findByText('Profile card')
    const path = document.querySelector('.s-hover-card__arrow path')!
    expect(getComputedStyle(path).vectorEffect).toBe('non-scaling-stroke')
  })
})
