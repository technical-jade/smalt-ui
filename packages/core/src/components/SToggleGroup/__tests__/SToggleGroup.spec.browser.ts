import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { SToggleGroup } from '../index'

const boxes = (container: Element) =>
  [...container.querySelectorAll('.s-toggle')].map((el) => el.getBoundingClientRect())

// Item heights come from layout, which happy-dom does not compute.
describe('SToggleGroup · browser', () => {
  const options = [
    { value: 'all', label: 'All' },
    { value: 'delivered', label: 'Show delivered orders only' },
  ]

  it('when an item wraps, the other items take its height', () => {
    const { container } = render({
      components: { SToggleGroup },
      setup: () => ({ options }),
      template: `
        <div style="width: 200px">
          <SToggleGroup :options="options" aria-label="Orders" />
        </div>`,
    })
    const [all, delivered] = boxes(container)
    expect(delivered!.height).toBeGreaterThan(40)
    expect(all!.height).toBe(delivered!.height)
  })

  it('next to a tall field in a flex row, the group items keep their height', () => {
    const { container } = render({
      components: { SToggleGroup },
      setup: () => ({ options }),
      template: `
        <div style="display: flex; gap: 8px">
          <textarea rows="6"></textarea>
          <SToggleGroup :options="options" aria-label="Orders" />
        </div>`,
    })
    expect(container.querySelector('textarea')!.getBoundingClientRect().height).toBeGreaterThan(80)
    expect(boxes(container).map((box) => box.height)).toEqual([40, 40])
  })

  it('single-line items keep the size height', () => {
    const { container } = render(SToggleGroup, {
      props: { options: options.slice(0, 1), size: 'lg', ariaLabel: 'Orders' },
    })
    expect(boxes(container)[0]!.height).toBe(48)
  })
})
