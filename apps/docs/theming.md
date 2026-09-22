# Theming

Smalt UI styling is built on a three-tier system of design tokens (CSS custom properties), with no
runtime styling. Tokens are a public contract: both the light/dark theme and any customization rely
on them.

## Three token tiers

1. **Primitive**: the raw palette and scales, i.e. brand colors (`--s-primary`, `--s-secondary`,
   …), the Material Design palette (`--s-red-6`, `--s-blue-8`), the neutral scale
   (`--s-gray-900`), plus `--s-space-4` and `--s-radius-md`. Generated from SASS maps; the full list
   of colors is on the [Palette](/style/palette) page.
2. **Semantic**: meaningful roles such as `--s-color-primary`, `--s-color-bg`, `--s-color-text`,
   `--s-color-negative`. They refer to primitives; derived states (`-hover`/`-active`/`-subtle`)
   are computed from the base with `color-mix`. **Override these (or the base brand tokens) to
   customize.**
3. **Component**: component tokens refer to semantic roles. Change a semantic token and the look of
   all components changes consistently.

```
--s-primary  (brand token)  →  --s-color-primary (semantic)  →  .s-button--primary background (component)
```

## Main semantic tokens

| Token                                                                                | Purpose                                                                 |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `--s-color-bg` / `--s-color-bg-subtle` / `--s-color-bg-muted`                        | page background and its variations                                      |
| `--s-color-surface`                                                                  | "surface" background (cards, overlays, inputs)                          |
| `--s-color-text` / `--s-color-text-muted` / `--s-color-text-subtle`                  | text and its muted variants                                             |
| `--s-color-border` / `--s-color-outline`                                             | borders and control outlines                                            |
| `--s-color-primary` (+ `-hover` / `-active` / `-contrast` / `-text` / `-container`)  | accent color and its derivatives                                        |
| `--s-color-positive` / `--s-color-warning` / `--s-color-negative` / `--s-color-info` | status colors                                                           |
| `--s-color-<role>-text`                                                              | the same role for text, see [Palette](/style/palette)                   |
| `--s-color-focus-ring`                                                               | focus ring color                                                        |
| `--s-shadow-color` / `--s-shadow-key-opacity` / `--s-shadow-ambient-opacity`         | shadow color and strength, see [Elevation](/style/elevation#dark-theme) |
| `--s-radius-sm` / `-md` / `-lg` / `-xl`                                              | corner radii                                                            |
| `--s-font-sans` / `--s-font-heading` / `--s-font-mono`                               | fonts (see [below](#fonts))                                             |

The full set is in `SemanticTokenName` (a type exported from `@smalt-ui/core`).

Layers are ordered by `--s-z-*` tokens: `--s-z-sticky` (1100) < `--s-z-overlay` (1300) <
`--s-z-modal` (1400) < `--s-z-dropdown` and `--s-z-popover` (1500) < `--s-z-toast` (1700). Lists
and popovers sit above dialogs, so a select inside `SDialog` or `SDrawer` opens over the overlay.

## Light and dark theme

The theme is switched with the `data-theme` attribute on `<html>`. The `useColorMode` composable
manages the mode (`light` / `dark` / `auto`) and syncs it with `localStorage` and the system theme.
The theme switch at the top of the page changes the theme right here.

```ts
import { useColorMode } from '@smalt-ui/core'

const { mode, scheme, setMode, toggle } = useColorMode()
setMode('dark') // 'light' | 'dark' | 'auto'
toggle() // switch light ↔ dark
// mode   — the user's choice ('light' | 'dark' | 'auto')
// scheme — the resulting applied scheme ('light' | 'dark'), read-only
```

- `auto` follows the system theme (`prefers-color-scheme`) and reacts to its changes.
- The state is an app-wide singleton: all `useColorMode()` calls share one state.
- SSR-safe (does not touch `window`/`document` on the server).

## Theme before the first paint {#theme-before-first-paint}

Until `data-theme` is set, the media fallback of the tokens applies, that is, the system theme. The
attribute is set by `useColorMode`, which runs with the app bundle, so a user with a dark system and
a light theme selected (or the other way around) sees the page flash in the wrong theme.

The only fix is code that runs **before** the first paint. `colorModeScript` returns a ready-made
string: it reads the same `localStorage` key as `useColorMode` and resolves `auto` through
`prefers-color-scheme`:

```ts
import { colorModeScript } from '@smalt-ui/core'

colorModeScript() // IIFE string; inline it in <head> before the styles
colorModeScript({ storageKey: 'my-key', initialMode: 'light' })
```

The function is also available from the separate `@smalt-ui/core/color-mode-script` subpath, which
pulls in no components or styles, so it can be imported in Node, in build configs and in SSR
templates.

::: tip Nuxt
The `@smalt-ui/nuxt` module inserts this script itself, no extra steps are needed, see
[Nuxt](/guide/nuxt#fouc).
:::

**Vite / SPA.** Put the result into `index.html` first in `<head>`, before the styles:

```html
<head>
  <meta charset="UTF-8" />
  <script>
    ;(function () {
      try {
        var m = localStorage.getItem('smalt-color-mode') || 'auto'
        var d =
          m === 'dark' ||
          (m !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light')
      } catch (e) {}
    })()
  </script>
  <!-- then styles and everything else -->
</head>
```

**Custom SSR.** Insert the string into the template at render time, so the script stays in sync
with the library even if the storage key changes:

```ts
import { colorModeScript } from '@smalt-ui/core/color-mode-script'

const html = `<!doctype html><html><head><script>${colorModeScript()}</script>…`
```

## Customizing the palette

The library is based on the [Material Design palette](/style/palette): 9 brand colors + color
families. **The recommended way to theme is to override the base brand color.** Derived states
(`color-primary-hover`/`-active`/`-subtle`) are computed from the base with `color-mix`, so setting
the base is enough and the shades are recomputed automatically. Try it live:

<ClientOnly>
  <ThemeShowcase />
</ClientOnly>

```ts
import { createTheme, injectTheme } from '@smalt-ui/core'

// Set the base brand colors; the states are derived automatically.
const css = createTheme({
  primary: '#7c3aed',
  secondary: '#0ea5e9',
  'radius-md': '0.75rem',
})

injectTheme(css) // adds <style> :root:root:root { --s-primary: #7c3aed; ... }
```

The same tokens can be set right when installing the plugin, with no separate `injectTheme` call:

```ts
app.use(createSUI({ theme: { primary: '#7c3aed' } }))
```

The `theme` option is merged with the preset by the same rule as `defaults`: explicit values
override `preset.tokens` (see [Presets](/guide/presets)).

For fine control over a specific state, override a semantic token directly (`color-primary-hover`
and so on); it wins over the derived value:

```ts
createTheme({ primary: '#7c3aed', 'color-primary-hover': '#6d28d9' })
```

The manual option needs no JS, just CSS. The triple `:root:root:root` raises specificity to
(0,3,0), strictly above the dark theme `:root[data-theme='dark']` (0,2,0), so the override works in
both the light and dark theme regardless of the order in which styles load:

```css
:root:root:root {
  --s-color-primary: #7c3aed;
  --s-radius-md: 0.75rem;
}
```

A ready-made "theme + prop values" set is best packaged as a [preset](/guide/presets), so a product
can apply it in one line.

Tokens can also be overridden locally, on any container, not only on `:root`:

```css
.promo-section {
  --s-color-primary: #e11d48; /* a different accent only inside this block */
}
```

## Fonts

The library ships the Inter font and applies it itself, so components look the same regardless of
the host page typography. `reset-inherited` on the root of every component sets
`font-family: var(--s-font-sans)`, so the host font **does not leak** into components (see
[Isolation](/guide/isolation#fonts)).

| Token              | Font                    | Where                                             |
| ------------------ | ----------------------- | ------------------------------------------------- |
| `--s-font-sans`    | Inter                   | all text, inputs, buttons, menus                  |
| `--s-font-heading` | `var(--s-font-sans)`    | headings: `.s-text-h1…h6`, dialog and card titles |
| `--s-font-mono`    | JetBrains Mono + system | monospaced values (hex in `SColorField`)          |

Inter is a variable font: one file covers all weights from 100 to 900, so every weight of the token
scale renders with a real face, without synthesis. The files are split into subsets by
`unicode-range`, and the browser downloads only those whose characters appear on the page:

| Subset            | File                      |
| ----------------- | ------------------------- |
| Latin             | `Inter-Latin.woff2`       |
| Latin Extended    | `Inter-LatinExt.woff2`    |
| Cyrillic          | `Inter-Cyrillic.woff2`    |
| Cyrillic Extended | `Inter-CyrillicExt.woff2` |

Accented letters and some currency signs, such as the ruble (`₽`), are in Latin Extended, so an
interface that uses them downloads that subset too. The font is distributed under the SIL Open Font
License 1.1; the license text ships next to the files (`@smalt-ui/core/fonts/OFL.txt`).

### 1. Use the library fonts

```ts
import '@smalt-ui/core/styles.css'
import '@smalt-ui/core/fonts.css'
```

It is a separate entry rather than part of `styles.css`: an app with its own fonts simply does not
import it and downloads nothing extra. In Nuxt the [module](/guide/nuxt#fonts) does all of this,
so there is nothing to import by hand.

### 2. Your own font files

If the app serves fonts itself (its own CDN, shared static files), take the rules from the SCSS
module:

```scss
@use '@smalt-ui/core/scss/fonts' with (
  $font-path: '/fonts/'
);
```

Make the path **absolute from the site root**: Sass does not rewrite `url()`, the rules end up in
your CSS, and a relative path would resolve from your output file. You can copy the files from the
package: they are in `@smalt-ui/core/fonts/*`.

### 3. A different font

```ts
injectTheme(
  createTheme({
    'font-sans': '"Roboto", system-ui, sans-serif',
    'font-heading': '"Roboto Condensed", sans-serif',
  }),
)
```

Or right when installing the plugin:

```ts
app.use(createSUI({ theme: { 'font-sans': '"Roboto", system-ui, sans-serif' } }))
```

By default headings use the text font. To give them their own, the token is enough:

```css
:root:root:root {
  --s-font-heading: 'Manrope', var(--s-font-sans);
}
```

### 4. Blend in with the host page font

```css
:root:root:root {
  --s-font-sans: inherit;
  --s-font-heading: inherit;
}
```

Useful when embedding the library into an existing app where typography must match the page.

::: warning If headings have their own font
By default `--s-font-heading` refers to `--s-font-sans`, and the first line is enough. But if
headings are set to something like `'Manrope', var(--s-font-sans)`, `inherit` on the text token
alone yields `'Manrope', inherit`, an invalid `font-family`: the whole declaration is dropped, and
the reason is not visible in code. That is why `inherit` is set on both tokens.
:::

## Customizing specific components

BEM class names (`.s-button`, `.s-button--primary`, `.s-card__body`…) are a **stable part of the
public contract**. You can style them directly, but tokens are the preferred path: they survive
updates and do not depend on internal markup.

```css
/* with tokens (recommended) */
:root:root:root {
  --s-radius-md: 999px;
}

/* directly by class (when a token is not enough) */
.s-button--primary {
  text-transform: uppercase;
}
```
