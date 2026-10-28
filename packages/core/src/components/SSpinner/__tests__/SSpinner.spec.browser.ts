import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { SSpinner } from '../index'

// The variant color comes from SCSS: happy-dom computes no styles.
describe('SSpinner · browser', () => {
  const colorOf = (props: Record<string, unknown>) => {
    const { container } = render(SSpinner, { props })
    return getComputedStyle(container.querySelector('.s-spinner')!).color
  }

  it.each(['neutral', 'current'])('color overrides the color of the %s variant', (variant) => {
    const accent = colorOf({ color: 'teal' })
    expect(colorOf({ color: 'teal', variant })).toBe(accent)
    expect(colorOf({ variant })).not.toBe(accent)
  })
})
