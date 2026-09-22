import { describe, expect, it } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SImage } from '../index'

const SRC = '/media/cover.jpg'

describe('SImage · a11y', () => {
  it('has no violations while loading', async () => {
    const { container } = render(SImage, { props: { src: SRC, alt: 'Mountain lake' } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations after the image loads', async () => {
    const { container } = render(SImage, {
      props: { src: SRC, alt: 'Mountain lake', ratio: 16 / 9 },
    })
    await fireEvent.load(container.querySelector('img') as HTMLImageElement)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations for a decorative image', async () => {
    const { container } = render(SImage, { props: { src: SRC, alt: '' } })
    await fireEvent.load(container.querySelector('img') as HTMLImageElement)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations on the error surface', async () => {
    const { container } = render(SImage, { props: { src: SRC, alt: 'Mountain lake' } })
    await fireEvent.error(container.querySelector('img') as HTMLImageElement)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations on the error surface of a decorative image', async () => {
    const { container } = render(SImage, { props: { src: SRC, alt: '' } })
    await fireEvent.error(container.querySelector('img') as HTMLImageElement)
    expect(await axe(container)).toHaveNoViolations()
  })
})
