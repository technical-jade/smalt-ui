import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { STimeline } from '../index'
import type { STimelineItem } from '../types'

const items: STimelineItem[] = [
  { value: 'created', title: 'Order created', description: 'Paid by card', date: 'Mar 3' },
  { value: 'packed', title: 'Packed', date: 'Mar 4' },
  { value: 'shipped', title: 'Shipped', date: 'Mar 5' },
]

describe('STimeline', () => {
  it('renders every item as a list item', () => {
    render(STimeline, { props: { items } })
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('Order created')).toBeInTheDocument()
    expect(screen.getByText('Paid by card')).toBeInTheDocument()
    expect(screen.getByText('Mar 3')).toBeInTheDocument()
  })

  it('marks nothing as completed without a model value', () => {
    const { container } = render(STimeline, { props: { items } })
    expect(container.querySelectorAll('.s-timeline__item--completed')).toHaveLength(0)
    expect(container.querySelectorAll('.s-timeline__item--active')).toHaveLength(0)
  })

  it('splits the feed into completed, current and upcoming items', () => {
    const { container } = render(STimeline, { props: { items, modelValue: 'packed' } })
    const rendered = container.querySelectorAll('.s-timeline__item')
    expect(rendered[0]).toHaveClass('s-timeline__item--completed')
    expect(rendered[1]).toHaveClass('s-timeline__item--active')
    expect(rendered[2]).not.toHaveClass('s-timeline__item--completed')
    expect(rendered[2]).not.toHaveClass('s-timeline__item--active')
  })

  it('addresses items without a value by index', () => {
    const { container } = render(STimeline, {
      props: { items: [{ title: 'First' }, { title: 'Second' }], modelValue: 1 },
    })
    const rendered = container.querySelectorAll('.s-timeline__item')
    expect(rendered[0]).toHaveClass('s-timeline__item--completed')
    expect(rendered[1]).toHaveClass('s-timeline__item--active')
  })

  it('draws a rail segment after every item but the last', () => {
    const { container } = render(STimeline, { props: { items } })
    expect(container.querySelectorAll('.s-timeline__line')).toHaveLength(2)
  })

  it('renders the item icon instead of the dot', () => {
    const { container } = render(STimeline, {
      props: { items: [{ title: 'Delivered', icon: 'package' }] },
    })
    expect(container.querySelector('.s-timeline__indicator svg')).toBeInTheDocument()
  })

  it('shows a check mark on completed items only', () => {
    const { container } = render(STimeline, { props: { items, modelValue: 'packed' } })
    const indicators = container.querySelectorAll('.s-timeline__indicator')
    expect(indicators[0].querySelector('svg')).toBeInTheDocument()
    expect(indicators[1].querySelector('svg')).toBeNull()
    expect(indicators[2].querySelector('svg')).toBeNull()
  })

  it('passes the item state to the scoped slots', () => {
    render(STimeline, {
      props: { items, modelValue: 'packed' },
      slots: {
        title: `
          <template #title="{ item, index, active, completed }">
            <span>{{ index }}:{{ item.title }}:{{ active }}:{{ completed }}</span>
          </template>
        `,
      },
    })
    expect(screen.getByText('0:Order created:false:true')).toBeInTheDocument()
    expect(screen.getByText('1:Packed:true:false')).toBeInTheDocument()
    expect(screen.getByText('2:Shipped:false:false')).toBeInTheDocument()
  })

  it('the indicator slot replaces the dot content', () => {
    const { container } = render(STimeline, {
      props: { items: [{ title: 'Delivered', icon: 'package' }] },
      slots: { indicator: '<span class="custom-dot">1</span>' },
    })
    expect(container.querySelector('.custom-dot')).toBeInTheDocument()
    expect(container.querySelector('.s-timeline__indicator svg')).toBeNull()
  })

  it('applies the orientation and size classes', () => {
    const { container } = render(STimeline, {
      props: { items, orientation: 'horizontal', size: 'lg' },
    })
    const root = container.querySelector('.s-timeline')
    expect(root).toHaveClass('s-timeline--horizontal')
    expect(root).toHaveClass('s-timeline--lg')
  })

  it('is a vertical medium feed by default', () => {
    const { container } = render(STimeline, { props: { items } })
    const root = container.querySelector('.s-timeline')
    expect(root).toHaveClass('s-timeline--vertical')
    expect(root).toHaveClass('s-timeline--md')
  })

  it('marks a disabled item for the shared disabled state', () => {
    const { container } = render(STimeline, {
      props: { items: [{ title: 'Cancelled', disabled: true }, { title: 'Done' }] },
    })
    const rendered = container.querySelectorAll('.s-timeline__item')
    expect(rendered[0]).toHaveAttribute('data-disabled')
    expect(rendered[1]).not.toHaveAttribute('data-disabled')
  })

  it('an item accent overrides the timeline color', () => {
    const { container } = render(STimeline, {
      props: { items: [{ title: 'Failed', color: 'negative' }], color: 'teal' },
    })
    expect(container.querySelector<HTMLElement>('.s-timeline')?.style.cssText).toContain(
      '--s-timeline-c: var(--s-teal)',
    )
    expect(container.querySelector<HTMLElement>('.s-timeline__item')?.style.cssText).toContain(
      '--s-timeline-item-c: var(--s-negative)',
    )
  })

  it('an item carries its own content color for a completed indicator', () => {
    const { container } = render(STimeline, {
      props: { items: [{ title: 'Shipped', color: 'amber', textColor: 'gray-900' }] },
    })

    const style = container.querySelector<HTMLElement>('.s-timeline__item')?.style.cssText
    expect(style).toContain('--s-timeline-item-c: var(--s-amber)')
    expect(style).toContain('--s-timeline-item-c-on: var(--s-gray-900)')
  })

  it('leaves the content color to the timeline when the item has none', () => {
    const { container } = render(STimeline, {
      props: { items: [{ title: 'Shipped', color: 'amber' }] },
    })

    expect(container.querySelector<HTMLElement>('.s-timeline__item')?.style.cssText).not.toContain(
      '--s-timeline-item-c-on',
    )
  })
})
