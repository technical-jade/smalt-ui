import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SStat } from '../index'

const base = { label: 'Revenue', value: 1234567 }

describe('SStat', () => {
  it('renders the label, the value and the description', () => {
    render(SStat, { props: { ...base, value: 42, description: 'Last 30 days' } })
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('Last 30 days')).toBeInTheDocument()
  })

  it('names the group with the label', () => {
    render(SStat, { props: base })
    expect(screen.getByRole('group', { name: 'Revenue' })).toBeInTheDocument()
  })

  it('groups the number with its name for a screen reader', () => {
    const { container } = render(SStat, { props: base })
    const group = screen.getByRole('group')
    const label = container.querySelector('.s-stat__label')
    expect(group).toHaveAttribute('aria-labelledby', label?.id)
  })

  it('formats a numeric value with thousands separators', () => {
    render(SStat, { props: base })
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })

  it('formats through Intl options', () => {
    render(SStat, {
      props: {
        label: 'Revenue',
        value: 1234.5,
        formatValue: { style: 'currency', currency: 'USD' },
      },
    })
    expect(screen.getByText('$1,234.50')).toBeInTheDocument()
  })

  it('follows the locale prop', () => {
    render(SStat, { props: { ...base, locale: 'de-DE' } })
    expect(screen.getByText('1.234.567')).toBeInTheDocument()
  })

  it('prints the number as is with formatValue false', () => {
    render(SStat, { props: { ...base, formatValue: false } })
    expect(screen.getByText('1234567')).toBeInTheDocument()
  })

  it('passes a string value through untouched', () => {
    render(SStat, { props: { label: 'Conversion', value: '12.5%' } })
    expect(screen.getByText('12.5%')).toBeInTheDocument()
  })

  it('marks a positive trend and announces its direction', () => {
    const { container } = render(SStat, { props: { ...base, trend: 12.4 } })
    expect(container.querySelector('.s-stat__trend')).toHaveClass('s-stat__trend--up')
    expect(screen.getByText('+12.4')).toBeInTheDocument()
    expect(screen.getByText('Up')).toBeInTheDocument()
  })

  it('marks a negative trend and announces its direction', () => {
    const { container } = render(SStat, { props: { ...base, trend: -3 } })
    expect(container.querySelector('.s-stat__trend')).toHaveClass('s-stat__trend--down')
    expect(screen.getByText('-3')).toBeInTheDocument()
    expect(screen.getByText('Down')).toBeInTheDocument()
  })

  it('leaves a zero trend neutral and without a direction label', () => {
    const { container } = render(SStat, { props: { ...base, trend: 0 } })
    expect(container.querySelector('.s-stat__trend')).toHaveClass('s-stat__trend--flat')
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.queryByText('Up')).toBeNull()
    expect(screen.queryByText('Down')).toBeNull()
  })

  it('overrides the direction labels', () => {
    render(SStat, { props: { ...base, trend: 5, trendUpLabel: 'Growth' } })
    expect(screen.getByText('Growth')).toBeInTheDocument()
    expect(screen.queryByText('Up')).toBeNull()
  })

  it('renders the trend label next to the change', () => {
    render(SStat, { props: { ...base, trend: 5, trendLabel: 'vs last month' } })
    expect(screen.getByText('vs last month')).toBeInTheDocument()
  })

  it('has no trend block without the prop', () => {
    const { container } = render(SStat, { props: base })
    expect(container.querySelector('.s-stat__trend')).toBeNull()
  })

  it('replaces the value and the label with skeletons while loading', () => {
    const { container } = render(SStat, {
      props: { ...base, description: 'Last 30 days', trend: 5, loading: true },
    })
    expect(container.querySelectorAll('.s-skeleton')).toHaveLength(2)
    expect(screen.queryByText('Revenue')).toBeNull()
    expect(screen.queryByText('1,234,567')).toBeNull()
    expect(container.querySelector('.s-stat__trend')).toBeNull()
    expect(container.querySelector('.s-stat__description')).toBeNull()
    expect(container.querySelector('.s-stat')).toHaveAttribute('aria-busy', 'true')
  })

  it('renders the icon through SIcon', () => {
    const { container } = render(SStat, { props: { ...base, icon: 'users' } })
    expect(container.querySelector('.s-stat__icon svg')).toBeInTheDocument()
  })

  it('has no icon block without an icon or the slot', () => {
    const { container } = render(SStat, { props: base })
    expect(container.querySelector('.s-stat__icon')).toBeNull()
  })

  it('renders the value, label, icon, trend, description and actions slots', () => {
    const { container } = render(SStat, {
      props: { ...base, trend: 5 },
      slots: {
        value: '<span class="custom-value">$12K</span>',
        label: 'Monthly revenue',
        icon: '<span class="custom-icon">icon</span>',
        trend: '<span class="custom-trend">steady</span>',
        description: 'Updated a minute ago',
        actions: '<button type="button">Report</button>',
      },
    })
    expect(container.querySelector('.custom-value')).toBeInTheDocument()
    expect(screen.getByText('Monthly revenue')).toBeInTheDocument()
    expect(container.querySelector('.custom-icon')).toBeInTheDocument()
    expect(container.querySelector('.custom-trend')).toBeInTheDocument()
    expect(screen.getByText('Updated a minute ago')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Report' })).toBeInTheDocument()
  })

  it('is a plain medium tile by default', () => {
    const { container } = render(SStat, { props: base })
    const root = container.querySelector('.s-stat')
    expect(root).toHaveClass('s-stat--plain')
    expect(root).toHaveClass('s-stat--md')
    expect(root).not.toHaveClass('s-stat--square')
  })

  it('applies the card variant, the size and the square modifier', () => {
    const { container } = render(SStat, {
      props: { ...base, variant: 'card', size: 'lg', square: true },
    })
    const root = container.querySelector('.s-stat')
    expect(root).toHaveClass('s-stat--card')
    expect(root).toHaveClass('s-stat--lg')
    expect(root).toHaveClass('s-stat--square')
  })

  it('exposes the accent color as an inline variable', () => {
    const { container } = render(SStat, { props: { ...base, icon: 'users', color: 'teal' } })
    expect(container.querySelector<HTMLElement>('.s-stat')?.style.cssText).toContain(
      '--s-stat-c: var(--s-teal)',
    )
  })
})
