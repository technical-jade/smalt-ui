import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SRating } from '../index'

describe('SRating', () => {
  it('renders length stars', () => {
    const { container } = render(SRating, { props: { length: 5, ariaLabel: 'Rating' } })
    expect(container.querySelectorAll('.s-rating__item')).toHaveLength(5)
  })

  it('has 5 stars by default', () => {
    const { container } = render(SRating, { props: { ariaLabel: 'Rating' } })
    expect(container.querySelectorAll('.s-rating__item')).toHaveLength(5)
  })

  it('highlights active stars by value', () => {
    const { container } = render(SRating, { props: { modelValue: 3, length: 5 } })
    expect(container.querySelectorAll('.s-rating__item--active')).toHaveLength(3)
  })

  it('renders an accessible group with a name', () => {
    render(SRating, { props: { length: 5, ariaLabel: 'Product rating' } })
    expect(screen.getByRole('radiogroup', { name: 'Product rating' })).toBeInTheDocument()
  })

  it('readonly highlights nothing extra and stays accessible', () => {
    const { container } = render(SRating, {
      props: { modelValue: 4, length: 5, readonly: true, ariaLabel: 'Rating' },
    })
    expect(container.querySelectorAll('.s-rating__item--active')).toHaveLength(4)
  })

  it('readonly keeps items keyboard-focusable and does not mark them disabled', () => {
    const { container } = render(SRating, {
      props: { modelValue: 3, length: 5, readonly: true, ariaLabel: 'Rating' },
    })
    const radios = container.querySelectorAll('[role="radio"]')
    expect(radios[0]).not.toHaveAttribute('data-disabled')
    expect(container.querySelector('.s-rating')).toHaveAttribute('aria-readonly', 'true')
  })

  it('draws the star in the background and foreground layers by default', () => {
    const { container } = render(SRating, { props: { length: 1, ariaLabel: 'Rating' } })
    const bg = container.querySelector('.s-rating__star--bg path')?.getAttribute('d')
    const fg = container.querySelector('.s-rating__star--fg path')?.getAttribute('d')
    expect(bg).toBeTruthy()
    expect(fg).toBeTruthy()
  })

  it('renders a radio for each item', () => {
    const { container } = render(SRating, { props: { length: 5, ariaLabel: 'Rating' } })
    expect(container.querySelectorAll('[role="radio"]')).toHaveLength(5)
  })

  it('clicking an item sets the rating', async () => {
    const { container, emitted } = render(SRating, {
      props: { modelValue: 0, length: 5, ariaLabel: 'Rating' },
    })
    await fireEvent.click(container.querySelectorAll('[role="radio"]')[3])
    expect(emitted('update:modelValue')?.at(-1)).toEqual([4])
  })

  it('allowHalf gives two items per star and selects a half', async () => {
    const { container, emitted } = render(SRating, {
      props: { modelValue: 0, length: 5, allowHalf: true, ariaLabel: 'Rating' },
    })
    const radios = container.querySelectorAll('[role="radio"]')
    expect(radios).toHaveLength(10)
    await fireEvent.click(radios[0])
    expect(emitted('update:modelValue')?.at(-1)).toEqual([0.5])
  })

  it('clearable resets the rating on a repeated click', async () => {
    const { container, emitted } = render(SRating, {
      props: { modelValue: 4, length: 5, clearable: true, ariaLabel: 'Rating' },
    })
    await fireEvent.click(container.querySelectorAll('[role="radio"]')[3])
    expect(emitted('update:modelValue')?.at(-1)).toEqual([0])
  })

  it('readonly prevents changing the rating by click', async () => {
    const { container, emitted } = render(SRating, {
      props: { modelValue: 3, length: 5, readonly: true, ariaLabel: 'Rating' },
    })
    await fireEvent.click(container.querySelectorAll('[role="radio"]')[4])
    expect(emitted('update:modelValue')).toBeUndefined()
  })

  it('disabled prevents changing the rating by click', async () => {
    const { container, emitted } = render(SRating, {
      props: { modelValue: 3, length: 5, disabled: true, ariaLabel: 'Rating' },
    })
    await fireEvent.click(container.querySelectorAll('[role="radio"]')[4])
    expect(emitted('update:modelValue')).toBeUndefined()
  })

  it('draws md-sized items (20px) by default', () => {
    const { container } = render(SRating, { props: { length: 1, ariaLabel: 'Rating' } })
    expect(container.querySelector('.s-rating__star')?.getAttribute('width')).toBe('20')
  })

  it('accepts a size token and a size in pixels', () => {
    const { container: lg } = render(SRating, { props: { length: 1, size: 'lg' } })
    expect(lg.querySelector('.s-rating__star')?.getAttribute('width')).toBe('24')
    expect(lg.querySelector('.s-rating__star')?.getAttribute('height')).toBe('24')

    const { container: px } = render(SRating, { props: { length: 1, size: 40 } })
    expect(px.querySelector('.s-rating__star')?.getAttribute('width')).toBe('40')
    expect(px.querySelector('.s-rating__star')?.getAttribute('height')).toBe('40')
  })

  it('accepts custom item and fill icons', () => {
    const { container } = render(SRating, {
      props: { length: 1, ariaLabel: 'Rating', icon: 'M0 0h24', selectedIcon: 'M2 2h20' },
    })
    expect(container.querySelector('.s-rating__star--bg path')?.getAttribute('d')).toBe('M0 0h24')
    expect(container.querySelector('.s-rating__star--fg path')?.getAttribute('d')).toBe('M2 2h20')
  })

  it('previews the rating under the pointer and restores the value when it leaves', async () => {
    const { container } = render(SRating, { props: { modelValue: 2, ariaLabel: 'Rating' } })
    const active = () => container.querySelectorAll('.s-rating__item--active').length
    await fireEvent.mouseEnter(screen.getByRole('radio', { name: 'Rating 4' }))
    expect(active()).toBe(4)
    await fireEvent.mouseLeave(screen.getByRole('radiogroup'))
    expect(active()).toBe(2)
  })

  it('readonly does not preview on hover', async () => {
    const { container } = render(SRating, {
      props: { modelValue: 2, readonly: true, ariaLabel: 'Rating' },
    })
    await fireEvent.mouseEnter(screen.getByRole('radio', { name: 'Rating 4' }))
    expect(container.querySelectorAll('.s-rating__item--active')).toHaveLength(2)
  })
})
