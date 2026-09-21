import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SPagination } from '../index'

describe('SPagination', () => {
  it('renders page buttons from total/itemsPerPage', () => {
    render(SPagination, { props: { total: 30, itemsPerPage: 10, page: 2 } })
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument()
  })

  it('emits update:page when a page is selected', async () => {
    const { emitted } = render(SPagination, { props: { total: 30, itemsPerPage: 10, page: 1 } })
    await fireEvent.click(screen.getByRole('button', { name: 'Page 3' }))
    expect(emitted()['update:page'][0]).toEqual([3])
  })

  it('highlights the active page with the primary variant', () => {
    render(SPagination, { props: { total: 30, itemsPerPage: 10, page: 2 } })
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveClass('s-button--primary')
  })

  it('the Previous button is disabled on the first page', () => {
    render(SPagination, { props: { total: 30, itemsPerPage: 10, page: 1 } })
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
  })

  it('the Next button is disabled on the last page', () => {
    render(SPagination, { props: { total: 30, itemsPerPage: 10, page: 3 } })
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('uses chevron-left/chevron-right for navigation by default', () => {
    const { container } = render(SPagination, { props: { total: 30, itemsPerPage: 10, page: 2 } })
    expect(container.querySelector('[aria-label="Previous page"] path')).toHaveAttribute(
      'd',
      'm15 18-6-6 6-6',
    )
    expect(container.querySelector('[aria-label="Next page"] path')).toHaveAttribute(
      'd',
      'm9 18 6-6-6-6',
    )
  })

  it('uses the icons from the prevIcon/nextIcon props', () => {
    const { container } = render(SPagination, {
      props: {
        total: 30,
        itemsPerPage: 10,
        page: 2,
        prevIcon: 'chevron-up',
        nextIcon: 'chevron-down',
      },
    })
    expect(container.querySelector('[aria-label="Previous page"] path')).toHaveAttribute(
      'd',
      'm18 15-6-6-6 6',
    )
    expect(container.querySelector('[aria-label="Next page"] path')).toHaveAttribute(
      'd',
      'm6 9 6 6 6-6',
    )
  })

  it('clamps the page when the page count drops', async () => {
    const { emitted, rerender } = render(SPagination, { props: { total: 100, page: 8 } })
    await rerender({ total: 20, page: 8 })
    expect(emitted()['update:page']?.at(-1)).toEqual([2])
  })
})
