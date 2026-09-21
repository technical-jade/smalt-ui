import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SAspectRatio } from '../index'
import { resetDevWarnings } from '../../../internal/dev'

const wrapperStyle = (container: Element) =>
  container.querySelector('[data-reka-aspect-ratio-wrapper]')?.getAttribute('style') ?? ''

describe('SAspectRatio', () => {
  afterEach(() => {
    resetDevWarnings()
    vi.restoreAllMocks()
  })

  it('renders slot content', () => {
    render(SAspectRatio, { slots: { default: 'Content' } })
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('passes the aspect ratio to the wrapper style', () => {
    const { container } = render(SAspectRatio, {
      props: { ratio: 16 / 9 },
      slots: { default: 'X' },
    })
    expect(wrapperStyle(container)).toContain('padding-bottom: 56.25%')
  })

  it('defaults to a 1:1 ratio', () => {
    const { container } = render(SAspectRatio, { slots: { default: 'X' } })
    expect(wrapperStyle(container)).toContain('padding-bottom: 100%')
  })

  it('class and style from the component land on the outer element around the ratio box', () => {
    const { container } = render(SAspectRatio, {
      attrs: { class: 'cover', style: 'max-width: 320px' },
      slots: { default: 'X' },
    })
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('s-aspect-ratio', 'cover')
    expect(root.style.maxWidth).toBe('320px')
    expect(root.querySelector('[data-reka-aspect-ratio-wrapper]')).not.toBeNull()
  })

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'falls back to 1:1 and warns for ratio %s',
    (ratio) => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { container } = render(SAspectRatio, { props: { ratio }, slots: { default: 'X' } })
      expect(wrapperStyle(container)).toContain('padding-bottom: 100%')
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[SAspectRatio]'))
    },
  )

  it('square removes the border radius', () => {
    const { container } = render(SAspectRatio, { props: { square: true } })
    expect(container.querySelector('.s-aspect-ratio')).toHaveClass('s-aspect-ratio--square')
  })
})
