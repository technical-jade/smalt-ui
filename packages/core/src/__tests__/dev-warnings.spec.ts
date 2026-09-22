import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { devWarn, isDevMode, resetDevWarnings } from '../internal/dev'

const srcDir = join(import.meta.dirname, '..')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(path)
    return /\.(ts|vue)$/.test(entry.name) ? [path] : []
  })
}

describe('developer warnings', () => {
  afterEach(() => {
    resetDevWarnings()
    vi.unstubAllEnvs()
  })

  /**
   * `import.meta.env.DEV` is evaluated when the LIBRARY is built and freezes as `false`: in
   * `dist` the condition becomes a dead branch and nobody sees the warning. Only `devWarn` knows
   * the consumer's mode, so the build flag is banned in the sources.
   */
  it('do not depend on the build mode of the library itself', () => {
    const offenders = sourceFiles(srcDir)
      .filter((path) => !path.endsWith(join('internal', 'dev.ts')))
      .filter((path) => /import\.meta\.env/.test(readFileSync(path, 'utf8')))
      .map((path) => path.slice(srcDir.length + 1))

    expect(offenders, 'use devWarn from internal/dev').toEqual([])
  })

  // A direct console.warn would reach the production console of the consumer.
  it('go through devWarn', () => {
    const offenders = sourceFiles(srcDir)
      .filter((path) => !path.endsWith(join('internal', 'dev.ts')))
      .filter((path) => /console\.warn\(/.test(readFileSync(path, 'utf8')))
      .map((path) => path.slice(srcDir.length + 1))

    expect(offenders, 'use devWarn from internal/dev').toEqual([])
  })

  it('prints a warning once per message', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    devWarn('[SIcon] icon "cart" is not registered')
    devWarn('[SIcon] icon "cart" is not registered')
    devWarn('[SIcon] icon "box" is not registered')

    expect(warn).toHaveBeenCalledTimes(2)
    warn.mockRestore()
  })

  it('stays silent in the consumer production build', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubEnv('NODE_ENV', 'production')

    expect(isDevMode()).toBe(false)
    devWarn('[SButton] icon-only button without an accessible name')
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })
})
