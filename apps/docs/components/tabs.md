# Tabs

`STabs` is a set of tabs built on Reka UI (the `tablist`/`tab`/`tabpanel` roles, arrow-key
navigation). Tabs are set with the `items` prop, and the content of each goes into the slot of the
same name (`#<value>`). It works with `v-model` (the active tab).
Without a value the first enabled tab is shown (it is not written to `v-model`). Tabs that do not
fit scroll within the list, and a tab activated from outside scrolls into view.

<script setup>
import { ref } from 'vue'
const tabItems = [
  { value: 'overview', label: 'Overview' },
  { value: 'specs', label: 'Specifications' },
  { value: 'reviews', label: 'Reviews' },
]
const iconTabItems = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'profile', label: 'Profile', icon: 'user' },
  { value: 'prefs', label: 'Settings', icon: 'settings' },
]
const tabBasic = ref('overview')
const tabVertical = ref('overview')
const tabIcons = ref('home')
const tabEnclosed = ref('overview')
const tabEnclosedVertical = ref('overview')
</script>

## Basic usage

<ClientOnly>
<Demo>
  <STabs :items="tabItems" v-model="tabBasic" aria-label="Product sections" style="width: 100%">
    <template #overview>General product information.</template>
    <template #specs>Technical specifications and dimensions.</template>
    <template #reviews>Customer reviews.</template>
  </STabs>

<template #code>

```vue
<script setup>
import { ref } from 'vue'
const tab = ref('overview')
const items = [
  { value: 'overview', label: 'Overview' },
  { value: 'specs', label: 'Specifications' },
]
</script>

<template>
  <STabs
    v-model="tab"
    :items="items"
    aria-label="Product sections"
  >
    <template #overview>General information.</template>
    <template #specs>Specifications.</template>
  </STabs>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Vertical

`orientation="vertical"` puts the tab list to the left of the panel, and arrow navigation moves to
<kbd>↑</kbd>/<kbd>↓</kbd>.

<ClientOnly>
<Demo>
  <STabs :items="tabItems" v-model="tabVertical" orientation="vertical" aria-label="Sections" style="width: 100%">
    <template #overview>General product information.</template>
    <template #specs>Technical specifications.</template>
    <template #reviews>Customer reviews.</template>
  </STabs>

<template #code>

```vue
<template>
  <STabs
    v-model="tab"
    :items="items"
    orientation="vertical"
    aria-label="Sections"
  >
    <template #overview>…</template>
  </STabs>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Enclosed tabs

`variant="enclosed"` draws folder tabs: the bordered active tab merges with the panel border, and
inactive tabs sit on a muted background. The default, `underline`, underlines the active tab. The
border does not stick out of the list, so a list that overflows still scrolls only horizontally.
It works with `orientation="vertical"` as well.

<ClientOnly>
<Demo>
  <div style="display: grid; gap: 24px; width: 100%">
    <STabs :items="tabItems" v-model="tabEnclosed" variant="enclosed" aria-label="Product sections">
      <template #overview>General product information.</template>
      <template #specs>Technical specifications and dimensions.</template>
      <template #reviews>Customer reviews.</template>
    </STabs>
    <STabs :items="tabItems" v-model="tabEnclosedVertical" variant="enclosed" orientation="vertical" aria-label="Sections">
      <template #overview>General product information.</template>
      <template #specs>Technical specifications.</template>
      <template #reviews>Customer reviews.</template>
    </STabs>
  </div>

<template #code>

```vue
<template>
  <STabs
    v-model="tab"
    :items="items"
    variant="enclosed"
    aria-label="Product sections"
  >
    <template #overview>General product information.</template>
    <template #specs>Technical specifications and dimensions.</template>
  </STabs>
  <STabs
    v-model="tab"
    :items="items"
    variant="enclosed"
    orientation="vertical"
    aria-label="Sections"
  >
    <template #overview>General product information.</template>
    <template #specs>Technical specifications.</template>
  </STabs>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Tab icons

The `icon` field of a tab draws a leading icon (a registry name or a raw path).

<ClientOnly>
<Demo>
  <STabs :items="iconTabItems" v-model="tabIcons" aria-label="Sections" style="width: 100%">
    <template #home>Summary and recent activity.</template>
    <template #profile>Your profile details.</template>
    <template #prefs>Application settings.</template>
  </STabs>

<template #code>

```vue
<script setup>
import { ref } from 'vue'
const tab = ref('home')
const items = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'profile', label: 'Profile', icon: 'user' },
  { value: 'prefs', label: 'Settings', icon: 'settings' },
]
</script>

<template>
  <STabs
    v-model="tab"
    :items="items"
    aria-label="Sections"
  >
    <template #home>Summary and recent activity.</template>
    <template #profile>Your profile details.</template>
    <template #prefs>Application settings.</template>
  </STabs>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Color

The `color` prop sets the color of the active tab and the indicator from the
[palette](/style/palette).

<ClientOnly>
<Demo>
  <STabs :items="tabItems" :model-value="'overview'" color="indigo" aria-label="Tab color" style="width: 100%">
    <template #overview>The active tab and the indicator are <code>indigo</code>.</template>
    <template #specs>Specifications.</template>
    <template #reviews>Reviews.</template>
  </STabs>

<template #code>

```vue
<template>
  <STabs
    v-model="tab"
    :items="items"
    color="indigo"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Disabled tab

A tab with `disabled: true` stays visible but cannot be opened by a click or from the keyboard:
the arrow keys skip it.

## Keyboard and accessibility

The list gets `role="tablist"`, the tabs `role="tab"` and the panels `role="tabpanel"`, each
linked to its tab. Name the list with the `aria-label` prop.

The whole tab list is one <kbd>Tab</kbd> stop; the next <kbd>Tab</kbd> moves focus into the panel.
The arrows (<kbd>←</kbd>/<kbd>→</kbd>, or <kbd>↑</kbd>/<kbd>↓</kbd> for vertical tabs) walk the
tabs in a loop, and <kbd>Home</kbd> and <kbd>End</kbd> go to the first and the last.

## Activation and hidden panels

By default an arrow key both moves focus and opens the tab. `activation-mode="manual"` only moves
focus; Enter or Space opens the focused tab, which suits panels that are expensive to render.
Inactive panels are unmounted, so state inside them (typed text, scroll position) is lost when
switching. `:unmount-on-hide="false"` keeps them mounted and hidden with the `hidden` attribute, so
nested fields keep their state. The browser's find-in-page still does not find text in hidden
panels.

## API

<ApiTable name="STabs" />
