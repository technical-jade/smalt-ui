import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { h } from 'vue'
import { SIcon } from '../index'

const path = () => h('path', { d: 'M5 12h14' })

describe('SIcon', () => {
  it('color sets a palette color (otherwise currentColor from the parent)', () => {
    const { container } = render(SIcon, { props: { color: 'teal' }, slots: { default: path } })
    const svg = container.querySelector('svg.s-icon') as SVGElement
    expect(svg.getAttribute('style') ?? '').toContain('color: var(--s-teal)')
    const plain = render(SIcon, { slots: { default: path } })
    expect(plain.container.querySelector('svg.s-icon')?.getAttribute('style')).toBeNull()
  })

  it('renders an svg with the slot content', () => {
    const { container } = render(SIcon, { slots: { default: path } })
    const svg = container.querySelector('svg.s-icon')
    expect(svg).not.toBeNull()
    expect(svg?.querySelector('path')).not.toBeNull()
  })

  it('applies the size from the token (md → 20px)', () => {
    const { container } = render(SIcon, { slots: { default: path } })
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('20')
    expect(svg.getAttribute('height')).toBe('20')
  })

  it('accepts a numeric size', () => {
    const { container } = render(SIcon, { props: { size: 32 }, slots: { default: path } })
    expect(container.querySelector('svg')!.getAttribute('width')).toBe('32')
  })

  it('is hidden from screen readers without label (aria-hidden)', () => {
    const { container } = render(SIcon, { slots: { default: path } })
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('aria-hidden')).toBe('true')
    expect(svg.getAttribute('role')).toBeNull()
  })

  it('gets role=img and aria-label with label', () => {
    const { container } = render(SIcon, { props: { label: 'Arrow' }, slots: { default: path } })
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('role')).toBe('img')
    expect(svg.getAttribute('aria-label')).toBe('Arrow')
    expect(svg.getAttribute('aria-hidden')).toBeNull()
  })

  it('resolves an icon by name from the registry', () => {
    const { container } = render(SIcon, { props: { icon: 'chevron-down' } })
    const p = container.querySelector('svg path')
    expect(p?.getAttribute('d')).toBe('m6 9 6 6 6-6')
  })

  it('renders a multi-node icon (circle + path)', () => {
    const { container } = render(SIcon, { props: { icon: 'info' } })
    const svg = container.querySelector('svg')!
    expect(svg.querySelector('circle')).not.toBeNull()
    expect(svg.querySelectorAll('path')).toHaveLength(2)
  })

  it('accepts a raw SVG path as the icon value', () => {
    const { container } = render(SIcon, { props: { icon: 'M5 12h14' } })
    expect(container.querySelector('svg path')?.getAttribute('d')).toBe('M5 12h14')
  })

  it('the slot overrides the icon prop', () => {
    const { container } = render(SIcon, {
      props: { icon: 'chevron-down' },
      slots: { default: () => h('path', { d: 'M1 1' }) },
    })
    const paths = container.querySelectorAll('svg path')
    expect(paths).toHaveLength(1)
    expect(paths[0]?.getAttribute('d')).toBe('M1 1')
  })

  it('an unknown name renders nothing', () => {
    const { container } = render(SIcon, { props: { icon: 'no-such-icon' } })
    expect(container.querySelector('svg path')).toBeNull()
    expect(container.querySelector('svg circle')).toBeNull()
  })

  it('accepts a CSS length and puts it in the style', () => {
    const { container } = render(SIcon, { props: { icon: 'x', size: '1em' } })
    const svg = container.querySelector('svg')!
    expect(svg.style.width).toBe('1em')
    expect(svg.style.height).toBe('1em')
    expect(svg).not.toHaveAttribute('width')
  })
})
