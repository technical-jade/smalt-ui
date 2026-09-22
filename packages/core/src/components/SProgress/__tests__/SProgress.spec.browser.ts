import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { SProgress } from '../index'

/**
 * The ring lives in an SVG namespace and is drawn by the stroke dash: happy-dom neither builds
 * the namespace nor measures anything, so a circle that renders as an unknown HTML element and
 * paints nothing would still pass the unit tests.
 */
describe('SProgress · browser', () => {
  it('renders real SVG circles of the declared size', () => {
    const { container } = render(SProgress, { props: { value: 50, circular: true } })
    const svg = container.querySelector('.s-progress__svg')!
    expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg')
    const indicator = container.querySelector('.s-progress__indicator')!
    expect(indicator).toBeInstanceOf(SVGCircleElement)
    const box = svg.getBoundingClientRect()
    expect(box.width).toBe(48)
    expect(box.height).toBe(48)
  })

  it('the arc is painted with the variant color and a round cap', () => {
    const { container } = render(SProgress, {
      props: { value: 50, circular: true, color: 'teal' },
    })
    const styles = getComputedStyle(container.querySelector('.s-progress__indicator')!)
    expect(styles.strokeLinecap).toBe('round')
    expect(styles.fill).toBe('none')
    expect(styles.stroke).not.toBe('none')
  })

  it('the value sits in the middle of the ring', () => {
    const { container } = render(SProgress, {
      props: { value: 50, circular: true, showValue: true },
    })
    const ring = container.querySelector('.s-progress__svg')!.getBoundingClientRect()
    const value = container.querySelector('.s-progress__value')!.getBoundingClientRect()
    expect(Math.abs((value.left + value.right) / 2 - (ring.left + ring.right) / 2)).toBeLessThan(1)
    expect(Math.abs((value.top + value.bottom) / 2 - (ring.top + ring.bottom) / 2)).toBeLessThan(1)
  })
})
