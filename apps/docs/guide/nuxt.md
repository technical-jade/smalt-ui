# Nuxt

The `@smalt-ui/nuxt` module connects the library to Nuxt 3 and Nuxt 4: component auto-import,
styles, color mode, the isolation container and SSR settings.

## Installation

```bash
pnpm add @smalt-ui/core @smalt-ui/nuxt
```

`@smalt-ui/nuxt` requires `@smalt-ui/core` and `reka-ui` as peer dependencies. Nuxt 3 and Nuxt 4
are supported: the module uses the app's `@nuxt/kit`, so no second copy appears in the dependency
tree.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@smalt-ui/nuxt'],
})
```

Components are then available in templates without imports (`<SButton>`, `<SDialog>`…), and the
styles and theme are set up. Everything else is optional.

## What the module does

- **Auto-import** of all `@smalt-ui/core` components (with a prefix, if set).
  Only components are auto-imported, `SForm` included. Composables, `useValidation` and the
  validation rules (`required`, `email`, …) are imported explicitly from `@smalt-ui/core`:
  `import { required, email } from '@smalt-ui/core'`.
- **Styles**: adds `@smalt-ui/core/styles.css` to `nuxt.options.css`.
- **Fonts**: loads the Inter font, serves the files through Nitro and adds
  `<link rel="preload">` for the base subsets (see [below](#fonts)).
- **Isolation container**: applies `.s-root .s-root--app` to the app root (`#__nuxt`), so there is
  no need to wrap it by hand (see [Isolation](/guide/isolation)).
- **Color mode**: initializes the theme on the client (`useColorMode`) and adds an early inline
  script to `<head>` against FOUC (see [below](#fouc)).
- **SSR**: transpiles `reka-ui` and `@smalt-ui/core` so they work correctly in Nitro.
- **Library strings**: with the `messages` option, provides the dictionary to the whole app, both
  on the server and on the client (see [Internationalization](/guide/i18n)).
- **Prop defaults and preset**: with the `defaults`/`preset` options, sets prop values for all
  components (see [Prop defaults](/guide/defaults) and [Presets](/guide/presets)).

## Options

Set in `nuxt.config.ts` under the `sui` key:

```ts
export default defineNuxtConfig({
  modules: ['@smalt-ui/nuxt'],
  sui: {
    prefix: '',
    components: true,
    css: true,
    colorMode: true,
    container: true,
    fonts: true,
    messages: { close: 'Schließen' },
    preset: 'compact',
    defaults: { SButton: { variant: 'outline' } },
  },
})
```

| Option       | Default | Description                                                                                   |
| ------------ | ------- | --------------------------------------------------------------------------------------------- |
| `prefix`     | `''`    | Component name prefix for auto-import (e.g. `'S'` → `SSButton`; usually left empty).          |
| `components` | `true`  | Component auto-import. Turn it off if you import components by hand.                          |
| `css`        | `true`  | Load `@smalt-ui/core/styles.css`. Turn it off if you load the styles yourself.                |
| `colorMode`  | `true`  | Theme initialization + anti-FOUC script.                                                      |
| `container`  | `true`  | Apply `.s-root .s-root--app` to the app root.                                                 |
| `fonts`      | `true`  | Load the Inter font. Turn it off if the app serves it itself, see [below](#fonts).            |
| `locale`     | `'en'`  | Base locale of the library strings; `'en'` is the only built-in one, see [i18n](/guide/i18n). |
| `messages`   | —       | Overrides of individual strings on top of the locale; use it to translate the strings.        |
| `defaults`   | —       | Prop defaults: the `global` key and component names, see [Prop defaults](/guide/defaults).    |
| `preset`     | —       | Name of a built-in preset (`compact`/`comfortable`), see [Presets](/guide/presets).           |

## Fonts {#fonts}

The module adds the `@font-face` rules, serves the files from the package at stable URLs
(`/_fonts/smalt/…`) and preloads basic Latin and Cyrillic, the subsets the first screen is set in.

```ts
sui: {
  fonts: {
    preload: ['latin', 'latin-ext'],
    baseURL: '/static/fonts',
  },
}
```

| Key       | Default           | Description                                                   |
| --------- | ----------------- | ------------------------------------------------------------- |
| `css`     | `true`            | Add the `@font-face` rules.                                   |
| `preload` | `['latin']`       | Subsets for `<link rel="preload">`; `false` disables preload. |
| `baseURL` | `'/_fonts/smalt'` | Base URL at which Nitro serves the files.                     |

Available subsets: `latin`, `latin-ext`, `cyrillic`, `cyrillic-ext`. Only `latin` is preloaded
by default: the browser downloads the others by `unicode-range` only when the page contains such
characters, while preload would force the download every time. Add a subset to the list if the
first screen always uses its characters, for example `latin-ext` for accented letters or
`cyrillic` for a Russian interface.

### The app already loads Inter

```ts
sui: {
  fonts: false
}
```

The `--s-font-sans` token starts with `Inter` and `Inter Variable` (the name from
`@fontsource-variable/inter`), so your own font loading is picked up automatically. Leaving
`fonts: true` in this case declares the font twice and downloads an extra copy.

If you host the files but have no `@font-face` rules, take them from the SCSS module,
see [Theming](/theming#fonts).

## FOUC {#fouc}

The theme is applied with the `data-theme` attribute on `<html>`. Until the attribute is set, the
media fallback of the tokens applies (the system theme), so the other theme could flash before
hydration. The module adds a small inline script to `<head>` (`colorModeScript` from
`@smalt-ui/core`) that **before the first paint** reads the user's choice from `localStorage` (key
`smalt-color-mode`), resolves `auto` through `prefers-color-scheme` and sets `data-theme`. Outside
Nuxt the same script is added by hand, see [Theming](/theming#theme-before-first-paint). Reactive
sync after hydration is done by the client plugin. Nothing is required from you; turn it off with
`colorMode: false`.

## SSR and portals

Components are SSR-safe. Floating layers (Dialog, Popover, Tooltip, Select…) use Reka UI
portals and work out of the box in the regular app flow. In some cases (for example, rendering
demos in static pages) wrap them in `<ClientOnly>`.
