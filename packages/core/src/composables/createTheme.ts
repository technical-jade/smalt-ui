/**
 * Theme customization by overriding tokens. Setting the base brand token is enough: the states
 * (`color-primary-hover`/`-active`/`-subtle`) derive from it via `color-mix`, so they pick up the
 * new color on their own. Overriding a single semantic token works too.
 * Examples and the full token list: `apps/docs/theming.md`.
 */

/** Names of the overridable tokens (without the `--s-` prefix). */
export type SemanticTokenName =
  // Brand colors, the main theming knob (--s-primary … --s-dark-page).
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'positive'
  | 'negative'
  | 'info'
  | 'warning'
  | 'dark'
  | 'dark-page'
  // Semantic roles for surfaces, text and borders.
  | 'color-bg'
  | 'color-bg-subtle'
  | 'color-bg-muted'
  | 'color-surface'
  | 'color-overlay'
  | 'color-text'
  | 'color-text-muted'
  | 'color-text-subtle'
  | 'color-text-inverted'
  | 'color-border'
  | 'color-border-strong'
  // Semantic role colors (for overriding individual states).
  | 'color-primary'
  | 'color-primary-hover'
  | 'color-primary-active'
  | 'color-primary-subtle'
  | 'color-primary-contrast'
  | 'color-primary-text'
  | 'color-secondary'
  | 'color-accent'
  | 'color-accent-text'
  | 'color-positive'
  | 'color-positive-text'
  | 'color-warning'
  | 'color-warning-text'
  | 'color-negative'
  | 'color-negative-text'
  | 'color-info'
  | 'color-info-text'
  | 'color-dark'
  | 'color-focus-ring'
  // Elevation shadows: the color and the strength of the key and ambient layers.
  | 'shadow-color'
  | 'shadow-key-opacity'
  | 'shadow-ambient-opacity'
  | 'radius-sm'
  | 'radius-md'
  | 'radius-lg'
  | 'radius-xl'
  | 'font-sans'
  | 'font-heading'
  | 'font-mono'

export type ThemeTokens = Partial<Record<SemanticTokenName, string>>

export interface CreateThemeOptions {
  /**
   * CSS selector the overrides apply to. Defaults to `':root:root:root'`.
   *
   * The triple `:root:root:root` has specificity (0,3,0), strictly above the dark theme
   * `:root[data-theme='dark']` and the media fallback `:root:not([data-theme='light'])` (both
   * (0,2,0)). A double `:root:root` (0,2,0) is not enough: it ties with the theme, so winning would
   * depend only on `<style>` order, which breaks when the theme is inlined before the library CSS.
   */
  selector?: string
}

/**
 * Tokens go into the CSS as is, so characters that could close a declaration or a block are
 * stripped: a value may come from app configuration, not only from a literal in code, and then
 * `red; } body { … }` would append arbitrary rules to the theme.
 */
const sanitizeValue = (value: string) =>
  String(value)
    .replace(/[;{}<>]/g, '')
    .trim()
const sanitizeName = (name: string) => name.replace(/[^a-zA-Z0-9-]/g, '')

/** Build a CSS string that overrides tokens. Values are not formatted on the client. */
export function createTheme(tokens: ThemeTokens, options: CreateThemeOptions = {}): string {
  const selector = options.selector ?? ':root:root:root'
  const body = Object.entries(tokens)
    .map(([name, value]) => `  --s-${sanitizeName(name)}: ${sanitizeValue(value as string)};`)
    .join('\n')
  return `${selector} {\n${body}\n}`
}

/**
 * Inserts or updates the theme `<style>` in `<head>` (no-op during SSR). The tag is found by its
 * own data attribute, not by `id`: the id is the preset name, and a clash with a host id (`app`,
 * `root`) would write CSS into someone else's element, such as the app mount container.
 */
export function injectTheme(css: string, id = 'smalt-theme'): void {
  if (typeof document === 'undefined') return
  const selector = `style[data-smalt-theme="${CSS.escape(id)}"]`
  let el = document.head.querySelector<HTMLStyleElement>(selector)
  if (!el) {
    el = document.createElement('style')
    el.dataset.smaltTheme = id
    document.head.appendChild(el)
  }
  el.textContent = css
}
