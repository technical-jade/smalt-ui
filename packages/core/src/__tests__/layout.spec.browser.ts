import { describe, expect, it } from 'vitest'

// Layout utilities resolve only in a browser: happy-dom applies no media queries.
describe('.s-container', () => {
  function container(className: string) {
    const el = document.createElement('div')
    el.className = className
    document.body.append(el)
    return el
  }

  it('is capped by the breakpoint width on a wide screen', () => {
    expect(getComputedStyle(container('s-container')).maxWidth).not.toBe('none')
  })

  it('--fluid removes the cap on every breakpoint', () => {
    expect(getComputedStyle(container('s-container s-container--fluid')).maxWidth).toBe('none')
  })
})
