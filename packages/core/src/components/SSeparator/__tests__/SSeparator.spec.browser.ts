import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { h } from 'vue'
import { SSeparator } from '../index'

/** Computed geometry: happy-dom does not compute the height of a stretched element. */
describe('SSeparator · browser', () => {
  /**
   * A vertical separator gets its height from stretching along the row, not from a percentage of
   * the parent: a button bar usually has auto height, and `height: 100%` would collapse the line.
   */
  it('stretches to the row height when the parent has none', () => {
    const { container } = render({
      render: () =>
        h('div', { style: 'display: flex; align-items: center; gap: 12px' }, [
          h('span', { style: 'line-height: 2rem' }, 'Profile'),
          h(SSeparator, { orientation: 'vertical' }),
          h('span', 'Log out'),
        ]),
    })

    const line = container.querySelector('.s-separator')!.getBoundingClientRect()
    expect(line.height).toBeGreaterThanOrEqual(32)
    expect(line.width).toBeCloseTo(1, 1)
  })

  it('line-style draws a dashed line as thick as the solid one', () => {
    const { container } = render({
      render: () =>
        h('div', { style: 'width: 200px' }, [
          h(SSeparator, { lineStyle: 'dashed' }),
          h(SSeparator, { lineStyle: 'dotted', label: 'or' }),
        ]),
    })
    const [dashed, labeled] = container.querySelectorAll<HTMLElement>('.s-separator')
    expect(getComputedStyle(dashed).borderTopStyle).toBe('dashed')
    expect(dashed.getBoundingClientRect().height).toBe(1)
    const line = labeled.querySelector('.s-separator__line')!
    expect(getComputedStyle(line).borderTopStyle).toBe('dotted')
  })

  it('a vertical dashed line stays 1px wide', () => {
    const { container } = render({
      render: () =>
        h('div', { style: 'display: flex; height: 40px' }, [
          h(SSeparator, { orientation: 'vertical', lineStyle: 'dashed' }),
        ]),
    })
    const line = container.querySelector<HTMLElement>('.s-separator')!
    expect(getComputedStyle(line).borderLeftStyle).toBe('dashed')
    expect(line.getBoundingClientRect().width).toBe(1)
    expect(line.getBoundingClientRect().height).toBe(40)
  })

  it('color paints a line of any style and keeps the label muted', () => {
    const { container } = render({
      render: () =>
        h('div', { style: 'width: 200px; --s-teal: rgb(0, 128, 128)' }, [
          h(SSeparator, { color: 'teal' }),
          h(SSeparator, { color: 'teal', lineStyle: 'dashed' }),
          h(SSeparator, { color: 'teal', label: 'or' }),
          h(SSeparator, { label: 'or' }),
        ]),
    })
    const [solid, dashed, labeled, plain] = container.querySelectorAll<HTMLElement>('.s-separator')
    const teal = 'rgb(0, 128, 128)'
    expect(getComputedStyle(solid).backgroundColor).toBe(teal)
    expect(getComputedStyle(dashed).borderTopColor).toBe(teal)
    expect(getComputedStyle(labeled.querySelector('.s-separator__line')!).backgroundColor).toBe(
      teal,
    )
    expect(getComputedStyle(labeled.querySelector('.s-separator__label')!).color).toBe(
      getComputedStyle(plain.querySelector('.s-separator__label')!).color,
    )
  })
})
