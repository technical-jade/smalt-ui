import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { SToggle } from '../index'
import { SIcon } from '../../SIcon'

const heights = [
  ['sm', 32],
  ['md', 40],
  ['lg', 48],
] as const

const height = (container: Element) =>
  container.querySelector('.s-toggle')!.getBoundingClientRect().height

// Height and label wrapping come from layout, which happy-dom does not compute.
describe('SToggle · browser', () => {
  it.each(heights)('a single-line %s toggle keeps the size height', (size, expected) => {
    const { container } = render(SToggle, {
      props: { size },
      slots: { default: 'Bold' },
    })
    expect(height(container)).toBe(expected)
  })

  it.each(heights)('an icon %s toggle keeps the size height', (size, expected) => {
    const { container } = render({
      components: { SToggle, SIcon },
      template: `<SToggle size="${size}" aria-label="Pin"><SIcon icon="bookmark" /></SToggle>`,
    })
    expect(height(container)).toBe(expected)
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'a long %s label in a narrow container wraps, and the toggle grows in height',
    (size) => {
      const { container } = render({
        components: { SToggle },
        template: `
          <div style="width: 120px">
            <SToggle size="${size}"><span class="label">Show delivered orders only</span></SToggle>
          </div>`,
      })
      const toggle = container.querySelector('.s-toggle')!.getBoundingClientRect()
      const label = container.querySelector('.label')!.getBoundingClientRect()
      expect(label.height).toBeGreaterThan(30)
      expect(label.top).toBeGreaterThan(toggle.top)
      expect(label.bottom).toBeLessThan(toggle.bottom)
    },
  )

  // A flex row stretches its items by default, and a min-height toggle would follow the tallest.
  it('next to a tall field in a flex row, a toggle keeps its own height', () => {
    const { container } = render({
      components: { SToggle },
      template: `
        <div style="display: flex; gap: 8px">
          <textarea rows="6"></textarea>
          <SToggle>Bold</SToggle>
        </div>`,
    })
    expect(container.querySelector('textarea')!.getBoundingClientRect().height).toBeGreaterThan(80)
    expect(height(container)).toBe(40)
  })
})
