import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { SListItem } from '../index'

/**
 * Opacity multiplies down the tree, so a second dimming layer can only be caught with computed
 * styles — happy-dom reports the declarations, not what the row ends up looking like.
 */
const dimming = (container: Element) => {
  const wrapper = container.querySelector<HTMLElement>('.s-list-item')!
  const row = container.querySelector<HTMLElement>('.s-list-item__row')!
  return Number(getComputedStyle(wrapper).opacity) * Number(getComputedStyle(row).opacity)
}

describe('SListItem dimming', () => {
  it.each([
    ['plain', {}],
    ['clickable', { clickable: true }],
    ['link', { href: '#report' }],
  ])('a disabled %s row is dimmed once', (_kind, props) => {
    const { container } = render(SListItem, {
      props: { title: 'Delete account', disabled: true, ...props },
    })

    expect(dimming(container)).toBeCloseTo(0.38, 2)
  })

  it('an enabled row is not dimmed', () => {
    const { container } = render(SListItem, { props: { title: 'Inbox', clickable: true } })

    expect(dimming(container)).toBe(1)
  })
})
