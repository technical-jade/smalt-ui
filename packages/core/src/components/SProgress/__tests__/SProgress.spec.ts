import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SProgress } from '../index'

describe('SProgress', () => {
  it('renders a progressbar with the current value', () => {
    render(SProgress, { props: { value: 40, label: 'Loading' } })
    const bar = screen.getByRole('progressbar', { name: 'Loading' })
    expect(bar).toHaveAttribute('aria-valuenow', '40')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('applies the size and variant classes', () => {
    const { container } = render(SProgress, {
      props: { value: 10, size: 'lg', variant: 'positive' },
    })
    expect(container.querySelector('.s-progress')).toHaveClass(
      's-progress--lg',
      's-progress--positive',
    )
  })

  it('takes max into account when computing the fill', () => {
    const { container } = render(SProgress, { props: { value: 5, max: 10 } })
    const indicator = container.querySelector('.s-progress__indicator')
    expect(indicator?.getAttribute('style')).toContain('translateX(-50%)')
  })

  it('without value: indeterminate mode (data-state=indeterminate)', () => {
    render(SProgress, { props: { label: 'Loading' } })
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toHaveAttribute(
      'data-state',
      'indeterminate',
    )
  })

  it.each([
    [150, 100, '100'],
    [-5, 100, '0'],
    [30, 0, '30'],
  ])('value %s of max %s is announced as drawn', (value, max, now) => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(SProgress, { props: { value, max } })
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', now)
    expect(Number(bar.getAttribute('aria-valuemax'))).toBeGreaterThan(0)
    expect(errors).not.toHaveBeenCalled()
    errors.mockRestore()
  })
})

/** Ring geometry the component draws, recomputed so the expectations are not magic numbers. */
function ring(diameter: number, thickness: number) {
  const radius = (diameter - thickness) / 2
  return { radius, circumference: 2 * Math.PI * radius }
}

const MD_RING = ring(48, 4)

describe('SProgress · circular', () => {
  it('draws a ring: an svg with a track and an indicator circle', () => {
    const { container } = render(SProgress, { props: { value: 40, circular: true } })
    const root = container.querySelector('.s-progress')
    expect(root).toHaveClass('s-progress--circular')
    const svg = root?.querySelector('svg.s-progress__svg')
    expect(svg).toBeInTheDocument()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 48 48')
    expect(svg?.querySelector('circle.s-progress__track')).toBeInTheDocument()
    const indicator = svg?.querySelector('circle.s-progress__indicator')
    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveAttribute('r', String(MD_RING.radius))
  })

  it('exposes the same aria attributes as the linear form', () => {
    const linear = render(SProgress, { props: { value: 40, label: 'Uploading' } })
    const circular = render(SProgress, { props: { value: 40, label: 'Uploading', circular: true } })
    const attributes = (result: ReturnType<typeof render>) => {
      const bar = result.container.querySelector('[role="progressbar"]')!
      return Object.fromEntries(
        ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-label', 'data-state'].map(
          (name) => [name, bar.getAttribute(name)],
        ),
      )
    }
    expect(attributes(circular)).toEqual(attributes(linear))
    expect(attributes(circular)['aria-valuenow']).toBe('40')
  })

  it.each([
    [0, 100],
    [50, 100],
    [100, 100],
    [6, 8],
  ])('value %s of max %s sets the matching stroke-dashoffset', (value, max) => {
    const { container } = render(SProgress, { props: { value, max, circular: true } })
    const indicator = container.querySelector('.s-progress__indicator')
    const expected = (MD_RING.circumference * (max - value)) / max
    expect(indicator).toHaveAttribute('stroke-dashoffset', String(expected))
    expect(indicator).toHaveAttribute(
      'stroke-dasharray',
      `${MD_RING.circumference} ${MD_RING.circumference}`,
    )
  })

  it('show-value prints the percentage in the middle', () => {
    render(SProgress, { props: { value: 6, max: 8, circular: true, showValue: true } })
    expect(screen.getByText('75%')).toHaveClass('s-progress__value')
  })

  it('without show-value the middle stays empty', () => {
    const { container } = render(SProgress, { props: { value: 40, circular: true } })
    expect(container.querySelector('.s-progress__value')).toBeNull()
  })

  it('the default slot wins over show-value', () => {
    render(SProgress, {
      props: { value: 40, circular: true, showValue: true },
      slots: { default: '<span data-testid="middle">{{ params.percentage }} done</span>' },
    })
    expect(screen.getByTestId('middle')).toHaveTextContent('40 done')
    expect(screen.queryByText('40%')).toBeNull()
  })

  it('indeterminate: no value, a spinning arc and the hidden loading label', () => {
    const { container } = render(SProgress, { props: { circular: true } })
    const bar = screen.getByRole('progressbar')
    expect(bar).not.toHaveAttribute('aria-valuenow')
    expect(bar).toHaveAttribute('data-state', 'indeterminate')
    expect(bar).toHaveAccessibleName('Loading')
    const indicator = container.querySelector('.s-progress__indicator')
    expect(indicator).toHaveAttribute(
      'stroke-dasharray',
      `${MD_RING.circumference / 4} ${MD_RING.circumference}`,
    )
    expect(indicator).toHaveAttribute('stroke-dashoffset', '0')
  })

  it('thickness reaches the stroke width and the radius', () => {
    const { container } = render(SProgress, { props: { value: 50, circular: true, thickness: 10 } })
    const expected = ring(48, 10)
    for (const circle of container.querySelectorAll('.s-progress__svg circle')) {
      expect(circle).toHaveAttribute('stroke-width', '10')
      expect(circle).toHaveAttribute('r', String(expected.radius))
    }
  })

  it('size sets the ring diameter and the default thickness', () => {
    const { container } = render(SProgress, { props: { value: 50, circular: true, size: 'lg' } })
    expect(container.querySelector('.s-progress__svg')).toHaveAttribute('viewBox', '0 0 64 64')
    expect(container.querySelector('.s-progress__indicator')).toHaveAttribute('stroke-width', '6')
  })

  it('keeps the linear form when circular is not set', () => {
    const { container } = render(SProgress, { props: { value: 40 } })
    expect(container.querySelector('svg')).toBeNull()
    expect(container.querySelector('.s-progress')).not.toHaveClass('s-progress--circular')
  })
})
