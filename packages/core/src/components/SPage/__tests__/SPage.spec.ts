import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SPage } from '../index'

const content = (container: Element) =>
  container.querySelector<HTMLElement>('.s-page__content')!

describe('SPage', () => {
  it('is the main landmark and renders the content', () => {
    render(SPage, { slots: { default: 'Reports' } })

    const main = screen.getByRole('main')
    expect(main).toHaveClass('s-page', 's-page--padded')
    expect(main).toHaveTextContent('Reports')
  })

  it('drops the landmark role when the area is not the page content', () => {
    const { container } = render(SPage, { props: { landmark: false } })
    expect(container.querySelector('.s-page')).not.toHaveAttribute('role')
  })

  it('drops the padding on demand', () => {
    const { container } = render(SPage, { props: { padded: false } })
    expect(container.querySelector('.s-page')).not.toHaveClass('s-page--padded')
  })

  it('wraps the content in the container utility on demand', () => {
    const { container } = render(SPage)
    expect(content(container)).not.toHaveClass('s-container')

    const wrapped = render(SPage, { props: { container: true } })
    expect(content(wrapped.container)).toHaveClass('s-container')
  })

  it('caps the content width, taking a number as pixels', () => {
    const { container } = render(SPage, { props: { maxWidth: 960 } })
    expect(content(container).style.getPropertyValue('--s-page-max-width')).toBe('960px')

    const css = render(SPage, { props: { maxWidth: '60rem' } })
    expect(content(css.container).style.getPropertyValue('--s-page-max-width')).toBe('60rem')
  })

  it('caps the container width with the same value', () => {
    const { container } = render(SPage, { props: { container: true, maxWidth: '72rem' } })
    expect(content(container).style.getPropertyValue('--s-container-max-width')).toBe('72rem')
  })

  it('leaves the width variables alone without the prop', () => {
    const { container } = render(SPage)
    expect(content(container).style.getPropertyValue('--s-page-max-width')).toBe('')
  })
})
