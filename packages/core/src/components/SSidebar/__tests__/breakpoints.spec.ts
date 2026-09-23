import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SIDEBAR_BREAKPOINTS } from '../breakpoints'

/**
 * The drawer switch reads the breakpoint in JavaScript while the stylesheet reads it from the
 * SCSS map, so the two copies have to agree; otherwise the column would disappear at one width
 * and the drawer appear at another.
 */
describe('sidebar breakpoints', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/styles/settings/_variables.scss'), 'utf8')
  const map = source.match(/\$breakpoints:\s*\(([^)]*)\)/)![1]
  const scss = Object.fromEntries(
    [...map.matchAll(/(\w+):\s*(\d+)(px)?/g)].map(([, name, value]) => [name, Number(value)]),
  )

  it('reads the SCSS map', () => {
    expect(Object.keys(scss)).toContain('md')
  })

  it('mirrors every name the prop accepts', () => {
    for (const [name, value] of Object.entries(SIDEBAR_BREAKPOINTS)) {
      expect(scss[name], `$breakpoints.${name} changed in the SCSS map`).toBe(value)
    }
  })
})
