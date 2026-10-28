<script setup>
import { ref } from 'vue'

const navSize = ref('sm')
const navAlign = ref('start')
const navColumns = ref('1')
</script>

# Navigation Menu

`SNavigationMenu` is horizontal site navigation with dropdown panels of links. It is built on
Reka UI (the `navigation` role, keyboard support, an animated viewport and indicator). Items are
set with the `items` prop: a direct link (`href`) or an expandable panel (`links` with a title and
description). The chevron is an `SIcon`.

The panel opens on hover (after a short delay) or on a click on the trigger and appears under the
item that opened it. It is not portaled but rendered inside the component, so a parent with
`overflow: hidden` clips it. Above the page content the panel keeps the `z-index` of dropdowns
(`--s-z-dropdown`). The menu takes the height of its bar, so a flex parent that stretches its
children does not move the panel down.

## Basic usage

<ClientOnly>
<Demo>
  <div style="width: 100%; min-height: 240px">
  <SNavigationMenu
    aria-label="Main navigation"
    :items="[
      { label: 'Home', href: '/' },
      {
        label: 'Products',
        links: [
          {
            label: 'Analytics',
            href: '#',
            description: 'Reports and dashboards'
          },
          {
            label: 'CRM',
            href: '#',
            description: 'Customer management'
          },
          {
            label: 'Automation',
            href: '#',
            description: 'Workflows and triggers'
          },
          {
            label: 'Integrations',
            href: '#',
            description: 'API and webhooks'
          }
        ],
      },
      { label: 'Pricing', href: '#' }
    ]"
  />
  </div>

<template #code>

```vue
<template>
  <SNavigationMenu
    aria-label="Main navigation"
    :items="[
      { label: 'Home', href: '/' },
      {
        label: 'Products',
        links: [
          {
            label: 'Analytics',
            href: '#',
            description: 'Reports and dashboards',
          },
          {
            label: 'CRM',
            href: '#',
            description: 'Customer management',
          },
          {
            label: 'Automation',
            href: '#',
            description: 'Workflows and triggers',
          },
          {
            label: 'Integrations',
            href: '#',
            description: 'API and webhooks',
          },
        ],
      },
      { label: 'Pricing', href: '#' },
    ]"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Size, columns and alignment

`size` (`sm`/`md`/`lg`, `md` by default) sets the density of the menu: the padding of the bar
items, the padding of the panel links and the size of their titles and descriptions. `sm` suits a
compact header, and a density [preset](/guide/presets) sets it for the whole app. Single values
can be overridden with variables on the menu root:

| Variable                              | What it sets                                      |
| ------------------------------------- | ------------------------------------------------- |
| `--s-navigation-menu-item-padding`    | padding of a bar item                             |
| `--s-navigation-menu-item-font-size`  | text size of a bar item                           |
| `--s-navigation-menu-link-padding`    | padding of a panel link                           |
| `--s-navigation-menu-link-gap`        | gap between the link title and description        |
| `--s-navigation-menu-title-font-size` | size of the link title                            |
| `--s-navigation-menu-desc-font-size`  | size of the link description                      |
| `--s-navigation-menu-columns`         | number of panel columns (when `columns` is unset) |

The panel lays the links out in two columns. The `columns` prop sets another number: two or three
links with descriptions read better with `:columns="1"`.

`align` aligns the panel against the item that opened it: `start` (the default) with its start,
`center` with its center, `end` with its end. Near the window edge the panel shifts back into the
screen.

<ClientOnly>
<Demo>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 100%">
    <div style="display: flex; flex-wrap: wrap; gap: 12px">
      <SToggleGroup v-model="navSize" type="single" mandatory size="sm" aria-label="Size" :options="[{ value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' }]" />
      <SToggleGroup v-model="navAlign" type="single" mandatory size="sm" aria-label="Alignment" :options="[{ value: 'start', label: 'start' }, { value: 'center', label: 'center' }, { value: 'end', label: 'end' }]" />
      <SToggleGroup v-model="navColumns" type="single" mandatory size="sm" aria-label="Columns" :options="[{ value: '1', label: '1 column' }, { value: '2', label: '2 columns' }]" />
    </div>
    <div style="display: flex; justify-content: center; min-height: 240px">
      <SNavigationMenu
        aria-label="Navigation with options"
        :size="navSize"
        :align="navAlign"
        :columns="Number(navColumns)"
        :items="[
          { label: 'Shipping', href: '#' },
          {
            label: 'Customers',
            links: [
              { label: 'Track a parcel', href: '#', description: 'By the order number' },
              { label: 'Pickup points', href: '#', description: 'Map and opening hours' },
              { label: 'Rates', href: '#', description: 'Delivery cost calculator' }
            ]
          },
          { label: 'Business', href: '#' }
        ]"
      />
    </div>
  </div>

<template #code>

```vue
<template>
  <SNavigationMenu
    aria-label="Navigation"
    size="sm"
    align="end"
    :columns="1"
    :items="[
      { label: 'Shipping', href: '/shipping' },
      {
        label: 'Customers',
        links: [
          {
            label: 'Track a parcel',
            href: '/tracking',
            description: 'By the order number',
          },
          {
            label: 'Pickup points',
            href: '/pickup',
            description: 'Map and opening hours',
          },
        ],
      },
      { label: 'Business', href: '/business' },
    ]"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Links

Every item is a plain `<a href>`; the component does not know about a router. The `target` and
`rel` fields of an item and of a panel link go to the attributes of the same name:
`target: '_blank'` opens the page in a new tab. On an item with `links` they are ignored, because
such an item is a trigger rather than a link.

```vue
<template>
  <SNavigationMenu
    :items="[
      {
        label: 'Status',
        href: 'https://status.example.com',
        target: '_blank',
        rel: 'noopener',
      },
    ]"
  />
</template>
```

## API

<ApiTable name="SNavigationMenu" />
