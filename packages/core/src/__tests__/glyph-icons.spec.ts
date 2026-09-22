import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Close crosses and check marks come from `SIcon`: a text glyph depends on the host font and
 * cannot be swapped through `registerIcons`.
 */
const root = resolve(process.cwd(), 'src')
const GLYPHS = /[×✕✖✓✔]/

function vueFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = `${dir}/${entry.name}`
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : vueFiles(path)
    return entry.name.endsWith('.vue') ? [path] : []
  })
}

const templates = ['components', 'internal', 'providers', 'labs'].flatMap((dir) =>
  vueFiles(`${root}/${dir}`),
)

describe('glyph icons', () => {
  it.each(templates.map((file) => [file.slice(root.length + 1), file]))(
    '%s draws no text glyph icons',
    (_, file) => {
      const source = readFileSync(file, 'utf8')
      const template = source.slice(source.indexOf('<template>'))
      expect(template).not.toMatch(GLYPHS)
    },
  )
})
