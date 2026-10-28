# Tree

`STree` shows a hierarchy of nodes (a file tree, nested categories) with expandable branches
and selection. It is fully keyboard operable (arrow keys navigate and expand, `Enter`/`Space`
select), and Reka handles the `tree`/`treeitem` roles and focus. The data is a recursive `items`
array; the selected node is available through `v-model`.

## Basic usage

<script setup>
import { ref } from 'vue'
const folder = 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z'
const file = 'M6 2h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z'
const items = [
  {
    label: 'src',
    value: 'src',
    icon: folder,
    children: [
      {
        label: 'components',
        value: 'components',
        icon: folder,
        children: [
          {
            label: 'Button.vue',
            value: 'button',
            icon: file
          },
          {
            label: 'Input.vue',
            value: 'input',
            icon: file
          }
        ],
      },
      {
        label: 'main.ts',
        value: 'main',
        icon: file
      }
    ],
  },
  {
    label: 'package.json',
    value: 'pkg',
    icon: file
  }
]
const selected = ref()
const namedItems = [
  {
    label: 'src',
    value: 'src',
    icon: 'folder',
    children: [
      {
        label: 'main.ts',
        value: 'main',
        icon: 'file-text',
      },
      {
        label: 'App.vue',
        value: 'app',
        icon: 'file-text',
      },
    ],
  },
  {
    label: 'package.json',
    value: 'pkg',
    icon: 'file-text',
  },
]
const selectedNamed = ref()
const selectedMulti = ref([])
</script>

<Demo>
  <ClientOnly>
    <STree v-model="selected" :items="items" :default-expanded="['src']" style="max-width: 280px" />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { ref } from 'vue'
const items = [
  {
    label: 'src',
    value: 'src',
    icon: folderPath,
    children: [
      {
        label: 'main.ts',
        value: 'main',
        icon: filePath,
      },
    ],
  },
  {
    label: 'package.json',
    value: 'pkg',
    icon: filePath,
  },
]
const selected = ref()
</script>

<template>
  <STree
    v-model="selected"
    :items="items"
    :default-expanded="['src']"
  />
</template>
```

  </template>
</Demo>

## Node icons

The `icon` field of a node takes a name from the icon registry (`folder`, `file-text` and others,
see [Icons](/guide/icons)) or a raw SVG path, as in the first example. A name is more convenient:
the data does not have to carry paths.

<Demo>
  <ClientOnly>
    <STree v-model="selectedNamed" :items="namedItems" :default-expanded="['src']" style="max-width: 280px" />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { ref } from 'vue'
const items = [
  {
    label: 'src',
    value: 'src',
    icon: 'folder',
    children: [
      {
        label: 'main.ts',
        value: 'main',
        icon: 'file-text',
      },
    ],
  },
  {
    label: 'package.json',
    value: 'pkg',
    icon: 'file-text',
  },
]
const selected = ref()
</script>

<template>
  <STree
    v-model="selected"
    :items="items"
    :default-expanded="['src']"
  />
</template>
```

  </template>
</Demo>

## Multiple selection

`multiple` allows selecting several nodes at once — `v-model` then holds an array of the
selected nodes. A click, <kbd>Enter</kbd> or <kbd>Space</kbd> adds a node to the selection or
removes it; no <kbd>Ctrl</kbd>/<kbd>Shift</kbd> modifier is needed.

<Demo>
  <ClientOnly>
    <STree v-model="selectedMulti" :items="namedItems" multiple :default-expanded="['src']" style="max-width: 280px" />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const selected = ref([])
const items = [
  {
    label: 'src',
    value: 'src',
    icon: 'folder',
    children: [
      { label: 'Button.vue', value: 'button', icon: 'file-text' },
      { label: 'Input.vue', value: 'input', icon: 'file-text' },
    ],
  },
  { label: 'README.md', value: 'readme', icon: 'file-text' },
]
</script>

<template>
  <STree
    v-model="selected"
    :items="items"
    multiple
    :default-expanded="['src']"
  />
</template>
```

  </template>
</Demo>

## Selection and expansion

- A click selects a node and, on a branch, also expands or collapses it. A second click on the
  selected node clears the selection: without `multiple`, `v-model` becomes `undefined`.
- `v-model` receives the node object, not its `value`. In single-selection mode it is a shallow
  copy of the node from `items`, so compare the selected node by `value`, not by reference.
- A node is keyed by `value`, or by `label` when there is none. `default-expanded` and selection
  work by key, so give nodes with identical labels on one level a `value`; otherwise they are
  selected and expanded together.
- A node with `disabled` cannot be selected or expanded, and focus skips it.

## Keyboard and accessibility

The root gets the `tree` role and the nodes `treeitem` with `aria-expanded` on branches,
`aria-level`, `aria-setsize` and `aria-posinset`; with `multiple` the root gets
`aria-multiselectable`. The tree has no accessible name of its own: pass `aria-label`, which lands
on the root element.

| Key            | Action                                                        |
| -------------- | ------------------------------------------------------------- |
| ↑ / ↓          | Previous / next visible node                                  |
| →              | Expands a branch; on an expanded one moves to the first child |
| ←              | Collapses a branch; on a collapsed one moves to the parent    |
| Home / End     | First / last visible node                                     |
| Enter / Space  | Selects the node or clears the selection                      |
| Printable keys | Move focus to the nearest node whose label starts with them   |

## API

<ApiTable name="STree" />
