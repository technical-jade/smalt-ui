import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { enMessages } from '../composables/useLocale'

/**
 * Visible strings (labels, `aria-label`, placeholders) come from the `SMessages` dictionary,
 * otherwise the interface keeps hardcoded text the consumer cannot override. The guard looks for
 * Cyrillic in component code, skipping comments and `devWarn`/`console.*`: those never reach
 * the interface.
 */
const root = resolve(process.cwd(), 'src')

const vueFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = `${dir}/${entry.name}`
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : vueFiles(path)
    return entry.name.endsWith('.vue') ? [path] : []
  })

const stripNoise = (source: string) =>
  source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/(?:console\.\w+|devWarn)\([\s\S]*?\)\s*$/gm, '')
    .replace(/(?:console\.\w+|devWarn)\([\s\S]*?\n\s*\)/g, '')

const CYRILLIC_LITERAL = /(['"`])[^'"`\n]*[\u0401\u0410-\u044f\u0451][^'"`\n]*\1/g

describe('locale dictionary coverage', () => {
  const files = [
    ...vueFiles(`${root}/components`),
    ...vueFiles(`${root}/providers`),
    ...vueFiles(`${root}/internal`),
  ]

  it('finds components to check', () => {
    expect(files.length).toBeGreaterThan(50)
  })

  for (const path of files) {
    const name = path.slice(root.length + 1)
    it(`${name} has no hardcoded interface strings`, () => {
      const literals = stripNoise(readFileSync(path, 'utf8')).match(CYRILLIC_LITERAL) ?? []
      expect(literals, `${name}: strings must come from SMessages`).toEqual([])
    })
  }
})

/**
 * The guide table is the only place a translator sees the whole dictionary, so a key added to
 * `SMessages` without a row there ships untranslatable.
 */
describe('dictionary table in the i18n guide', () => {
  const guide = readFileSync(resolve(root, '../../../apps/docs/guide/i18n.md'), 'utf8')
  const table = guide.slice(guide.indexOf('## Dictionary keys'))
  const rows = new Map(
    [...table.matchAll(/^\|\s*`(\w+)`\s*\|\s*(.*?)\s*\|/gm)].map(([, key, value]) => [key, value]),
  )

  it('lists every key of the dictionary', () => {
    expect([...rows.keys()].sort()).toEqual(Object.keys(enMessages).sort())
  })

  for (const [key, value] of Object.entries(enMessages)) {
    it(`${key} matches its default`, () => {
      expect(rows.get(key)).toBe(value)
    })
  }
})
