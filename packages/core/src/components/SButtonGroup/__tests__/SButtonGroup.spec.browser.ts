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

  it('an attached group of filled buttons casts one shadow and splits them with a line', () => {
    const { container } = render({
      components: { SButtonGroup, SButton },
      template: `
        <SButtonGroup>
          <SButton>Copy</SButton>
          <SButton>Cut</SButton>
        </SButtonGroup>`,
    })
    const group = container.querySelector('.s-button-group')!
    const [copy, cut] = container.querySelectorAll('.s-button')
    expect(getComputedStyle(group).boxShadow).not.toBe('none')
    expect(getComputedStyle(copy!).boxShadow).toBe('none')
    expect(getComputedStyle(cut!).boxShadow).toBe('none')
    expect(getComputedStyle(cut!).borderLeftColor).not.toBe('rgba(0, 0, 0, 0)')
    // A raised (hovered, pressed) button would cover a line it overlapped.
    expect(cut!.getBoundingClientRect().left).toBe(copy!.getBoundingClientRect().right)
  })

  it('an attached group mixing filled and outlined buttons stays flat', () => {
    const { container } = render({
      components: { SButtonGroup, SButton },
      template: `
        <SButtonGroup variant="outline">
          <SButton>Draft</SButton>
          <SButton variant="primary">Publish</SButton>
        </SButtonGroup>`,
    })
    const group = container.querySelector('.s-button-group')!
    expect(getComputedStyle(group).boxShadow).toBe('none')
  })

  it('flat removes the group shadow and elevation sets its level', () => {
    const { container } = render({
      components: { SButtonGroup, SButton },
      template: `
        <SButtonGroup flat>
          <SButton>Copy</SButton>
          <SButton>Cut</SButton>
        </SButtonGroup>
        <SButtonGroup :elevation="3">
          <SButton>Copy</SButton>
          <SButton>Cut</SButton>
        </SButtonGroup>`,
    })
    const [flat, raised] = container.querySelectorAll<HTMLElement>('.s-button-group')
    expect(getComputedStyle(flat!).boxShadow).toBe('none')
    expect(raised!.style.getPropertyValue('--s-button-group-elevation')).toBe(
      'var(--s-elevation-3)',
    )
    expect(getComputedStyle(raised!).boxShadow).not.toBe('none')
    for (const button of raised!.querySelectorAll('.s-button')) {
      expect(getComputedStyle(button).boxShadow).toBe('none')
    }
  })
})
