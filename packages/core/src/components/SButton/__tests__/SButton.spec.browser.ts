import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
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

  // The test app has no .s-root around it, like a portal: browser link styles apply.
  it('a link button is not underlined outside the .s-root container', () => {
    const { container } = render(SButton, {
      props: { as: 'a', variant: 'ghost' },
      attrs: { href: '#' },
      slots: { default: 'Link' },
    })
    expect(getComputedStyle(container.querySelector('.s-button')!).textDecorationLine).toBe('none')
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

  it('a focused button keeps focus when it starts loading', async () => {
    const { container, rerender } = render(SButton, { slots: { default: 'Save' } })
    const btn = container.querySelector<HTMLButtonElement>('.s-button')!
    btn.focus()
    await rerender({ loading: true })
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    expect(document.activeElement).toBe(btn)
    expect(btn).toHaveAttribute('aria-busy', 'true')
  })

  it('variant="link" drops the button height and padding and is underlined', () => {
    const { container } = render(SButton, {
      props: { variant: 'link', size: 'lg' },
      slots: { default: 'Edit' },
    })
    const button = container.querySelector<HTMLElement>('.s-button')!
    const style = getComputedStyle(button)
    expect(button.getBoundingClientRect().height).toBeLessThan(32)
    expect(style.paddingLeft).toBe('0px')
    expect(style.textDecorationLine).toBe('underline')
    expect(style.boxShadow).toBe('none')
  })

  it('variant="link": hover keeps the underline thickness', async () => {
    const { container } = render(SButton, {
      props: { variant: 'link' },
      slots: { default: 'Edit' },
    })
    const button = container.querySelector<HTMLElement>('.s-button')!
    const before = getComputedStyle(button).textDecorationThickness
    await userEvent.hover(button)
    expect(getComputedStyle(button).textDecorationThickness).toBe(before)
  })
})
