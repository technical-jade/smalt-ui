import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { SButton } from '../index'

/** Button geometry: happy-dom has neither sizes nor computed styles. */
describe('SButton · browser', () => {
  it('an icon button is square and no wider than its height', () => {
    const { container } = render(SButton, {
      props: { icon: 'x', ariaLabel: 'Delete', size: 'md' },
    })
    const box = container.querySelector('.s-button')!.getBoundingClientRect()
    expect(box.height).toBe(40)
    expect(box.width).toBe(box.height)
  })

  it('flat removes the shadow, a regular button keeps it', () => {
    const { container: flat } = render(SButton, {
      props: { flat: true },
      slots: { default: 'Submit' },
    })
    const { container: normal } = render(SButton, { slots: { default: 'Submit' } })
    expect(getComputedStyle(flat.querySelector('.s-button')!).boxShadow).toBe('none')
    expect(getComputedStyle(normal.querySelector('.s-button')!).boxShadow).not.toBe('none')
  })

  it('a disabled link button is not raised: aria-disabled instead of disabled', () => {
    const { container } = render(SButton, {
      props: { as: 'a', disabled: true, variant: 'primary' },
      attrs: { href: '#' },
      slots: { default: 'Link' },
    })
    expect(getComputedStyle(container.querySelector('.s-button')!).boxShadow).toBe('none')
  })

  it('elevation overrides flat', () => {
    const { container } = render(SButton, {
      props: { flat: true, elevation: 3, variant: 'primary' },
      slots: { default: 'OK' },
    })
    expect(getComputedStyle(container.querySelector('.s-button')!).boxShadow).not.toBe('none')
  })

  it('loading does not change the width of the button', async () => {
    const { container, rerender } = render(SButton, {
      props: { icon: 'star' },
      slots: { default: 'Save changes' },
    })
    const button = container.querySelector('.s-button')!
    const width = button.getBoundingClientRect().width
    await rerender({ loading: true })
    expect(button.getBoundingClientRect().width).toBe(width)
  })
})
