# Prop defaults

The library lets you set prop values once for the whole app instead of repeating them in every
template or writing local wrappers around components.

## Priority

From strongest to weakest:

1. a prop passed to the component explicitly;
2. the default for this component (`SButton: { size: 'lg' }`);
3. the global default (`global: { size: 'lg' }`);
4. the component's own default.

## App level

```ts
import { createApp } from 'vue'
import { createSUI } from '@smalt-ui/core'
import '@smalt-ui/core/styles.css'

createApp(App).use(
  createSUI({
    defaults: {
      global: { size: 'sm' },
      SButton: { variant: 'outline' },
      SInput: { clearable: true },
    },
  }),
)
```

## Subtree level

`ConfigProvider` sets defaults for its part of the tree, for example a compact panel inside a
regular app:

```vue
<script setup lang="ts">
import { ConfigProvider } from '@smalt-ui/core'
</script>

<template>
  <ConfigProvider :defaults="{ global: { size: 'sm' } }">
    <SidebarFilters />
  </ConfigProvider>
</template>
```

Nested providers override outer ones.

## In Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@smalt-ui/nuxt'],
  sui: {
    defaults: {
      global: { size: 'sm' },
      SButton: { variant: 'outline' },
    },
  },
})
```

## What counts as "passed explicitly"

A prop counts as explicit if it is present in the markup **with a value**, in any casing
(`size="lg"` and `:size="value"`, `icon-right` and `iconRight`).

`undefined` does not count as explicit. This matters for wrapper components where the prop is
optional: in the markup below the button gets `size` from the configuration until the wrapper is
given its own size, which is the same behavior as having no attribute at all.

```vue
<template>
  <!-- props.size === undefined → the ConfigProvider/preset default applies -->
  <SButton :size="props.size">{{ label }}</SButton>
</template>
```

## Configuration layers

Defaults stack in layers and **per prop**: preset → plugin `defaults` or the Nuxt option →
`ConfigProvider` in a subtree. Each layer refines the previous one instead of replacing it
entirely, so a `ConfigProvider` added for one locale or one default does not cancel the app
configuration.
A value of `undefined` in a layer counts as not set and keeps the value of the layer below.

## Styling is configured with defaults too

Appearance that consumers would otherwise have to override in CSS is exposed as props, so it can be
set once for the whole app:

```ts
app.use(
  createSUI({
    defaults: {
      // square corners on all controls and panels at once
      global: { square: true },
      // filled buttons without a shadow
      SButton: { flat: true },
      // inputs without a floating label and without the clear button
      SInput: { floatingLabel: false, clearable: false },
    },
  }),
)
```

`global` applies to every component that declares the prop: `square` exists on all controls and
on floating panels (dropdown lists, menus, popovers, calendars), `size` on all components affected
by interface density. `floatingLabel` in `global` turns on the floating label only for fields that
can render it (`SInput`, `STextarea`, `SSelect`, date and time fields and pickers, `SColorField`).
The rest (`SNumberField`, `SAutocomplete`, `SPinInput`, `SSlider`, groups) keep their label on top.

## Validation mode

`validateOn` sets when the fields check their [rules](/guide/validation#when-fields-check). It can
be set for the form, for one kind of field or for everything:

```ts
app.use(
  createSUI({
    defaults: {
      // every SForm checks its fields while the user types
      SForm: { validateOn: 'input' },
    },
  }),
)
```

```ts
// every form and every single field
app.use(createSUI({ defaults: { global: { validateOn: 'input' } } }))
```

Here the order differs from the general [priority](#priority), so that a field's default does not
override the form it is placed in. From strongest to weakest:

1. `validate-on` passed to the field;
2. the mode of the enclosing `SForm`: its `validate-on` prop, then `SForm` defaults, then `global`;
3. the field's own defaults (`SInput: { validateOn: 'submit' }`, then `global`);
4. `blur`.

So `SInput: { validateOn: 'submit' }` applies to `SInput` fields outside a form, and inside a form
only while the form has no mode of its own. With `global: { validateOn }` set, every `SForm` has a
mode, so a default for one kind of field applies only outside forms.
