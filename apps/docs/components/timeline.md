# Timeline

`STimeline` shows a sequence of events on a rail: delivery stages, an audit log, a release history.
The component is data-driven — the events come from `items`, there is no separate item component.

The feed is exposed as `role="list"` with `role="listitem"` items rather than `ul`/`li`: library
markup stays neutral so host styles cannot reach it through tag selectors.

## Basic usage

Without `v-model` nothing is marked as completed — the timeline is a plain feed of events.

<Demo>
  <STimeline :items="[
    { title: 'Order created', description: 'Paid by card', date: 'March 3' },
    { title: 'Packed', description: 'Warehouse 12', date: 'March 4' },
    { title: 'Shipped', description: 'Courier assigned', date: 'March 5' },
  ]" />

<template #code>

```vue
<script setup lang="ts">
const items = [
  {
    title: 'Order created',
    description: 'Paid by card',
    date: 'March 3',
  },
  {
    title: 'Packed',
    description: 'Warehouse 12',
    date: 'March 4',
  },
  {
    title: 'Shipped',
    description: 'Courier assigned',
    date: 'March 5',
  },
]
</script>

<template>
  <STimeline :items="items" />
</template>
```

  </template>
</Demo>

## Progress

`v-model` holds the `value` of the current item (or its index when the items have no `value`).
Everything before it is drawn as completed — a filled indicator with a check mark and a filled rail
segment; the current item is highlighted, the rest stay muted.

<Demo>
  <STimeline model-value="packed" :items="[
    { value: 'created', title: 'Order created', date: 'March 3' },
    { value: 'packed', title: 'Packed', date: 'March 4' },
    { value: 'shipped', title: 'Shipped', date: 'March 5' },
    { value: 'delivered', title: 'Delivered', date: 'March 7' },
  ]" />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const current = ref('packed')
const items = [
  {
    value: 'created',
    title: 'Order created',
    date: 'March 3',
  },
  {
    value: 'packed',
    title: 'Packed',
    date: 'March 4',
  },
  {
    value: 'shipped',
    title: 'Shipped',
    date: 'March 5',
  },
  {
    value: 'delivered',
    title: 'Delivered',
    date: 'March 7',
  },
]
</script>

<template>
  <STimeline
    v-model="current"
    :items="items"
  />
</template>
```

  </template>
</Demo>

## Icons and colors

`item.icon` replaces the dot with an icon from the registry, `item.color` accents a single event
with a name from the [palette](/style/palette), and `disabled` dims an event that did not happen.
The timeline-wide `color` sets the accent of the completed part, and `text-color` the content on
it — the check or the icon inside a completed indicator. An item that brings a light accent of its
own overrides that content color with `item.textColor`; without it the item falls back to the
timeline's.

<Demo>
  <STimeline model-value="review" color="teal" :items="[
    { value: 'draft', title: 'Draft', icon: 'pencil', date: 'March 1' },
    { value: 'review', title: 'In review', icon: 'eye', date: 'March 2' },
    { value: 'rejected', title: 'Rejected', icon: 'circle-x', color: 'negative', date: 'March 3' },
    { value: 'archived', title: 'Archived', icon: 'folder', disabled: true },
  ]" />

<template #code>

```vue
<template>
  <STimeline
    v-model="current"
    color="teal"
    :items="[
      { value: 'draft', title: 'Draft', icon: 'pencil', date: 'March 1' },
      { value: 'review', title: 'In review', icon: 'eye', date: 'March 2' },
      {
        value: 'rejected',
        title: 'Rejected',
        icon: 'circle-x',
        color: 'negative',
        date: 'March 3',
      },
      { value: 'archived', title: 'Archived', icon: 'folder', disabled: true },
    ]"
  />
</template>
```

  </template>
</Demo>

## Horizontal orientation

`orientation="horizontal"` lays the events out in a row with the rail running across; `size` scales
the indicator, the spacing and the type scale.

<Demo>
  <STimeline orientation="horizontal" size="sm" :model-value="2" :items="[
    { title: 'Ordered', date: 'Mon' },
    { title: 'Packed', date: 'Tue' },
    { title: 'Shipped', date: 'Wed' },
    { title: 'Delivered', date: 'Fri' },
  ]" />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const current = ref(2)
const items = [
  { title: 'Ordered', date: 'Mon' },
  { title: 'Packed', date: 'Tue' },
  { title: 'Shipped', date: 'Wed' },
  { title: 'Delivered', date: 'Fri' },
]
</script>

<template>
  <STimeline
    v-model="current"
    orientation="horizontal"
    size="sm"
    :items="items"
  />
</template>
```

  </template>
