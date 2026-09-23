import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { h, ref } from 'vue'
import { STimeline } from '../index'
import type { STimelineItem, STimelineLabelPlacement, STimelineOrientation } from '../index'

// Descriptions of different lengths wrap differently, so the events get different heights.
const items: STimelineItem[] = [
  { title: 'Order created', description: 'Paid by card', date: 'March 3' },
  { title: 'Packed', description: 'Warehouse 12, three parcels on one pallet', date: 'March 4' },
  { title: 'Shipped', date: 'March 5' },
]

const box = (el: Element) => el.getBoundingClientRect()
const centerX = (el: Element) => box(el).left + box(el).width / 2
const centerY = (el: Element) => box(el).top + box(el).height / 2

function timeline(
  orientation: STimelineOrientation,
  labelPlacement: STimelineLabelPlacement,
  containerWidth = '1200px',
) {
  const { container } = render(STimeline, {
    props: { items, modelValue: 1, orientation, labelPlacement },
  })
  ;(container as HTMLElement).style.inlineSize = containerWidth
  const root = container.querySelector('.s-timeline')!
  return {
    root,
    dot: root.querySelector('.s-timeline__indicator')!,
    text: root.querySelector('.s-timeline__content')!,
    line: root.querySelector('.s-timeline__line')!,
  }
}

/** Which side the text lands on is a question about boxes, and happy-dom lays out none. */
describe('STimeline · label placement · browser', () => {
  const sides = {
    top: (text: DOMRect, dot: DOMRect) => text.bottom <= dot.top,
    bottom: (text: DOMRect, dot: DOMRect) => text.top >= dot.bottom,
    start: (text: DOMRect, dot: DOMRect) => text.right <= dot.left,
    end: (text: DOMRect, dot: DOMRect) => text.left >= dot.right,
  }

  it.each([
    ['vertical', 'end'],
    ['vertical', 'start'],
    ['vertical', 'top'],
    ['vertical', 'bottom'],
    ['horizontal', 'end'],
    ['horizontal', 'start'],
    ['horizontal', 'top'],
    ['horizontal', 'bottom'],
  ] as const)('puts the text %s of the dot on the %s side', (orientation, placement) => {
    const { dot, text } = timeline(orientation, placement)

    expect(sides[placement](box(text), box(dot))).toBe(true)
  })

  /**
   * The point of the stacked placements: the text lines up with the middle of the dot instead of
   * starting at its edge.
   */
  it.each(['vertical', 'horizontal'] as const)(
    'centres the text on the dot above and below it (%s)',
    (orientation) => {
      for (const placement of ['top', 'bottom'] as const) {
        const { dot, text } = timeline(orientation, placement)
        expect(Math.abs(centerX(text) - centerX(dot))).toBeLessThan(1)
      }
    },
  )

  it('centres the text on the dot beside it in a horizontal timeline', () => {
    for (const placement of ['start', 'end'] as const) {
      const { dot, text } = timeline('horizontal', placement)
      expect(Math.abs(centerY(text) - centerY(dot))).toBeLessThan(1)
    }
  })

  it.each(['top', 'bottom', 'start', 'end'] as const)(
    'keeps the rail running down the dots in a vertical timeline (%s)',
    (placement) => {
      const { dot, line } = timeline('vertical', placement)

      expect(box(line).width).toBeLessThan(box(dot).width)
      expect(box(line).top).toBeGreaterThanOrEqual(box(dot).top)
    },
  )

  it.each(['top', 'bottom', 'start', 'end'] as const)(
    'keeps the rail running across the dots in a horizontal timeline (%s)',
    (placement) => {
      const { dot, line } = timeline('horizontal', placement)

      expect(box(line).height).toBeLessThan(box(dot).height)
      expect(box(line).left).toBeGreaterThanOrEqual(box(dot).left)
    },
  )
})

/**
 * The threshold is compared with the timeline width, not the window: the container here is narrow
 * in a wide viewport — exactly the case of a sidebar or a modal where a media query stays silent.
 */
describe('STimeline · collapsing by container width · browser', () => {
  const renderAt = (containerWidth: string) => {
    const { container } = render(STimeline, {
      props: { items, modelValue: 1, orientation: 'horizontal', stackAt: 600 },
    })
    ;(container as HTMLElement).style.inlineSize = containerWidth
    return container.querySelector('.s-timeline')!
  }

  it('switches to vertical when the container is narrower than the threshold', async () => {
    const root = renderAt('360px')

    await expect.poll(() => root.className).toContain('s-timeline--vertical')
    // The text moves to the vertical default since no placement is set.
    expect(root.className).toContain('s-timeline--label-end')
  })

  it('stays horizontal while there is enough width', async () => {
    const root = renderAt('900px')

    await expect.poll(() => root.className).toContain('s-timeline--horizontal')
    expect(root.className).toContain('s-timeline--label-bottom')
  })

  /**
   * Once collapsed, the timeline shrinks to its content in a flex container, so measuring its own
   * width instead of the parent's would keep it vertical forever.
   */
  it('switches back when the space returns, in a flex container', async () => {
    const containerWidth = ref('360px')
    const { container } = render({
      render: () =>
        h('div', { style: `display: flex; inline-size: ${containerWidth.value}` }, [
          h(STimeline, { items, modelValue: 1, orientation: 'horizontal', stackAt: 600 }),
        ]),
    })
    const root = container.querySelector('.s-timeline')!
    await expect.poll(() => root.className).toContain('s-timeline--vertical')

    containerWidth.value = '900px'
    await expect.poll(() => root.className).toContain('s-timeline--horizontal')
  })
})
