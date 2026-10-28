# Presets

A preset is "theme + prop defaults" in one object: what makes a specific product different from the
library defaults. Built-in presets: `compact` (dense interfaces) and `comfortable` (spacious ones).

```ts
import { createApp } from 'vue'
import { createSUI, compact } from '@smalt-ui/core'

createApp(App).use(createSUI({ preset: compact }))
```

What the built-in presets set:

| Preset        | Prop defaults            | Tokens |
| ------------- | ------------------------ | ------ |
| `compact`     | `global: { size: 'sm' }` | none   |
| `comfortable` | `global: { size: 'lg' }` | none   |

Both are also available as the `BUILTIN_PRESETS` object (`BUILTIN_PRESETS.compact`).

Explicit `defaults` are applied on top of the preset **per prop** instead of replacing its section
entirely: in the example below buttons become `ghost`, but the `size: 'sm'` density from `compact`
stays, both for buttons and for other components.

```ts
createSUI({
  preset: compact,
  defaults: { SButton: { variant: 'ghost' } },
})
```

The same order applies to nested `ConfigProvider`s: a provider adds its own layer on top of the app
defaults instead of canceling them.

## Custom preset

```ts
import { definePreset } from '@smalt-ui/core'

export const shop = definePreset({
  name: 'shop',
  tokens: {
    primary: '#7c3aed',
  },
  defaults: {
    global: { size: 'lg' },
    SButton: { round: true },
  },
})
```

A preset can also change fonts through `tokens`, for example so that the app uses the system font
without loading Inter:

```ts
export const neutral = definePreset({
  name: 'neutral',
  tokens: {
    'font-sans': 'system-ui, sans-serif',
    'font-heading': 'var(--s-font-sans)',
  },
})
```

Built-in presets do not set fonts: Inter is already the library default, and repeating it in a
preset would create a second source of truth.

Tokens are applied as a custom theme, the same mechanism as [`createTheme`](/theming), written to
`:root:root:root`. The theme `<style>` tag is identified by the preset name. The plugin's `theme`
option overrides individual preset tokens, just as `defaults` overrides its defaults:

```ts
createSUI({
  preset: shop,
  theme: { primary: '#5b21b6' },
})
```

::: warning Tokens and server rendering
The token theme is inserted as a `<style>` tag into `<head>` in the browser: during server
rendering `injectTheme` does nothing. In an SSR app the page is painted with the default colors
until hydration, and the switch is noticeable. If that bothers you, declare the same tokens in your
own CSS on `:root:root:root`, which ends up in the server HTML.
:::

## In Nuxt

```ts
export default defineNuxtConfig({
  modules: ['@smalt-ui/nuxt'],
  sui: { preset: 'compact' },
})
```

The option takes only the name of a built-in preset (`compact`/`comfortable`): module options are
serialized to JSON. Add your own preset in a Nuxt plugin of your own:

```ts
// plugins/smalt-preset.ts
import { createTheme, injectTheme, installDefaults } from '@smalt-ui/core'
import { shop } from '~/presets/shop'

export default defineNuxtPlugin((nuxtApp) => {
  if (shop.tokens) injectTheme(createTheme(shop.tokens), shop.name)
  if (shop.defaults) installDefaults(nuxtApp.vueApp, shop.defaults)
})
```

## Interface density

There is deliberately no `density` prop: density is a set of defaults (`global: { size: 'sm' }`),
not a property of every component. This keeps the component API from growing, and density can be
set both globally and for a subtree through [`ConfigProvider`](/guide/defaults).
For this, every control that density affects has `size`, including `SSelect`, `STextarea`,
`SNumberField` and `SPinInput`, and `SBadge` and `STag` support `lg` too, otherwise `comfortable`
would leave them without size styles. Choice controls without a text frame (`SCheckbox`, `SSwitch`,
`SRadio`, `SSlider`) have a fixed geometry and take no `size`: density changes the height of a
field frame, and they have none. Navigation follows density too: `SNavigationMenu` takes `size`,
so `compact` tightens its items and panel links.
