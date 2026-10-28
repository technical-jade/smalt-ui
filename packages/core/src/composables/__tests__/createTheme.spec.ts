import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { createTheme, injectTheme } from '../createTheme'

describe('createTheme', () => {
  it('uses :root:root:root by default (specificity (0,3,0) > the dark theme)', () => {
    const css = createTheme({ 'color-primary': '#7c3aed' })
    expect(css).toContain(':root:root:root {')
    expect(css).toContain('--s-color-primary: #7c3aed;')
  })

  it('supports a custom selector', () => {
    const css = createTheme({ 'radius-md': '1rem' }, { selector: '.brand' })
    expect(css.startsWith('.brand {')).toBe(true)
    expect(css).toContain('--s-radius-md: 1rem;')
  })

  it('a token value cannot close the block and append its own rules', () => {
    const css = createTheme({ primary: 'red; } body { display: none' })
    expect(css).not.toContain('body {')
    expect(css).toContain('--s-primary: red')
  })
})

/**
 * Base roles of the light theme (without the -hover/-active/-subtle/-contrast states derived from
 * the base through color-mix) must be accepted by the theme: otherwise a color the components draw
 * with cannot be repainted without a type cast.
 */
describe('SemanticTokenName', () => {
  const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')
  const variables = read('src/styles/settings/_variables.scss')
  const light = variables.slice(
    variables.indexOf('$semantic-light:'),
    variables.indexOf('$semantic-dark:'),
  )
  const roles = [...light.matchAll(/^\s*'(color-[a-z-]+)':/gm)]
    .map(([, name]) => name)
    .filter((name) => !/-(hover|active|subtle|contrast)$/.test(name))
  const typeSource = read('src/composables/createTheme.ts')

  it('finds the roles', () => {
    expect(roles).toContain('color-outline')
  })

  for (const role of roles) {
    it(`accepts ${role}`, () => {
      expect(typeSource).toContain(`| '${role}'`)
    })
  }

  it('createTheme emits color-outline as a CSS variable', () => {
    expect(createTheme({ 'color-outline': '#999' })).toContain('--s-color-outline: #999;')
  })
})

describe('injectTheme', () => {
  afterEach(() => {
    document.querySelectorAll('style[data-smalt-theme]').forEach((el) => el.remove())
    document.getElementById('app')?.remove()
  })

  it('leaves a host page element with the same name alone', () => {
    const mount = document.createElement('div')
    mount.id = 'app'
    mount.textContent = 'application'
    document.body.appendChild(mount)

    // A preset name arrives here as the theme id and may well match a host element id.
    injectTheme(createTheme({ primary: 'red' }), 'app')

    expect(mount.textContent).toBe('application')
    expect(document.querySelector('style[data-smalt-theme="app"]')?.textContent).toContain('red')
  })

  it('inserts and updates one <style> per theme', () => {
    const find = () => document.querySelector('style[data-smalt-theme="test-theme"]')

    injectTheme(createTheme({ 'color-primary': 'red' }), 'test-theme')
    expect(find()?.tagName).toBe('STYLE')
    expect(find()?.textContent).toContain('red')

    injectTheme(createTheme({ 'color-primary': 'blue' }), 'test-theme')
    expect(document.querySelectorAll('style[data-smalt-theme="test-theme"]')).toHaveLength(1)
    expect(find()?.textContent).toContain('blue')
  })
})
