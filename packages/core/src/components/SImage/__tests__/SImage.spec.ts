import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SImage } from '../index'

const SRC = '/media/cover.jpg'
const OTHER_SRC = '/media/other.jpg'
const FALLBACK = '/media/fallback.jpg'

const renderImage = (props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) =>
  render(SImage, { props: { src: SRC, alt: 'Mountain lake', ...props }, ...options })

const img = () => screen.getByRole('img', { name: 'Mountain lake' }) as HTMLImageElement
const skeleton = (container: Element) => container.querySelector('.s-skeleton')

describe('SImage', () => {
  it('renders the image with its source, alternative text and lazy loading', () => {
    renderImage({ srcset: '/media/cover-2x.jpg 2x', sizes: '(min-width: 40rem) 20rem, 100vw' })
    expect(img()).toHaveAttribute('src', SRC)
    expect(img()).toHaveAttribute('srcset', '/media/cover-2x.jpg 2x')
    expect(img()).toHaveAttribute('sizes', '(min-width: 40rem) 20rem, 100vw')
    expect(img()).toHaveAttribute('loading', 'lazy')
    expect(img()).toHaveAttribute('decoding', 'async')
  })

  it('loads eagerly when lazy is off', () => {
    renderImage({ lazy: false })
    expect(img()).toHaveAttribute('loading', 'eager')
    expect(img()).not.toHaveAttribute('decoding')
  })

  it('applies fit and position to the image', () => {
    renderImage({ fit: 'contain', position: 'top left' })
    expect(img().style.objectFit).toBe('contain')
    expect(img().style.objectPosition).toBe('top left')
  })

  it('wraps the image in an aspect ratio box when ratio is set', () => {
    const { container } = renderImage({ ratio: 16 / 9 })
    const wrapper = container.querySelector('[data-reka-aspect-ratio-wrapper]')
    expect(wrapper?.getAttribute('style')).toContain('padding-bottom: 56.25%')
    expect(container.querySelector('.s-aspect-ratio')).toHaveClass('s-image')
    expect(wrapper?.contains(img())).toBe(true)
  })

  it('renders a plain box without ratio', () => {
    const { container } = renderImage()
    expect(container.querySelector('[data-reka-aspect-ratio-wrapper]')).toBeNull()
    expect(container.firstElementChild).toHaveClass('s-image')
  })

  it('square removes the border radius', () => {
    const { container } = renderImage({ square: true })
    expect(container.querySelector('.s-image')).toHaveClass('s-image--square')
  })

  it('shows the placeholder while loading and removes it once the image loads', async () => {
    const { container, emitted } = renderImage()
    expect(skeleton(container)).not.toBeNull()

    await fireEvent.load(img())

    expect(skeleton(container)).toBeNull()
    expect(emitted().load).toHaveLength(1)
  })

  it('removes the placeholder on error too', async () => {
    const { container } = renderImage()
    await fireEvent.error(img())
    expect(skeleton(container)).toBeNull()
  })

  it('renders no placeholder when it is turned off', () => {
    const { container } = renderImage({ placeholder: false })
    expect(skeleton(container)).toBeNull()
  })

  it('the placeholder slot replaces the skeleton', () => {
    const { container } = renderImage({}, { slots: { placeholder: 'Loading' } })
    expect(skeleton(container)).toBeNull()
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('switches to the fallback source when the image fails', async () => {
    const { emitted } = renderImage({ fallback: FALLBACK })
    await fireEvent.error(img())
    expect(img()).toHaveAttribute('src', FALLBACK)
    expect(emitted().error).toHaveLength(1)
  })

  it('shows the error surface once the fallback fails as well', async () => {
    const { container, emitted } = renderImage({ fallback: FALLBACK })
    await fireEvent.error(img())
    await fireEvent.error(img())

    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('.s-image__error')).toHaveAttribute(
      'aria-label',
      'Mountain lake',
    )
    expect(emitted().error).toHaveLength(2)
  })

  it('shows the error surface right away without a fallback', async () => {
    const { container } = renderImage()
    await fireEvent.error(container.querySelector('img') as HTMLImageElement)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByRole('img', { name: 'Mountain lake' })).toHaveClass('s-image__error')
  })

  it('hides the error surface from assistive technology for a decorative image', async () => {
    const { container } = renderImage({ alt: '' })
    await fireEvent.error(container.querySelector('img') as HTMLImageElement)
    const surface = container.querySelector('.s-image__error')
    expect(surface).toHaveAttribute('aria-hidden', 'true')
    expect(surface).not.toHaveAttribute('role')
  })

  it('the error slot replaces the surface and names itself', async () => {
    const { container } = renderImage({}, { slots: { error: 'Image unavailable' } })
    await fireEvent.error(container.querySelector('img') as HTMLImageElement)
    expect(screen.getByText('Image unavailable')).toBeInTheDocument()
    expect(container.querySelector('.s-image__error')).not.toHaveAttribute('role')
  })

  it('a new source resets the state back to loading', async () => {
    const { container, rerender } = renderImage()
    await fireEvent.load(img())
    expect(skeleton(container)).toBeNull()

    await rerender({ src: OTHER_SRC, alt: 'Mountain lake' })

    expect(img()).toHaveAttribute('src', OTHER_SRC)
    expect(skeleton(container)).not.toBeNull()
  })

  it('a new source brings the image back after a failure', async () => {
    const { container, rerender } = renderImage()
    await fireEvent.error(container.querySelector('img') as HTMLImageElement)
    expect(container.querySelector('img')).toBeNull()

    await rerender({ src: OTHER_SRC, alt: 'Mountain lake' })

    expect(img()).toHaveAttribute('src', OTHER_SRC)
  })
})
