# Breadcrumb

`SBreadcrumb` is a navigation trail from the root to the current page. The crumbs come from the
`items` prop: an item with `href` is rendered as a link, one without as text. The current page is
marked `aria-current="page"`. The separator is a chevron by default (a reusable `SIcon`) and the
`#separator` slot replaces it.

The markup is a `<nav>` with a list of crumbs. Its accessible name comes from the locale
dictionary ("Breadcrumb") and the `aria-label` prop replaces it. Separators are hidden from screen
readers. The crumbs are ordinary `<a href>` elements: the component is not tied to a router, so in
a SPA a click reloads the page. A long trail does not collapse automatically; shorten it yourself.

## Basic usage

<Demo>
  <SBreadcrumb
    :items="[
      { label: 'Home', href: '/' },
      { label: 'Catalog', href: '#' },
      { label: 'Smartphones', href: '#' },
      { label: 'iPhone 15' },
    ]"
  />

<template #code>

```vue
<template>
  <SBreadcrumb
    :items="[
      { label: 'Home', href: '/' },
      { label: 'Catalog', href: '#' },
      { label: 'Smartphones', href: '#' },
      { label: 'iPhone 15' },
    ]"
  />
</template>
```

  </template>
</Demo>

## Custom separator

The `#separator` slot is drawn between the crumbs instead of the chevron.

<Demo>
  <SBreadcrumb
    :items="[
      { label: 'Home', href: '/' },
      { label: 'Settings', href: '#' },
      { label: 'Profile' },
    ]"
  >
    <template #separator>/</template>
  </SBreadcrumb>

<template #code>

```vue
<template>
  <SBreadcrumb :items="items">
    <template #separator>/</template>
  </SBreadcrumb>
</template>
```

  </template>
</Demo>

## Current page

By default the last item is the current page when it has no `href`. A last item with `href` stays
a link and is not marked, for a trail that ends at a parent page. Set `current` to mark an item
explicitly; it keeps its link to the page itself. When several items set `current`, the first one
wins. Other items without `href` render as muted
plain text (`s-breadcrumb__text`), not as the current page.

<Demo>
  <SBreadcrumb
    :items="[
      { label: 'Home', href: '/' },
      { label: 'Account', href: '#' },
      { label: 'Orders', href: '#', current: true },
    ]"
  />

<template #code>

```vue
<template>
  <SBreadcrumb
    :items="[
      { label: 'Home', href: '/' },
      { label: 'Account', href: '#' },
      { label: 'Orders', href: '#', current: true },
    ]"
  />
</template>
```

  </template>
</Demo>

## Icons

The item's `icon` field renders a leading icon for the crumb (a registry name or a raw path).

<Demo>
  <SBreadcrumb
    :items="[
      { label: 'Home', href: '/', icon: 'home' },
      { label: 'Settings', href: '#', icon: 'settings' },
      { label: 'Profile', icon: 'user' },
    ]"
  />

<template #code>

```vue
<template>
  <SBreadcrumb
    :items="[
      { label: 'Home', href: '/', icon: 'home' },
      { label: 'Settings', href: '#', icon: 'settings' },
      { label: 'Profile', icon: 'user' },
    ]"
  />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SBreadcrumb" />
