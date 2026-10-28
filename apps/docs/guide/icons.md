# Icons

Smalt UI uses named icons: components and `SIcon` take a string name (`icon="chevron-down"`) that
resolves to an SVG through a registry. The geometry follows [Lucide](https://lucide.dev) (outline,
24×24, `stroke-width: 2`, `currentColor`), so icons inherit the text color and scale with size.

## Three ways to set an icon

```vue
<script setup>
import { SIcon } from '@smalt-ui/core'
</script>

<template>
  <!-- 1. A name from the registry -->
  <SIcon icon="chevron-down" />

  <!-- 2. A raw SVG path (d), for a one-off icon without registration -->
  <SIcon icon="M5 12h14M12 5v14" />

  <!-- 3. Arbitrary SVG content through the slot (overrides the icon prop) -->
  <SIcon label="Logo">
    <circle
      cx="12"
      cy="12"
      r="9"
    />
  </SIcon>
</template>
```

<Demo>
  <div style="display: flex; align-items: center; gap: 16px; color: var(--s-color-text)">
    <SIcon icon="check" />
    <SIcon icon="calendar" />
    <SIcon icon="circle-alert" />
    <SIcon
      icon="star"
      :size="28"
    />
  </div>

<template #code>

```vue
<template>
  <div style="display: flex; align-items: center; gap: 16px; color: var(--s-color-text)">
    <SIcon icon="check" />
    <SIcon icon="calendar" />
    <SIcon icon="circle-alert" />
    <SIcon
      icon="star"
      :size="28"
    />
  </div>
</template>
```

  </template>
</Demo>

## Built-in set

A curated set of common icons is available by name right away, without registration (components
use the same names). The names match [Lucide](https://lucide.dev) (kebab-case):

<IconShowcase />

If the icon you need is not in the set, register it (see below); all ~1600 Lucide icons are
available.

## Custom icons: `registerIcons`

For icons beyond the built-in set, import them from the **`@smalt-ui/core/icons`** subpath (a
re-export of [Lucide](https://lucide.dev); **no separate install needed**, the package comes in
transitively) and register them once at app startup. Named imports are tree-shakeable, so only the
icons you use end up in the build:

```ts
// main.ts
import { registerIcons } from '@smalt-ui/core'
import { Rocket, Search, Trash2 } from '@smalt-ui/core/icons'

registerIcons({
  rocket: Rocket,
  search: Search,
  trash: Trash2,
})
```

Icons from `@smalt-ui/core/icons` already have the right format (`SIconNode`, an array of
`[tag, attributes]` nodes), no adaptation needed. Names in the built-in set match Lucide names, so
any built-in icon can be overridden by registering an icon under the same key:

```ts
import { registerIcons } from '@smalt-ui/core'
import { ChevronsUpDown } from '@smalt-ui/core/icons'

// replace the default chevron in all components
registerIcons({ 'chevron-down': ChevronsUpDown })
```

> You can also import directly from `lucide` (if it is already a dependency); the format is the
> same. The registry is not reactive: `SIcon` does not redraw if an icon is registered after it has
> rendered, so register before `app.mount()`. An unregistered name logs a warning in development
> and the icon stays empty. In Nuxt, put `registerIcons(...)` in a plugin (`plugins/icons.ts`) so
> that registration runs both on the client and during SSR.

## Icons in components

Components where an icon makes sense take string props (a registry name or a raw path):

- **Content**: `icon` (leading) and `icon-right` (trailing): `SButton`, `SInput`, `SBadge`. Only
  the leading `icon`: `STag`, `SSelect`, `SAutocomplete`, `SFileUpload`, `SEmptyState`, `SStat`,
  `SFab`, `SBackTop`, `SListItem`. Items of collections take an `icon` field too: menu items
  (`SDropdownMenu`, `SContextMenu`, `SMenubar`, `SCommandPalette`), `STabs` tabs, `STree` nodes,
  `SBreadcrumb` crumbs, `SStepper` steps, `STimeline` events, `SSelect`/`SListbox` options.
- **Status/state**: override the built-in icon: `SAlert` and `SBanner` (`icon`; `:icon="false"`
  removes the icon), `SSelect` (`dropdown-icon`), `SAccordionItem`/`SCollapsible` (`expand-icon`),
  `SCheckbox` (`checked-icon`/`indeterminate-icon`), `SStepper` (`done-icon`), `SPagination`
  (`prev-icon`/`next-icon`), `SRating` (`icon`/`selected-icon`).
- **Actions**: `SInput`/`SSelect`/`SAutocomplete` (`clearable` + `clear-icon`), password reveal in
  `SInput` (`reveal-icon`/`hide-icon`); removal: `remove-icon` on `STag`, `SFileUpload` and on
  `SInput` in `use-tags` mode.

```vue
<template>
  <SButton
    icon="plus"
    variant="primary"
  >
    Add
  </SButton>
  <SInput
    v-model="query"
    icon="search"
    clearable
    placeholder="Search"
  />
</template>
```

## Accessibility

`SIcon` without the `label` prop is decorative and hidden from screen readers (`aria-hidden`). If
the icon carries meaning, set `label`: this adds `role="img"` and `aria-label`. Icon-only buttons
(without text) must have an accessible name (`aria-label`).

```vue
<template>
  <SIcon
    icon="triangle-alert"
    label="Warning"
  />
  <SButton
    icon="x"
    aria-label="Close"
  />
</template>
```