</Demo>

## Label placement

`label-placement` picks the side of the dot the event text goes to. `start` and `end` put it
beside the dot, `top` and `bottom` above or below it — and there the event becomes a centred
column, so the text lines up with the middle of the dot instead of starting at its edge. Without
the prop the text is beside the dot in a vertical timeline and below it in a horizontal one:
a shared default would move the text as soon as the orientation changed.

In a vertical timeline the text takes the column beside the dots, so the block is as wide as you
let it be: cap it with `max-width` to keep the rail close to the text instead of stretched across
the page.

<Demo>
  <STimeline style="max-width: 280px" label-placement="start" model-value="packed" :items="[
    { value: 'created', title: 'Order created', date: 'March 3' },
    { value: 'packed', title: 'Packed', date: 'March 4' },
    { value: 'shipped', title: 'Shipped', date: 'March 5' },
  ]" />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const current = ref('packed')
const items = [
  { value: 'created', title: 'Order created', date: 'March 3' },
  { value: 'packed', title: 'Packed', date: 'March 4' },
  { value: 'shipped', title: 'Shipped', date: 'March 5' },
]
</script>

<template>
  <STimeline
    v-model="current"
    label-placement="start"
    style="max-width: 280px"
    :items="items"
  />
</template>
```

  </template>
</Demo>

A horizontal timeline spans its container instead: the rail needs the width to space the events
evenly, and `top` or `bottom` centres each caption on its own dot.

<Demo>
  <STimeline orientation="horizontal" size="sm" label-placement="top" :model-value="2" :items="[
    { title: 'Ordered', date: 'Mon' },
    { title: 'Packed', date: 'Tue' },
    { title: 'Shipped', date: 'Wed' },
    { title: 'Delivered', date: 'Fri' },
  ]" />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const current = ref(2)
const items = [
  { title: 'Ordered', date: 'Mon' },
  { title: 'Packed', date: 'Tue' },
  { title: 'Shipped', date: 'Wed' },
  { title: 'Delivered', date: 'Fri' },
]
</script>

<template>
  <STimeline
    v-model="current"
    orientation="horizontal"
    size="sm"
    label-placement="top"
    :items="items"
  />
</template>
```

  </template>
</Demo>

## Collapsing on a narrow container

`stack-at` is the width in pixels below which a horizontal timeline turns into a vertical one. It
is compared with the width available to the timeline, not the window: inside a narrow column or a
modal the rail runs out of room long before the screen does. `narrow-orientation` sets what the
layout collapses to — `vertical` by default, or `horizontal` to get the reverse. Resize the window
to see the demo switch.

<Demo>
  <STimeline orientation="horizontal" size="sm" :stack-at="560" :model-value="2" :items="[
    { title: 'Ordered', date: 'Mon' },
    { title: 'Packed', date: 'Tue' },
    { title: 'Shipped', date: 'Wed' },
    { title: 'Delivered', date: 'Fri' },
  ]" />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const current = ref(2)
const items = [
  { title: 'Ordered', date: 'Mon' },
  { title: 'Packed', date: 'Tue' },
  { title: 'Shipped', date: 'Wed' },
  { title: 'Delivered', date: 'Fri' },
]
</script>

<template>
  <STimeline
    v-model="current"
    orientation="horizontal"
    size="sm"
    :stack-at="560"
    :items="items"
  />
</template>
```

  </template>
</Demo>

## Slots

`indicator`, `date`, `title` and `description` are scoped slots: each one receives
`{ item, index, active, completed }`, so the markup can depend on the state of the event.

<Demo>
  <STimeline model-value="build" :items="[
    { value: 'commit', title: 'Commit', date: '10:02' },
    { value: 'build', title: 'Build', date: '10:04' },
    { value: 'deploy', title: 'Deploy' },
  ]">
    <template #indicator="{ index, completed }">
      <span style="font-size: 11px; font-weight: 600">{{ completed ? '✓' : index + 1 }}</span>
    </template>
    <template #description="{ active }">
      <span v-if="active">Running right now</span>
    </template>
  </STimeline>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const current = ref('build')
const items = [
  { value: 'commit', title: 'Commit', date: '10:02' },
  { value: 'build', title: 'Build', date: '10:04' },
  { value: 'deploy', title: 'Deploy' },
]
</script>

<template>
  <STimeline
    v-model="current"
    :items="items"
  >
    <template #indicator="{ index, completed }">
      <span class="step-number">
        {{ completed ? '✓' : index + 1 }}
      </span>
    </template>
    <template #description="{ active }">
      <span v-if="active"> Running right now </span>
    </template>
  </STimeline>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="STimeline" />
