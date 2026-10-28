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

  it('enclosed: the active tab covers the line above the panel, with no vertical scroll', async () => {
    const { container } = render(STabs, {
      props: { items: items.slice(0, 3), modelValue: 't1', variant: 'enclosed' },
      slots: { t1: 'Panel' },
      attrs: { style: 'width: 480px' },
    })
    await nextTick()
    const list = container.querySelector<HTMLElement>('.s-tabs__list')!
    expect(list.scrollHeight).toBe(list.clientHeight)
    const active = container.querySelector<HTMLElement>('[data-state="active"]')!
    const inactive = container.querySelector<HTMLElement>('[data-state="inactive"]')!
    const panel = container.querySelector<HTMLElement>('.s-tabs__content[data-state="active"]')!
    expect(getComputedStyle(active).borderBottomColor).toBe(getComputedStyle(panel).backgroundColor)
    expect(getComputedStyle(inactive).borderBottomColor).not.toBe(
      getComputedStyle(panel).backgroundColor,
    )
    expect(active.getBoundingClientRect().bottom).toBe(panel.getBoundingClientRect().top)
  })
})
