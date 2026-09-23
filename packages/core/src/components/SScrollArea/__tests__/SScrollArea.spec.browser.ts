import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { SScrollArea } from '../index'

/** Scrolling and thumb geometry: happy-dom has neither layout nor a real ResizeObserver. */
describe('SScrollArea · browser', () => {
  const tall = (props: Record<string, unknown> = {}) =>
    render(SScrollArea, {
      props: { height: 160, type: 'always', ...props },
      slots: { default: '<div style="height: 800px; width: 800px">Release notes</div>' },
      attrs: { style: 'width: 240px' },
    })

  /**
   * Reka switches the viewport to `overflow: scroll` only after the scrollbar has registered on
   * that axis, which happens a tick after mount.
   */
  const scrollable = async (viewport: HTMLElement) =>
    vi.waitFor(() => expect(getComputedStyle(viewport).overflowY).toBe('scroll'))

  it('scrolls the viewport, not the page', async () => {
    const { container } = tall()
    const viewport = container.querySelector<HTMLElement>('.s-scroll-area__viewport')!
    await scrollable(viewport)
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
    viewport.scrollTop = 120
    expect(viewport.scrollTop).toBe(120)
  })

  /** A root that is only capped hands no definite height down, so the cap lands on the viewport. */
  it('scrolls when the size comes from maxHeight', async () => {
    const { container } = render(SScrollArea, {
      props: { maxHeight: 96, type: 'always' },
      slots: { default: '<div style="height: 400px">Release notes</div>' },
      attrs: { style: 'width: 240px' },
    })
    const viewport = container.querySelector<HTMLElement>('.s-scroll-area__viewport')!
    await scrollable(viewport)
    expect(viewport.clientHeight).toBeLessThanOrEqual(96)
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
    viewport.scrollTop = 80
    expect(viewport.scrollTop).toBe(80)
  })

  it('gives the vertical thumb a height once the sizes are measured', async () => {
    const { container } = tall()
    const scrollbar = container.querySelector<HTMLElement>(
      '.s-scroll-area__scrollbar[data-orientation="vertical"]',
    )!
    const thumb = scrollbar.querySelector<HTMLElement>('.s-scroll-area__thumb')!
    // The thumb stays at zero until the first ResizeObserver pass reports the track size.
    await vi.waitFor(() => expect(thumb.getBoundingClientRect().height).toBeGreaterThan(0))
    expect(thumb.getBoundingClientRect().height).toBeLessThan(
      scrollbar.getBoundingClientRect().height,
    )
    expect(thumb.getBoundingClientRect().width).toBeGreaterThan(0)
  })

  it('keeps the bar off the content flow, so the viewport spans the whole area', async () => {
    const { container } = tall()
    const root = container.querySelector<HTMLElement>('.s-scroll-area')!
    const viewport = container.querySelector<HTMLElement>('.s-scroll-area__viewport')!
    await scrollable(viewport)
    expect(viewport.getBoundingClientRect().width).toBe(root.getBoundingClientRect().width)
  })

  it('lays the horizontal thumb along the track', async () => {
    const { container } = tall({ orientation: 'both' })
    const scrollbar = container.querySelector<HTMLElement>(
      '.s-scroll-area__scrollbar[data-orientation="horizontal"]',
    )!
    const thumb = scrollbar.querySelector<HTMLElement>('.s-scroll-area__thumb')!
    await vi.waitFor(() => expect(thumb.getBoundingClientRect().width).toBeGreaterThan(0))
    expect(thumb.getBoundingClientRect().width).toBeLessThan(
      scrollbar.getBoundingClientRect().width,
    )
    expect(thumb.getBoundingClientRect().height).toBeGreaterThan(0)
  })

  /**
   * Reka wraps the slot in a content element of its own. A shrink-to-fit wrapper (Radix's
   * `display: table` trick) would collapse full-width children, so the width is asserted rather
   * than assumed.
   */
  it('keeps a full-width child as wide as the viewport', async () => {
    const { container } = render(SScrollArea, {
      props: { height: 160 },
      slots: { default: '<div class="probe" style="width: 100%; height: 800px">Notes</div>' },
      attrs: { style: 'width: 240px' },
    })
    const viewport = container.querySelector<HTMLElement>('.s-scroll-area__viewport')!
    const probe = container.querySelector<HTMLElement>('.probe')!
    expect(probe.getBoundingClientRect().width).toBe(viewport.getBoundingClientRect().width)
    // The default `hover` type mounts the bar only on pointer enter, but the viewport must scroll
    // from the wheel and the keyboard before that ever happens.
    await scrollable(viewport)
  })
})
