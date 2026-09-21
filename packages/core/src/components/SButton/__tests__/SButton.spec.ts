import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SButton } from '../index'

describe('SButton', () => {
  it('renders a native button with text by default', () => {
    render(SButton, { slots: { default: 'Save' } })
    const btn = screen.getByRole('button', { name: 'Save' })
    expect(btn.tagName).toBe('BUTTON')
    expect(btn).toHaveClass('s-button', 's-button--primary', 's-button--md')
  })

  it('applies the variant and size', () => {
    render(SButton, { props: { variant: 'negative', size: 'lg' }, slots: { default: 'Delete' } })
    expect(screen.getByRole('button')).toHaveClass('s-button--negative', 's-button--lg')
  })

  it('round adds the pill shape modifier', () => {
    render(SButton, { props: { round: true }, slots: { default: 'Quick start' } })
    expect(screen.getByRole('button')).toHaveClass('s-button--round')
  })

  it('square adds the square corners modifier', () => {
    render(SButton, { props: { square: true }, slots: { default: 'X' } })
    expect(screen.getByRole('button')).toHaveClass('s-button--square')
  })

  it('color sets the inline accent variable, text-color sets the text color', () => {
    render(SButton, {
      props: { color: 'teal', textColor: 'dark' },
      slots: { default: 'X' },
    })
    const style = screen.getByRole('button').getAttribute('style') ?? ''
    expect(style).toContain('--s-button-c: var(--s-teal)')
    expect(style).toContain('--s-button-c-on: var(--s-dark)')
  })

  it('disabled blocks the button and clicks', async () => {
    let clicks = 0
    render(SButton, {
      props: { disabled: true },
      attrs: { onClick: () => (clicks += 1) },
      slots: { default: 'x' },
    })
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    await fireEvent.click(btn)
    expect(clicks).toBe(0)
  })

  it('loading sets aria-busy and disables the button', () => {
    const { container } = render(SButton, { props: { loading: true }, slots: { default: 'x' } })
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(btn).toBeDisabled()
    expect(container.querySelector('.s-button__spinner')).not.toBeNull()
  })

  it('renders as a link via the as prop', () => {
    render(SButton, { props: { as: 'a' }, attrs: { href: '#' }, slots: { default: 'Link' } })
    const link = screen.getByRole('link', { name: 'Link' })
    expect(link.tagName).toBe('A')
  })

  it('as="a" with disabled blocks the click', async () => {
    const onClick = vi.fn()
    const { container } = render(SButton, {
      props: { as: 'a', disabled: true },
      attrs: { href: '#target', onClick },
      slots: { default: 'Link' },
    })
    await fireEvent.click(container.querySelector('a')!)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('as="a" with loading blocks the click', async () => {
    const onClick = vi.fn()
    const { container } = render(SButton, {
      props: { as: 'a', loading: true },
      attrs: { href: '#target', onClick },
      slots: { default: 'Link' },
    })
    await fireEvent.click(container.querySelector('a')!)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders the leading and trailing icons from props', () => {
    const { container } = render(SButton, {
      props: { icon: 'check', iconRight: 'chevron-down' },
      slots: { default: 'Done' },
    })
    const affixes = container.querySelectorAll('.s-button__affix')
    expect(affixes).toHaveLength(2)
    expect(container.querySelectorAll('.s-button__affix .s-icon')).toHaveLength(2)
  })

  it('the leading slot overrides the icon prop', () => {
    const { container } = render(SButton, {
      props: { icon: 'check' },
      slots: { default: 'x', leading: '<i class="custom-leading" />' },
    })
    expect(container.querySelector('.custom-leading')).not.toBeNull()
    expect(container.querySelector('.s-button__affix .s-icon')).toBeNull()
  })

  it('passes ariaLabel as the accessible name', () => {
    render(SButton, { props: { icon: 'plus', ariaLabel: 'Add' } })
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('an icon without a label makes the button square on its own, without the prop', () => {
    const { container } = render(SButton, { props: { icon: 'x', ariaLabel: 'Delete' } })
    expect(container.querySelector('.s-button')).toHaveClass('s-button--icon-only')
  })

  it('an icon with a label does not count as an icon button', () => {
    const { container } = render(SButton, {
      props: { icon: 'x' },
      slots: { default: 'Delete' },
    })
    expect(container.querySelector('.s-button')).not.toHaveClass('s-button--icon-only')
  })

  it('iconOnly is set explicitly for slot content', () => {
    const { container } = render(SButton, {
      props: { iconOnly: true, ariaLabel: 'Menu' },
      slots: { leading: '<span data-test="i" />' },
    })
    expect(container.querySelector('.s-button')).toHaveClass('s-button--icon-only')
  })

  it('flat removes the variant shadow', () => {
    const { container } = render(SButton, {
      props: { flat: true },
      slots: { default: 'Submit' },
    })
    expect(container.querySelector('.s-button')).toHaveClass('s-button--flat')
  })

  it('flat and elevation set inline shadow variables', () => {
    const { container } = render(SButton, { props: { flat: true }, slots: { default: 'OK' } })
    expect(container.querySelector('.s-button')?.getAttribute('style')).toContain(
      '--s-button-elevation: none',
    )
  })

  it('elevation overrides flat and raises the shadow on hover', () => {
    const { container } = render(SButton, {
      props: { flat: true, elevation: 2 },
      slots: { default: 'OK' },
    })
    const style = container.querySelector('.s-button')?.getAttribute('style') ?? ''
    expect(style).toContain('--s-button-elevation: var(--s-elevation-2)')
    expect(style).toContain('--s-button-elevation-hover: var(--s-elevation-3)')
  })

  it.each([
    ['sm', '16'],
    ['md', '18'],
    ['lg', '20'],
  ] as const)('size %s draws %spx icons', (size, px) => {
    const { container } = render(SButton, {
      props: { size, icon: 'star', iconRight: 'x' },
      slots: { default: 'Save' },
    })
    const icons = container.querySelectorAll('svg')
    expect(icons).toHaveLength(2)
    icons.forEach((icon) => expect(icon).toHaveAttribute('width', px))
  })

  it('loading keeps the content, so the accessible name stays', () => {
    render(SButton, { props: { loading: true, icon: 'star' }, slots: { default: 'Save' } })
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })
})
