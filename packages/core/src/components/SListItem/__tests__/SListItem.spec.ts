import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SListItem } from '../index'

describe('SListItem', () => {
  it('renders the title, the description and the icon', () => {
    const { container } = render(SListItem, {
      props: { title: 'Report', description: 'Updated today', icon: 'check' },
    })

    expect(screen.getByText('Report')).toHaveClass('s-list-item__title')
    expect(screen.getByText('Updated today')).toHaveClass('s-list-item__description')
    expect(container.querySelector('.s-list-item__prepend svg')).toBeInTheDocument()
  })

  it('the default slot replaces the title and the description', () => {
    render(SListItem, {
      props: { title: 'Report' },
      slots: { default: '<span>Raw content</span>' },
    })

    expect(screen.getByText('Raw content')).toBeInTheDocument()
    expect(screen.queryByText('Report')).not.toBeInTheDocument()
  })

  it('renders the prepend and append slots', () => {
    render(SListItem, {
      props: { title: 'Report' },
      slots: { prepend: '<span>avatar</span>', append: '<span>2 MB</span>' },
    })

    expect(screen.getByText('avatar').parentElement).toHaveClass('s-list-item__prepend')
    expect(screen.getByText('2 MB').parentElement).toHaveClass('s-list-item__append')
  })

  it('marks the active and the disabled row', () => {
    const { container } = render(SListItem, {
      props: { title: 'Report', active: true, disabled: true },
    })

    const root = container.querySelector('.s-list-item')
    expect(root).toHaveClass('s-list-item--active', 's-list-item--disabled')
    expect(container.querySelector('.s-list-item__row')).toHaveAttribute('data-active')
  })

  it('a plain row is a div and is not interactive', () => {
    const { container } = render(SListItem, { props: { title: 'Report' } })

    const row = container.querySelector('.s-list-item__row')
    expect(row?.tagName).toBe('DIV')
    expect(row).not.toHaveClass('s-list-item__row--interactive')
  })

  it('renders a link row as an anchor', () => {
    render(SListItem, { props: { title: 'Billing', href: '/billing', active: true } })

    const link = screen.getByRole('link', { name: 'Billing' })
    expect(link).toHaveAttribute('href', '/billing')
    expect(link).toHaveAttribute('aria-current', 'true')
    expect(link).toHaveClass('s-list-item__row--interactive')
  })

  it('renders a clickable row as a button and emits the click', async () => {
    const onClick = vi.fn()
    render(SListItem, { props: { title: 'Export', clickable: true }, attrs: { onClick } })

    const button = screen.getByRole('button', { name: 'Export' })
    expect(button).toHaveAttribute('type', 'button')

    await fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('a disabled button row neither activates nor takes focus', async () => {
    const onClick = vi.fn()
    render(SListItem, {
      props: { title: 'Archive', clickable: true, disabled: true },
      attrs: { onClick },
    })

    const button = screen.getByRole('button', { name: 'Archive' })
    expect(button).toBeDisabled()

    await fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('a disabled link row leaves the tab order and swallows the click', async () => {
    const onClick = vi.fn()
    render(SListItem, {
      props: { title: 'Deleted', href: '/deleted', disabled: true },
      attrs: { onClick },
    })

    const link = screen.getByRole('link', { name: 'Deleted' })
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('tabindex', '-1')

    await fireEvent.click(link)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('stays a listitem as a div, a link and a button', () => {
    for (const props of [{}, { href: '/x' }, { clickable: true }]) {
      const { container, unmount } = render(SListItem, { props: { title: 'Row', ...props } })
      expect(container.querySelector('[role="listitem"]')).toHaveClass('s-list-item')
      unmount()
    }
  })

  it('keeps the consumer class on the wrapper and passes the rest to the row', () => {
    const { container } = render(SListItem, {
      props: { title: 'Report', href: '/report' },
      attrs: { class: 'custom', target: '_blank' },
    })

    expect(container.querySelector('.s-list-item')).toHaveClass('custom')
    expect(container.querySelector('.s-list-item__row')).toHaveAttribute('target', '_blank')
  })
})
