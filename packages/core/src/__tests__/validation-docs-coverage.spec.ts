import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Every validatable field points the consumer at the guide for its value type and for what
 * `required()` treats as empty, so a field missing from the table sends them to a page that
 * says nothing about it.
 */
const root = resolve(process.cwd(), 'src')

const validatableComponents = readdirSync(`${root}/components`, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => {
    const types = `${root}/components/${name}/types.ts`
    try {
      return /extends\s+[^{]*\bSValidationProps\b/.test(readFileSync(types, 'utf8'))
    } catch {
      return false
    }
  })

describe('value types table in the validation guide', () => {
  const guide = readFileSync(resolve(root, '../../../apps/docs/guide/validation.md'), 'utf8')
  const table = guide.slice(guide.indexOf('## Value types'))
  const listed = new Set([...table.matchAll(/^\|\s*`(S\w+)`\s*\|/gm)].map(([, name]) => name))

  it('finds the validatable components', () => {
    expect(validatableComponents.length).toBeGreaterThan(15)
  })

  for (const name of validatableComponents) {
    it(`${name} has a row`, () => {
      expect(listed.has(name), `${name}: add a row to the Value types table`).toBe(true)
    })
  }
})
