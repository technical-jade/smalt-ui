import { afterEach, describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { SCard } from '../components/SCard'

/** RGB channels (0–255) of the first visible color in a computed `box-shadow`. */
function firstShadowColor(shadow: string): number[] {
  const colors = shadow.match(/color\(srgb[^)]*\)|rgba?\([^)]*\)/g) ?? []
  for (const color of colors) {
    const [r, g, b, a = 1] = color.match(/[\d.]+/g)!.map(Number)
    if (a === 0) continue
    return color.startsWith('color(') ? [r! * 255, g! * 255, b! * 255] : [r!, g!, b!]
  }
  throw new Error(`no shadow color in ${shadow}`)
}

// A black shadow vanishes on a dark page: the dark theme draws elevation with a light shadow.
describe('elevation per theme', () => {
  afterEach(() => document.documentElement.removeAttribute('data-theme'))

  it.each([
    ['light', (channel: number) => channel < 50],
    ['dark', (channel: number) => channel > 200],
  ])('%s theme', (theme, expected) => {
    document.documentElement.setAttribute('data-theme', theme)
    const { container } = render(SCard, { props: { elevation: 3 }, slots: { default: 'Card' } })
    const shadow = getComputedStyle(container.querySelector('.s-card')!).boxShadow
    expect(firstShadowColor(shadow).every(expected)).toBe(true)
  })
})
