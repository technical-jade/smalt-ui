# Icon

`SIcon` is a primitive for SVG icons. The main way to use it is the `icon` prop with a registry name
(`icon="mail"`); the library ships a curated set of common icons (geometry from
[Lucide](https://lucide.dev)), and any others are added with
[`registerIcons`](/guide/icons#custom-icons-registericons). The color comes from the `color` prop
(a palette name) or is inherited through `currentColor`; the size comes from the `size` prop. The
full guide is on the [Icons](/guide/icons) page.

## Named icons

Pass a name to the `icon` prop, and it resolves to an SVG through the registry:

<Demo>
  <div style="display: flex; flex-wrap: wrap; gap: 20px; color: var(--s-color-text)">
    <SIcon icon="mail" :size="24" />
    <SIcon icon="search" :size="24" />
    <SIcon icon="calendar" :size="24" />
    <SIcon icon="pencil" :size="24" />
    <SIcon icon="trash-2" :size="24" />
    <SIcon icon="settings" :size="24" />
    <SIcon icon="user" :size="24" />
    <SIcon icon="bell" :size="24" />
    <SIcon icon="heart" :size="24" />
    <SIcon icon="download" :size="24" />
    <SIcon icon="circle-check" :size="24" />
    <SIcon icon="triangle-alert" :size="24" />
  </div>

<template #code>

```vue
<template>
  <SIcon
    icon="mail"
    :size="24"
  />
  <SIcon
    icon="search"
    :size="24"
  />
  <SIcon
    icon="calendar"
    :size="24"
  />
</template>
```

  </template>
</Demo>

The names available out of the box are listed in the [Built-in set](/guide/icons#built-in-set)
section.

## Sizes

The `size` prop takes a token — `sm` (16px) / `md` (20px) / `lg` (24px) — or a number of pixels.
A CSS length such as `size="1em"` makes the icon follow the surrounding font size.

<Demo>
  <div style="display: flex; align-items: center; gap: 16px; color: var(--s-color-text)">
    <SIcon
      icon="star"
      size="sm"
    />
    <SIcon
      icon="star"
      size="md"
    />
    <SIcon
      icon="star"
      size="lg"
    />
    <SIcon
      icon="star"
      :size="40"
    />
  </div>

<template #code>

```vue
<template>
  <SIcon
    icon="star"
    size="sm"
  />
  <SIcon
    icon="star"
    size="md"
  />
  <SIcon
    icon="star"
    size="lg"
  />
  <SIcon
    icon="star"
    :size="40"
  />
</template>
```

  </template>
</Demo>

## Color

The icon color is set with the **`color`** prop — a name from the [palette](/style/palette)
(`primary`, `teal`, `teal-10`). Without it, the icon uses `currentColor` and inherits the parent's
`color`.

<Demo>
  <div style="display: flex; align-items: center; gap: 16px">
    <SIcon icon="circle-check" color="indigo" :size="24" label="Indigo" />
    <SIcon icon="circle-check" color="blue" :size="24" label="Blue" />
    <SIcon icon="circle-check" color="blue-grey" :size="24" label="Blue-grey" />
    <SIcon icon="circle-check" color="teal-10" :size="24" label="Teal-10" />
  </div>

<template #code>

```vue
<template>
  <SIcon
    icon="circle-check"
    color="indigo"
  />
</template>
```

  </template>
</Demo>

Inheriting through `currentColor` is handy when the icon should match the color of the text next
to it:

<Demo>
  <div style="display: flex; align-items: center; gap: 16px">
    <span style="color: var(--s-color-primary)">
      <SIcon
        icon="circle-check"
        label="Success"
        :size="24"
      />
    </span>
    <span style="color: var(--s-color-negative)">
      <SIcon
        icon="triangle-alert"
        label="Error"
        :size="24"
      />
    </span>
  </div>

<template #code>

```vue
<template>
  <span style="color: var(--s-color-primary)">
    <SIcon
      icon="circle-check"
      label="Success"
    />
  </span>
</template>
```

  </template>
</Demo>

## Accessible name

Without `label`, the icon is decorative and hidden from screen readers (`aria-hidden`); with
`label`, it gets `role="img"` and `aria-label`.

## Three ways to set an icon

1. **A registry name** — `icon="chevron-down"` (the main way).
2. **A raw SVG path** — `icon="M5 12h14M12 5v14"` (a one-off icon without registration).
3. **A slot** — arbitrary SVG content; it overrides the `icon` prop.

<Demo>
  <div style="display: flex; align-items: center; gap: 16px; color: var(--s-color-text)">
    <SIcon
      icon="chevron-down"
      :size="24"
    />
    <SIcon
      icon="M5 12h14M12 5v14"
      :size="24"
    />
    <SIcon
      label="Circle"
      :size="24"
    ><circle
        cx="12"
        cy="12"
        r="9"
      /></SIcon>
  </div>

<template #code>

```vue
<template>
  <!-- registry name -->
  <SIcon
    icon="chevron-down"
    :size="24"
  />

  <!-- raw SVG path -->
  <SIcon
    icon="M5 12h14M12 5v14"
    :size="24"
  />

  <!-- arbitrary content through the slot -->
  <SIcon
    label="Circle"
    :size="24"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
    />
  </SIcon>
</template>
```

  </template>
</Demo>

## Custom icons

For icons beyond the built-in set, import them from the `@smalt-ui/core/icons` subpath (a Lucide
re-export, no separate install needed) and register them once at app startup:

```ts
// main.ts
import { registerIcons } from '@smalt-ui/core'
import { Rocket, Compass } from '@smalt-ui/core/icons'

registerIcons({
  rocket: Rocket,
  compass: Compass,
})
```

Once registered, the name is available in every component: `<SIcon icon="rocket" />`,
`<SButton icon="compass">…</SButton>`. See the [Icons](/guide/icons) page for details.

## API

<ApiTable name="SIcon" />
