import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SAppBar } from '../index'

const bar = (container: Element) => container.querySelector<HTMLElement>('.s-app-bar')!

describe('SAppBar', () => {
  it('is the banner landmark and holds the three areas', () => {
    render(SAppBar, {
      slots: { prepend: 'Menu', default: 'Dashboard', append: 'Profile' },
    })

    const banner = screen.getByRole('banner')
    expect(banner).toHaveClass('s-app-bar')
    expect(banner.querySelector('.s-app-bar__prepend')).toHaveTextContent('Menu')
    expect(banner.querySelector('.s-app-bar__content')).toHaveTextContent('Dashboard')
    expect(banner.querySelector('.s-app-bar__append')).toHaveTextContent('Profile')
  })

  it('drops the landmark role when the bar is not the page header', () => {
    const { container } = render(SAppBar, { props: { landmark: false } })
    expect(bar(container)).not.toHaveAttribute('role')
  })

  it('omits the side areas that have no slot', () => {
    const { container } = render(SAppBar, { slots: { default: 'Title' } })
    expect(container.querySelector('.s-app-bar__prepend')).toBeNull()
    expect(container.querySelector('.s-app-bar__append')).toBeNull()
  })

  it('sticks to the top by default', () => {
    const { container } = render(SAppBar)
    expect(bar(container)).toHaveClass('s-app-bar--sticky')
  })

  it.each(['static', 'fixed'] as const)('applies the %s position', (position) => {
    const { container } = render(SAppBar, { props: { position } })
    expect(bar(container)).toHaveClass(`s-app-bar--${position}`)
  })

  it('is bordered by default and loses the border on demand', () => {
    const { container } = render(SAppBar)
    expect(bar(container)).toHaveClass('s-app-bar--bordered')

    const plain = render(SAppBar, { props: { bordered: false } })
    expect(bar(plain.container)).not.toHaveClass('s-app-bar--bordered')
  })

  it('publishes the height as a custom property, taking a number as pixels', () => {
    const { container } = render(SAppBar, { props: { height: 72 } })
    expect(bar(container).style.getPropertyValue('--s-app-bar-height')).toBe('72px')

    const css = render(SAppBar, { props: { height: '4rem' } })
    expect(bar(css.container).style.getPropertyValue('--s-app-bar-height')).toBe('4rem')
  })

  it('leaves the height variable alone without the prop', () => {
    const { container } = render(SAppBar)
    expect(bar(container).style.getPropertyValue('--s-app-bar-height')).toBe('')
  })

  it('stays flat until the window is scrolled', () => {
    const { container } = render(SAppBar, { props: { elevateOnScroll: true } })
    expect(bar(container)).not.toHaveClass('s-app-bar--elevated')
  })

  it('turns the shadow props into the elevation variable', () => {
    const { container } = render(SAppBar, { props: { elevation: 3 } })
    expect(bar(container).style.getPropertyValue('--s-app-bar-elevation')).toBe(
      'var(--s-elevation-3)',
    )
  })

  it('resolves the accent color into the surface variables', () => {
    const { container } = render(SAppBar, { props: { color: 'teal', textColor: 'white' } })
    expect(bar(container).style.getPropertyValue('--s-app-bar-c')).toBe('var(--s-teal)')
    expect(bar(container).style.getPropertyValue('--s-app-bar-c-on')).toBe('var(--s-white)')
  })
})
