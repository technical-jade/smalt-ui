import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { SButtonGroup } from '../index'
import { SButton } from '../../SButton'

const boxes = (container: Element) =>
  [...container.querySelectorAll('.s-button')].map((el) => el.getBoundingClientRect())

// Shared edges are a matter of layout, which happy-dom does not compute.
describe('SButtonGroup · browser', () => {
  it('when an attached button wraps, the whole row takes its height', () => {
    const { container } = render({
      components: { SButtonGroup, SButton },
      template: `
        <div style="width: 240px">
          <SButtonGroup variant="outline">
            <SButton>Back</SButton>
            <SButton>Save changes and go further</SButton>
            <SButton icon="chevron-down" aria-label="More actions" />
          </SButtonGroup>
        </div>`,
    })
    const [back, save, more] = boxes(container)
    expect(save!.height).toBeGreaterThan(40)
    expect(back!.height).toBe(save!.height)
    expect(more!.height).toBe(save!.height)
    expect(back!.top).toBe(save!.top)
    expect(more!.width).toBe(40)
  })

  it('next to a tall field in a flex row, an attached group keeps its height', () => {
    const { container } = render({
      components: { SButtonGroup, SButton },
      template: `
        <div style="display: flex; gap: 8px">
          <textarea rows="6"></textarea>
          <SButtonGroup>
            <SButton>Back</SButton>
            <SButton icon="chevron-down" aria-label="More actions" />
          </SButtonGroup>
        </div>`,
    })
    const [back, more] = boxes(container)
    expect(container.querySelector('textarea')!.getBoundingClientRect().height).toBeGreaterThan(80)
    expect([back!.height, more!.height, more!.width]).toEqual([40, 40, 40])
  })

  it('a single-line attached row keeps the size height', () => {
    const { container } = render({
      components: { SButtonGroup, SButton },
      template: `
        <SButtonGroup size="sm">
          <SButton>Back</SButton>
          <SButton>Next</SButton>
          <SButton icon="chevron-down" aria-label="More actions" />
        </SButtonGroup>`,
    })
    const [back, next, more] = boxes(container)
    expect([back!.height, next!.height, more!.height, more!.width]).toEqual([32, 32, 32, 32])
  })
})
