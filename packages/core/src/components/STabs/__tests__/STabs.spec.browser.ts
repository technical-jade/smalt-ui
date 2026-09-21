import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { nextTick } from 'vue'
import { STabs } from '../index'

const items = Array.from({ length: 12 }, (_, i) => ({ value: `t${i}`, label: `Section ${i + 1}` }))

/** Overflow and scroll positions need real layout. */
describe('STabs · browser', () => {
  it('a list wider than its container scrolls inside it', () => {
    const { container } = render(STabs, {
      props: { items, modelValue: 't0' },
      attrs: { style: 'width: 360px' },
    })
    const list = container.querySelector<HTMLElement>('.s-tabs__list')!
    expect(list.scrollWidth).toBeGreaterThan(list.clientWidth)
    expect(list.getBoundingClientRect().right).toBeLessThanOrEqual(
      container.querySelector('.s-tabs')!.getBoundingClientRect().right,
    )
  })

  it('a tab activated from outside scrolls into view', async () => {
    const { container, rerender } = render(STabs, {
      props: { items, modelValue: 't0' },
      attrs: { style: 'width: 360px' },
    })
    await rerender({ items, modelValue: 't11' })
    await nextTick()
    const list = container.querySelector('.s-tabs__list')!.getBoundingClientRect()
    const tab = container.querySelector('[data-state="active"]')!.getBoundingClientRect()
    expect(tab.left).toBeGreaterThanOrEqual(list.left)
    expect(tab.right).toBeLessThanOrEqual(list.right + 0.5)
  })
})
