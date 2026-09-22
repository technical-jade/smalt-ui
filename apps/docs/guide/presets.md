# Presets

A preset is "theme + prop defaults" in one object: what makes a specific product different from the
library defaults. Built-in presets: `compact` (dense interfaces) and `comfortable` (spacious ones).

```ts
import { createApp } from 'vue'
import { createSUI, compact } from '@smalt-ui/core'

createApp(App).use(createSUI({ preset: compact }))
```

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
`:root:root:root`.

## In Nuxt

```ts
export default defineNuxtConfig({
  modules: ['@smalt-ui/nuxt'],
  sui: { preset: 'compact' },
})
```

## Interface density

There is deliberately no `density` prop: density is a set of defaults (`global: { size: 'sm' }`),
not a property of every component. This keeps the component API from growing, and density can be
set both globally and for a subtree through [`ConfigProvider`](/guide/defaults).
For this, every control that density affects has `size`, including `SSelect`, `STextarea`,
`SNumberField` and `SPinInput`.
