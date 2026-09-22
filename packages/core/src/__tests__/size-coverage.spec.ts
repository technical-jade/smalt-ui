import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Density presets work through the `size` prop (`global: { size: 'sm' }`), so every field with a
 * control of fixed height must take it and pass it on to `SFormField` for the label size.
 * Checkbox, radio and slider have no field-height control and stay out.
 */
const root = resolve(process.cwd(), 'src/components')
const NO_FIELD_HEIGHT = ['SCheckbox', 'SRadioGroup', 'SSlider']

const fields = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== 'SFormField')
  .map((entry) => entry.name)
  .filter((name) => /<SFormField\b/.test(readFileSync(`${root}/${name}/${name}.vue`, 'utf8')))
  .filter((name) => !NO_FIELD_HEIGHT.includes(name))

describe('field size coverage', () => {
  it('finds the fields', () => {
    expect(fields.length).toBeGreaterThan(10)
  })

  for (const name of fields) {
    it(`${name} takes size and passes it to SFormField`, () => {
      expect(readFileSync(`${root}/${name}/types.ts`, 'utf8')).toMatch(/\bsize\?:/)
      const tag = readFileSync(`${root}/${name}/${name}.vue`, 'utf8').match(/<SFormField\b[^>]*>/)
      expect(tag?.[0]).toMatch(/:size="p\.size"/)
    })
  }
})
