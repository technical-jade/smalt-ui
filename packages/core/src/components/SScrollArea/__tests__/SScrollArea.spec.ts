import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SScrollArea } from '../index'

/**
 * happy-dom has no layout, so nothing here can say whether a scrollbar is on screen: with the
 * default `hover` type Reka mounts it only once the content actually overflows. Visibility and
 * thumb geometry are covered in SScrollArea.spec.browser.ts; `type="always"` is used below
 * because it renders the scrollbars unconditionally.
 */
describe('SScrollArea', () => {
  const bars = (container: Element) =>
    [...container.querySelectorAll('.s-scroll-area__scrollbar')].map((el) =>
      el.getAttribute('data-orientation'),
    )

  it('renders the slot content inside the viewport', () => {
    const { container } = render(SScrollArea, { slots: { default: 'Release notes' } })
    expect(container.querySelector('.s-scroll-area')).toBeInTheDocument()
    const viewport = container.querySelector('.s-scroll-area__viewport')
    expect(viewport).toBeInTheDocument()
    expect(screen.getByText('Release notes').closest('.s-scroll-area__viewport')).toBe(viewport)
  })

  it('renders only the vertical scrollbar by default', () => {
    const { container } = render(SScrollArea, {
      props: { type: 'always' },
      slots: { default: 'Release notes' },
    })
    expect(bars(container)).toEqual(['vertical'])
  })

  it('renders only the horizontal scrollbar for the horizontal orientation', () => {
    const { container } = render(SScrollArea, {
      props: { type: 'always', orientation: 'horizontal' },
      slots: { default: 'Release notes' },
    })
    expect(bars(container)).toEqual(['horizontal'])
  })

  it('renders both scrollbars for the both orientation', () => {
    const { container } = render(SScrollArea, {
      props: { type: 'always', orientation: 'both' },
      slots: { default: 'Release notes' },
    })
    expect(bars(container)).toEqual(['vertical', 'horizontal'])
  })

  it('applies the size modifier', () => {
    const { container } = render(SScrollArea, {
      props: { size: 'lg' },
      slots: { default: 'Release notes' },
    })
    expect(container.querySelector('.s-scroll-area')).toHaveClass('s-scroll-area--lg')
  })

  /**
   * The cap lands on the viewport, not on the root: a root that is only capped has no definite
   * height to hand down, so the viewport would outgrow it and be clipped without scrolling.
   */
  it('turns the sizing props into inline lengths, treating a number as pixels', () => {
    const { container } = render(SScrollArea, {
      props: { height: 240, maxHeight: '50vh' },
      slots: { default: 'Release notes' },
    })
    const root = container.querySelector<HTMLElement>('.s-scroll-area')!
    const viewport = container.querySelector<HTMLElement>('.s-scroll-area__viewport')!
    expect(root.style.height).toBe('240px')
    expect(viewport.style.maxHeight).toBe('50vh')
  })

  it('leaves the sizing to the consumer without the sizing props', () => {
    const { container } = render(SScrollArea, { slots: { default: 'Release notes' } })
    const root = container.querySelector<HTMLElement>('.s-scroll-area')!
    const viewport = container.querySelector<HTMLElement>('.s-scroll-area__viewport')!
    expect(root.style.height).toBe('')
    expect(viewport.style.maxHeight).toBe('')
  })
})
