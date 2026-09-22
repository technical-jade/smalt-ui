# @smalt-ui/core

The library core: **56 UI components** for Vue 3 built on [Reka UI](https://reka-ui.com/),
three-tier design tokens with themes (light/dark), composables and providers. Built with Vite
library mode (ESM + `.d.ts` + `styles.css`), tree-shakeable (`preserveModules` + `sideEffects`).

> Part of the **Smalt UI** monorepo. Shared requirements, installation and workspace commands are
> described in the [root README](../../README.md).

## Installation

```bash
pnpm add @smalt-ui/core
```

Peer dependencies (installed by the consumer):

| Package                   | Version  | Notes                                                  |
| ------------------------- | -------- | ------------------------------------------------------ |
| `vue`                     | `^3.5.0` | required                                               |
| `reka-ui`                 | `^2.0.0` | required (the primitives the components are built on)  |
| `@internationalized/date` | `^3.5.0` | **optional**, needed only for the date/time components |

Icons (`lucide`) and the mask engine (`maska`) are internal dependencies; no separate install needed.

## Usage

### Globally (plugin)

```ts
import { createApp } from 'vue'
import { SUI } from '@smalt-ui/core'
import '@smalt-ui/core/styles.css'
import App from './App.vue'

createApp(App).use(SUI).mount('#app')
```

### Per component (tree-shaking)

```vue
<script setup lang="ts">
import { SButton } from '@smalt-ui/core'
import '@smalt-ui/core/styles.css'
</script>

<template>
  <SButton>Button</SButton>
</template>
```

Wrap the app (or a subtree) in the `.s-root` container: it isolates the styles from the host
(see the "Isolation" section of the documentation site).

## Entry points (exports)

| Path                        | Contents                                                         |
| --------------------------- | ---------------------------------------------------------------- |
| `@smalt-ui/core`            | components, composables, providers, the `SUI` plugin             |
| `@smalt-ui/core/icons`      | re-export of `lucide` icons (tree-shakeable) for `registerIcons` |
| `@smalt-ui/core/styles.css` | built styles (tokens + all components)                           |
| `@smalt-ui/core/fonts.css`  | `@font-face` for the Inter font (optional)                       |
| `@smalt-ui/core/fonts/*`    | the `woff2` files themselves                                     |
| `@smalt-ui/core/scss/*`     | SCSS sources: tokens, mixins, fonts module                       |

## What's inside

- **Components** (`src/components/`, `S` prefix): basics, forms, feedback, navigation/layout.
- **Providers** (`src/providers/`, no `S` prefix): `ConfigProvider` (i18n, explicit import only),
  `ToastProvider` (toasts).
- **Form validation**: `SForm`, `rules` on every form field, built-in rules and Zod/Valibot
  schemas through `schemaRule` (see the
  [Validation guide](https://technical-jade.github.io/smalt-ui/guide/validation)).
- **Composables**: `useColorMode`, `useToast`, `createTheme`/`injectTheme`,
  `useMessages`/`provideLocale`/`installLocale`, `useIcons`/`registerIcons`/`resolveIcon`.
- **Tokens and themes**: SASS maps (`src/styles/`) → CSS variables with the `--s-` prefix; the
  theme is set with `data-theme` on `<html>`.

## Fonts

The package ships the **Inter** font (variable, weights 100–900) in four subsets: Latin, Cyrillic
and their extended ranges. The browser downloads only the subsets whose characters appear on the
page. Include it with a separate entry:

```ts
import '@smalt-ui/core/fonts.css'
```

Headings can get their own font through a token; by default they use the text font:

```css
:root {
  --s-font-heading: 'Manrope', var(--s-font-sans);
}
```

Inter is distributed under the SIL Open Font License 1.1; the license text sits next to the files
(`fonts/OFL.txt`).

## Package scripts

| Script               | Description                                               |
| -------------------- | --------------------------------------------------------- |
| `pnpm build`         | Full build: `vite build` + `build:types` + `build:styles` |
| `pnpm dev`           | Rebuild the library in watch mode (`vite build --watch`)  |
| `pnpm build:types`   | Generate `.d.ts` (`vue-tsc -p tsconfig.build.json`)       |
| `pnpm build:styles`  | Build `dist/styles.css` from SASS                         |
| `pnpm test`          | Unit + a11y (Vitest, happy-dom)                           |
| `pnpm test:types`    | Type tests (`expectTypeOf`)                               |
| `pnpm test:coverage` | Tests with coverage                                       |
| `pnpm typecheck`     | Type check without emit                                   |

Run from the root: `pnpm --filter @smalt-ui/core <script>`.
