import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * A touch browser keeps `:hover` on an element after a tap, so every hover rule goes through the
 * `tools.hover` mixin (`@media (hover: hover)`). The test cuts out the blocks of the mixin and
 * expects no `:hover` left. The tools themselves are the one place that defines it.
 */
const root = resolve(process.cwd(), 'src')
const MARKER = '@include tools.hover'

const files = readdirSync(root, { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.scss') && !file.startsWith('styles/tools/'))
  .sort()

function outsideHoverBlocks(source: string) {
  let rest = ''
  let from = 0
  for (let start = source.indexOf(MARKER); start >= 0; start = source.indexOf(MARKER, from)) {
    rest += source.slice(from, start)
    let depth = 0
    let end = source.indexOf('{', start)
    for (; end < source.length; end++) {
      if (source[end] === '{') depth++
      else if (source[end] === '}' && --depth === 0) break
    }
    from = end + 1
  }
  return rest + source.slice(from)
}

describe('hover coverage', () => {
  it('finds the hover rules', () => {
    expect(
      files.filter((file) => readFileSync(`${root}/${file}`, 'utf8').includes(MARKER)).length,
    ).toBeGreaterThan(10)
  })

  it.each(files)('%s keeps :hover inside tools.hover', (file) => {
    const source = readFileSync(`${root}/${file}`, 'utf8').replace(/\/\/.*$/gm, '')
    expect(outsideHoverBlocks(source)).not.toMatch(/:hover\b/)
  })
})
