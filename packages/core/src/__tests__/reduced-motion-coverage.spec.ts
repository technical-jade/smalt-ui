import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// An endless animation must calm down for users who asked the system to reduce motion.
const root = resolve(process.cwd(), 'src/components')

const files = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((entry) =>
    readdirSync(`${root}/${entry.name}`)
      .filter((file) => file.endsWith('.scss'))
      .map((file) => `${entry.name}/${file}`),
  )

const endless = files.filter((file) =>
  /animation:[^;]*\binfinite\b/.test(readFileSync(`${root}/${file}`, 'utf8')),
)

describe('reduced motion coverage', () => {
  it('finds the endless animations', () => {
    expect(endless.length).toBeGreaterThan(0)
  })

  it.each(endless)('%s has a prefers-reduced-motion branch', (file) => {
    expect(readFileSync(`${root}/${file}`, 'utf8')).toMatch(
      /@media \(prefers-reduced-motion: reduce\)/,
    )
  })
})
