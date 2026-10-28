# Palette

The Smalt UI color system is built on the Material Design palette: nine **brand colors** (`primary`,
`secondary`, `accent`, `positive`, `negative`, `info`, `warning`, `dark`, `dark-page`) and the full
**Material Design palette** of 19 families (`red`, `blue`, `teal`, …), each with a base shade and
variants `1–14`. Separately there is the neutral `gray` (scale `50–950`) for surfaces, text and
borders.

Brand colors are emitted as the `--s-primary … --s-dark-page` tokens and are the main theming hook:
override the base and you change the accent of the whole library, while the derived states
(`hover`/`active`/`subtle`) are recomputed automatically (see
[Theming](/theming#customizing-the-palette)).

<PaletteShowcase />

## Brand colors

The default palette is the Quasar brand colors with a neutral gray. The `--s-<name>` token is the
customization hook; override it at the SASS level (the `$brand-colors` map) or at runtime with
`createTheme`.

| Token           | Value     | Role                          |
| --------------- | --------- | ----------------------------- |
| `--s-primary`   | `#1976d2` | primary accent                |
| `--s-secondary` | `#26a69a` | secondary accent              |
| `--s-accent`    | `#9c27b0` | additional accent             |
| `--s-positive`  | `#21ba45` | success / positive status     |
| `--s-negative`  | `#c10015` | error / destructive action    |
| `--s-info`      | `#31ccec` | information                   |
| `--s-warning`   | `#f2c037` | warning                       |
| `--s-dark`      | `#1d1d1d` | dark surface                  |
| `--s-dark-page` | `#121212` | page background in dark theme |

Semantic roles (`--s-color-primary`, `--s-color-negative`, …) refer to these brand colors and add
derived tokens (`-hover`, `-active`, `-subtle`, `-contrast`); components use these.

`-text` stands apart: it is the role color for **text** on the page background or on the role's
own `-subtle` backdrop, while the base role remains the fill color. The split is necessary: one
value cannot both read as dark on light and hold `-contrast` on a fill, because in the dark theme
these thresholds diverge. Components color text with `-text` (links, `ghost`/`outline` buttons,
error messages, status badges and alerts) and fills with the base role.

## Material palette

19 families of the standard Material Design palette. Each family provides a base color token
`--s-<family>` (equal to variant `6`) and variants `--s-<family>-1 … -14` (1 is the lightest, 10
the darkest, 11–14 are accents). For example `--s-red-5`, `--s-blue-8`, `--s-teal`.

::: tip Two "grays"
Do not confuse the neutral **`gray`** (`--s-gray-50 … --s-gray-950`, the neutral scale for
surface/text/border) with the Material family **`grey`** (`--s-grey-1 … --s-grey-14`, part of the
color palette). The different spelling prevents token collisions.
:::

## Utility classes

Every palette color has the classes `.s-text-<color>` (text color) and `.s-bg-<color>`
(background). They work with brand colors (`.s-bg-primary`), Material variants (`.s-bg-red-5`,
`.s-text-blue-8`), the neutral scale (`.s-bg-gray-100`) and `white`/`black`.

<Demo>
  <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center">
    <span class="s-bg-primary" style="color: #fff; padding: 6px 12px; border-radius: 6px">.s-bg-primary</span>
    <span class="s-bg-positive" style="color: #fff; padding: 6px 12px; border-radius: 6px">.s-bg-positive</span>
    <span class="s-bg-negative" style="color: #fff; padding: 6px 12px; border-radius: 6px">.s-bg-negative</span>
    <span class="s-bg-teal" style="color: #fff; padding: 6px 12px; border-radius: 6px">.s-bg-teal</span>
    <span class="s-bg-red-5" style="color: #fff; padding: 6px 12px; border-radius: 6px">.s-bg-red-5</span>
    <span class="s-bg-blue-8" style="color: #fff; padding: 6px 12px; border-radius: 6px">.s-bg-blue-8</span>
    <span class="s-text-primary s-bg-gray-100" style="padding: 6px 12px; border-radius: 6px">.s-text-primary</span>
    <span class="s-text-negative s-bg-gray-100" style="padding: 6px 12px; border-radius: 6px">.s-text-negative</span>
  </div>

<template #code>

```vue
<template>
  <span class="s-bg-primary">Primary background</span>
  <span class="s-bg-red-5">Material red-5</span>
  <span class="s-text-primary">Accent text</span>
  <span class="s-text-negative">Error</span>
</template>
```

  </template>
</Demo>

## The `color` prop on components

The `color` prop of accent components (`SButton`, `SBadge`, `SCheckbox`, `SAlert`, `SProgress`,
`SSlider`, `STabs`, `SStepper` and others) takes the same palette names: `<SButton color="teal">`,
`color="teal-10"`, `color="primary"`. It overrides the variant color; states (`hover`/`active`) are
derived automatically. On a light fill, set the text color with the `text-color` prop
(`<SButton color="yellow" text-color="dark">`). Details are on the component pages.

The props also take one name that is not a palette color: `neutral`, the regular text color of
the theme (`--s-color-text`). Unlike `gray-*`, it changes with the theme, and the content on a
`neutral` fill takes the surface color (`--s-color-surface`). It exists only for the props: there
are no `.s-text-neutral`/`.s-bg-neutral` utility classes, so use the token directly in CSS.

## Customization

Brand colors are set up out of the box, so there is nothing to call.
The palette is SASS maps with `!default` (`$brand-colors`, `$material`) plus the `--s-*` runtime
tokens, so a consumer can override any color: at the SASS level (before `@use`) or at runtime with
`createTheme`; see [Theming](/theming#customizing-the-palette) for details.

```ts
import { createTheme, injectTheme } from '@smalt-ui/core'

injectTheme(createTheme({ primary: '#7c3aed' })) // change the accent for your app
```
