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

## Keyboard activation and hidden panels

By default an arrow key both moves focus and opens the tab. `activation-mode="manual"` only moves
focus; Enter or Space opens the focused tab, which suits panels that are expensive to render.
Inactive panels are unmounted; `:unmount-on-hide="false"` keeps them mounted and hidden, so nested
fields keep their state and the browser page search finds their text.

## API

<ApiTable name="STabs" />
