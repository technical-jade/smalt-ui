import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { nextTick } from 'vue'
import { SImage } from '../index'

/**
 * Real loading: happy-dom never fetches an image and reports `complete` with a zero
 * `naturalWidth` for every one of them, so neither the load path nor the cached-image shortcut
 * can be observed there.
 */
const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
const MISSING = '/s-image-does-not-exist.png'

const skeleton = (container: Element) => container.querySelector('.s-skeleton')

describe('SImage · browser', () => {
  it('a decoded image clears the placeholder and emits load', async () => {
    const { container, emitted } = render(SImage, { props: { src: PIXEL, alt: 'Pixel' } })
    expect(skeleton(container)).not.toBeNull()

    await vi.waitFor(() => expect(skeleton(container)).toBeNull())
    expect(emitted().load).toHaveLength(1)
  })

  it('a cached image is already complete at mount, so the placeholder never appears', async () => {
    const preload = new Image()
    preload.src = PIXEL
    await preload.decode()

    const { container } = render(SImage, { props: { src: PIXEL, alt: 'Pixel' } })
    await nextTick()

    expect(skeleton(container)).toBeNull()
  })

  it('a missing image loads the fallback instead', async () => {
    const { container } = render(SImage, {
      props: { src: MISSING, alt: 'Pixel', fallback: PIXEL },
    })

    await vi.waitFor(() => expect(skeleton(container)).toBeNull())
    expect(container.querySelector('img')).toHaveAttribute('src', PIXEL)
  })

  it('without a fallback a missing image ends on the error surface', async () => {
    const { container } = render(SImage, { props: { src: MISSING, alt: 'Pixel' } })

    await vi.waitFor(() => expect(container.querySelector('.s-image__error')).not.toBeNull())
    expect(container.querySelector('img')).toBeNull()
  })

  it('fit and position reach the rendered image', async () => {
    const { container } = render(SImage, {
      props: { src: PIXEL, alt: 'Pixel', ratio: 16 / 9, fit: 'contain', position: 'top left' },
    })
    const img = container.querySelector('img') as HTMLImageElement
    const style = getComputedStyle(img)
    expect(style.objectFit).toBe('contain')
    expect(style.objectPosition).toBe('0% 0%')
  })
})
