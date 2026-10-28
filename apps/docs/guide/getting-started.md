# Getting started

Smalt UI is a component library for Vue 3 and Nuxt built on design tokens and Reka UI.

## Installation

```bash
pnpm add @smalt-ui/core
```

`vue` (3.5+) and `reka-ui` (2.10+) are peer dependencies: the library takes them from your app,
so install `reka-ui` alongside if you do not have it yet:

```bash
pnpm add reka-ui
```

The date and time components (`SDateField`, `SDatePicker`, `SCalendar` and others) take
`@internationalized/date` objects. That package is an optional peer; install it if you use those
fields:

```bash
pnpm add @internationalized/date
```

## Setup (Vue 3)

Register the plugin and import the styles once in the entry point:

```ts
// main.ts
import { createApp } from 'vue'
import { SUI } from '@smalt-ui/core'
import '@smalt-ui/core/styles.css'
import '@smalt-ui/core/fonts.css'
import App from './App.vue'

createApp(App).use(SUI).mount('#app')
```

`fonts.css` is the Inter font. It is a separate entry: if your app loads its own font, just skip
the import and components take the font from the `--s-font-sans` stack
(see [Fonts](/theming#fonts)).

Wrap the app root in the `.s-root` container. It is the Smalt UI isolation boundary (base
typography, protection from host page styles). The `--app` modifier adds a background and height
for a full-screen app:

```vue
<!-- App.vue -->
<template>
  <div class="s-root s-root--app">
    <SButton variant="primary">Done</SButton>
  </div>
</template>
```

The container and isolation are covered in [Isolation](/guide/isolation). In Nuxt the wrapper is
applied automatically.

### Plugin options

Instead of the ready-made `SUI` you can create a plugin with options, to set prop values for the
whole app at once or to use a preset:

```ts
import { createSUI, compact } from '@smalt-ui/core'

createApp(App)
  .use(
    createSUI({
      preset: compact, // ready-made set: dense controls
      defaults: { SButton: { variant: 'outline' } },
    }),
  )
  .mount('#app')
```

The `theme` option overrides individual theme tokens (see [Theming](/theming)) and `prefix` adds
a prefix to the names of globally registered components. See [Prop defaults](/guide/defaults) and
[Presets](/guide/presets).

### Toasts and confirmations

The imperative APIs `useToast` and `useConfirm` show notifications and dialogs through providers.
Place them once at the app root; the plugin registers them globally:

```vue
<!-- App.vue -->
<template>
  <div class="s-root s-root--app">
    <RouterView />
    <ToastProvider />
    <ConfirmProvider />
  </div>
</template>
```

See the [Toast](/components/toast) and [AlertDialog](/components/alert-dialog) pages.

### Per-component imports (tree-shaking)

The plugin is optional: components can be imported directly, and nothing unused ends up in the
bundle:

```vue
<script setup lang="ts">
import { SButton } from '@smalt-ui/core'
</script>

<template>
  <SButton variant="primary">Done</SButton>
</template>
```

You do not have to write the imports by hand: Vite has an auto-import resolver, see
[Auto-import](/guide/auto-import).

## Nuxt

Nuxt has the [`@smalt-ui/nuxt`](/guide/nuxt) module. It registers components automatically, loads
the styles, applies the isolation container and sets up SSR and the theme.

## Next steps

- [Architecture](/guide/architecture): class contract, CSS delivery, tree-shaking.
- [Isolation and embedding](/guide/isolation): the `.s-root` container, protection from host
  styles, fonts.
- [Theming](/theming): tokens, light/dark theme, palette and font customization.
- [Icons](/guide/icons): named icons and your own set.
- [Internationalization](/guide/i18n): the language of the library strings.
- [Nuxt](/guide/nuxt): the module and its options.
- [Auto-import](/guide/auto-import): components without imports in a plain Vite project.
- [Prop defaults](/guide/defaults): prop values set once for the whole app.
- [Presets](/guide/presets): "theme + defaults" in one object, interface density.
- [Validation](/guide/validation): field rules, `SForm` and schemas.
- [Components](/components/button): examples and API.
