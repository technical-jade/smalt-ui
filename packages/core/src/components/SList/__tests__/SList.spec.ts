import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SList } from '../index'
import { SListItem } from '../../SListItem'

describe('SList', () => {
  it('renders a list with its rows', () => {
    render(SList, {
      props: { label: 'Recent files' },
      slots: {
        default: ['<div role="listitem">Report</div>', '<div role="listitem">Invoice</div>'].join(
          '',
        ),
      },
    })

    expect(screen.getByRole('list', { name: 'Recent files' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('has no accessible name without the label prop', () => {
    render(SList, { slots: { default: '<div role="listitem">Report</div>' } })
    expect(screen.getByRole('list')).not.toHaveAttribute('aria-label')
  })

  it('applies the variant and size classes', () => {
    const { container } = render(SList, {
      props: { variant: 'divided', size: 'lg' },
      slots: { default: '<div role="listitem">Report</div>' },
    })

    const list = container.querySelector('.s-list')
    expect(list).toHaveClass('s-list--divided', 's-list--lg')
  })

  it('is plain and medium by default', () => {
    const { container } = render(SList, { slots: { default: '<div role="listitem">Report</div>' } })
    expect(container.querySelector('.s-list')).toHaveClass('s-list--plain', 's-list--md')
  })

  it('renders SListItem children', () => {
    render(SList, {
      global: { components: { SListItem } },
      slots: { default: '<SListItem title="Report" description="Updated today" />' },
    })

    expect(screen.getByText('Report')).toBeInTheDocument()
    expect(screen.getByRole('listitem')).toBeInTheDocument()
  })
})
