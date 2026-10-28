import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SButton } from '../index'

/** Button geometry: happy-dom has neither sizes nor computed styles. */
describe('SButton · browser', () => {
  const heights = [
    ['sm', 32],
    ['md', 40],
    ['lg', 48],
  ] as const

  it.each(heights)('a single-line %s button with icons keeps the size height', (size, height) => {
    const { container } = render(SButton, {
      props: { size, icon: 'star', iconRight: 'chevron-down' },
      slots: { default: 'Save' },
    })
    expect(container.querySelector('.s-button')!.getBoundingClientRect().height).toBe(height)
  })

  it.each(heights)('an icon %s button is square and keeps the size height', (size, height) => {
    const { container } = render(SButton, {
      props: { size, icon: 'x', ariaLabel: 'Delete' },
    })
    const box = container.querySelector('.s-button')!.getBoundingClientRect()
    expect(box.height).toBe(height)
    expect(box.width).toBe(height)
  })

  it('a long label in a narrow container wraps, and the button grows in height', () => {
    const { container } = render({
      components: { SButton },
      template: '<div style="width: 120px"><SButton>Save changes and go further</SButton></div>',
    })
    const button = container.querySelector('.s-button')!.getBoundingClientRect()
    const label = container.querySelector('.s-button__label')!.getBoundingClientRect()
    expect(label.height).toBeGreaterThan(30)
    expect(button.height).toBeGreaterThan(40)
    expect(label.top).toBeGreaterThan(button.top)
    expect(label.bottom).toBeLessThan(button.bottom)
  })

  // A flex row stretches its items by default, and a min-height button would follow the tallest.
  it('next to a tall field in a flex row, a button keeps its own height', () => {
    const { container } = render({
      components: { SButton },
      template: `
        <div style="display: flex; gap: 8px">
          <textarea rows="6"></textarea>
          <SButton>Send</SButton>
          <SButton icon="x" aria-label="Clear" />
        </div>`,
    })
    const [label, icon] = [...container.querySelectorAll('.s-button')].map((el) =>
      el.getBoundingClientRect(),
    )
    expect(container.querySelector('textarea')!.getBoundingClientRect().height).toBeGreaterThan(80)
    expect(label!.height).toBe(40)
    expect([icon!.width, icon!.height]).toEqual([40, 40])
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

  // A computed color is rgb() or, after color-mix, color(srgb …); both are brought to 0–255.
  const channels = (color: string) => {
    const values = color.match(/[\d.]+/g)!.map(Number)
    return color.startsWith('color(') ? values.slice(0, 3).map((v) => v * 255) : values.slice(0, 3)
  }
  const distance = (a: string, b: string) =>
    channels(a).reduce((sum, v, i) => sum + Math.abs(v - channels(b)[i]), 0)

  const hoverLink = async (props: Record<string, unknown>, expected: string) => {
    const { container } = render(SButton, {
      props: { variant: 'link', ...props },
      slots: { default: 'Edit' },
    })
    const button = container.querySelector<HTMLElement>('.s-button')!
    const probe = button.appendChild(document.createElement('span'))
    probe.style.color = expected
    const hoverColor = getComputedStyle(probe).color
    probe.remove()
    const { color, textDecorationThickness } = getComputedStyle(button)
    await userEvent.hover(button)
    await vi.waitFor(() => expect(getComputedStyle(button).color).toBe(hoverColor))
    return { rest: color, hover: hoverColor, button, textDecorationThickness }
  }

  it('variant="link": hover visibly changes the color but not the underline thickness', async () => {
    const { rest, hover, button, textDecorationThickness } = await hoverLink(
      {},
      'color-mix(in srgb, var(--s-color-primary-text), var(--s-shade) 30%)',
    )
    expect(distance(rest, hover)).toBeGreaterThan(60)
    expect(getComputedStyle(button).textDecorationThickness).toBe(textDecorationThickness)
  })

  it('variant="link" lightens on hover in the dark theme', async () => {
    document.documentElement.dataset.theme = 'dark'
    try {
      const { rest, hover } = await hoverLink(
        {},
        'color-mix(in srgb, var(--s-color-primary-text), var(--s-shade) 30%)',
      )
      const lightness = (color: string) => channels(color).reduce((sum, v) => sum + v, 0)
      expect(lightness(hover) - lightness(rest)).toBeGreaterThan(60)
    } finally {
      delete document.documentElement.dataset.theme
    }
  })

  it('variant="link" with color shifts that color toward --s-shade', async () => {
    const { rest, hover } = await hoverLink(
      { color: 'teal' },
      'color-mix(in srgb, var(--s-button-c), var(--s-shade) 30%)',
    )
    expect(distance(rest, hover)).toBeGreaterThan(60)
  })

  it('variant="link" with color="neutral" takes the accent color on hover', async () => {
    const { rest, hover } = await hoverLink({ color: 'neutral' }, 'var(--s-color-primary-text)')
    expect(distance(rest, hover)).toBeGreaterThan(60)
  })
})
