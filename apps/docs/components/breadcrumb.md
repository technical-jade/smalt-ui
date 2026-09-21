# Breadcrumb

`SBreadcrumb` is a navigation trail from the root to the current page. Plain CSS on semantic markup
(`nav` with a list): crumbs with `href` are links, and the current page is marked
`aria-current="page"`. The separator is a reusable `SIcon` (replace it with your own through the
`#separator` slot).

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
explicitly; it keeps its link to the page itself.

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
