<script setup>
import { computed, ref } from 'vue'

const basicOpen = ref(false)
const shortcutOpen = ref(false)
const serverOpen = ref(false)
const slotOpen = ref(false)
const emptyOpen = ref(false)

const ran = ref('')

const groups = [
  {
    label: 'Files',
    items: [
      { id: 'new', label: 'New file', icon: 'file-text', shortcut: ['meta', 'n'] },
      { id: 'open', label: 'Open file', icon: 'folder', shortcut: ['meta', 'o'] },
      { id: 'copy', label: 'Duplicate file', icon: 'copy', keywords: ['clone', 'fork'] },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { id: 'home', label: 'Go to dashboard', icon: 'home', description: 'Overview of the workspace' },
      { id: 'settings', label: 'Open settings', icon: 'settings', shortcut: ['meta', ','] },
      { id: 'trash', label: 'Open trash', icon: 'trash-2', disabled: true },
    ],
  },
]

const people = [
  { id: 'ada', label: 'Ada Lovelace', description: 'Owner', icon: 'user' },
  { id: 'grace', label: 'Grace Hopper', description: 'Admin', icon: 'user' },
  { id: 'alan', label: 'Alan Turing', description: 'Editor', icon: 'user' },
]

const search = ref('')
const loading = ref(false)
let timer

const serverGroups = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return []
  return [{ label: 'People', items: people.filter((p) => p.label.toLowerCase().includes(query)) }]
})

function onSearch(value) {
  search.value = value
  loading.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (loading.value = false), 400)
}

function run(item) {
  ran.value = item.label
}
</script>

# Command Palette

`SCommandPalette` is the ⌘K window: one search field over every action in the application, grouped
and reachable from the keyboard. It opens over the page as a modal dialog, filters the commands as
the user types, and reports the chosen one through `select` — running it is up to the application.

The component binds the global shortcut itself: Cmd + K on macOS, Ctrl + K elsewhere. Use
`shortcut-key` to pick another letter or `:shortcut-key="false"` to bind nothing and open the
palette only through `v-model:open`. The binding stays out of the way of text the user is writing:
a keystroke that starts in an input, a textarea or a rich-text area is left to that field. With
several palettes mounted, only the most recently mounted one answers the shortcut.

Reka UI owns the interaction. The search field is a `combobox` over a `listbox`: the arrow keys and
Home/End move the highlight, skipping group headings and disabled rows, Enter runs the highlighted
command, and the active row scrolls into view. Focus stays in the input the whole time — the
highlighted row is announced through `aria-activedescendant`. Opening the palette focuses the
search field, Escape closes it, and focus returns to whatever had it before.

Each command is `{ id, label }` plus the optional `description`, `icon`, `shortcut`, `keywords` and
`disabled`. `shortcut` is a hint drawn with [`SKbd`](./kbd) — the application still binds those keys
itself. `keywords` widen the search without showing up in the row.

## Basic usage

Commands come in groups, each with its own heading. Selecting one closes the palette.

<ClientOnly>
<Demo>
  <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap">
    <SButton @click="basicOpen = true">Open palette</SButton>
    <span
      v-if="ran"
      style="color: var(--s-color-text-muted)"
      >Ran: {{ ran }}</span
    >
  </div>
  <SCommandPalette
    v-model:open="basicOpen"
    :groups="groups"
    :shortcut-key="false"
    @select="run"
  />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { SCommandGroup, SCommandItem } from '@smalt-ui/core'

const open = ref(false)

const groups: SCommandGroup[] = [
  {
    label: 'Files',
    items: [
      { id: 'new', label: 'New file', icon: 'file-text', shortcut: ['meta', 'n'] },
      { id: 'open', label: 'Open file', icon: 'folder', shortcut: ['meta', 'o'] },
      { id: 'copy', label: 'Duplicate file', icon: 'copy', keywords: ['clone', 'fork'] },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { id: 'home', label: 'Go to dashboard', description: 'Overview of the workspace' },
      { id: 'trash', label: 'Open trash', disabled: true },
    ],
  },
]

function run(item: SCommandItem) {
  // perform the command
}
</script>

<template>
  <SButton @click="open = true">Open palette</SButton>
  <SCommandPalette
    v-model:open="open"
    :groups="groups"
    @select="run"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## The global shortcut

This is the only example on the page with the shortcut live: press **⌘ K** (or **Ctrl K**) anywhere
outside a text field. Every other demo here sets `:shortcut-key="false"` so the page does not take
the combination away from the reader's browser.

<ClientOnly>
<Demo>
  <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap">
    <span style="color: var(--s-color-text-muted)">Press</span>
    <SKbd value="meta" />
    <SKbd value="k" />
  </div>
  <SCommandPalette
    v-model:open="shortcutOpen"
    :groups="groups"
    @select="run"
  />

<template #code>

```vue
<template>
  <!-- Cmd/Ctrl + K by default; `shortcut-key` picks another letter -->
  <SCommandPalette
    v-model:open="open"
    :groups="groups"
    shortcut-key="k"
    @select="run"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

The footer slot is a good place for the keyboard hints. It is empty by default, because the wording
belongs to the application's own vocabulary:

<ClientOnly>
<Demo>
  <SButton
    variant="outline"
    @click="slotOpen = true"
  >
    Open with a footer and custom rows
  </SButton>
  <SCommandPalette
    v-model:open="slotOpen"
    :groups="[{ label: 'Team', items: people }]"
    :shortcut-key="false"
    @select="run"
  >
    <template #item="{ item, active }">
      <SAvatar
        :fallback="item.label.slice(0, 1)"
        size="sm"
      />
      <span style="flex: 1">{{ item.label }}</span>
      <SBadge
        size="sm"
        :variant="active ? 'primary' : 'neutral'"
      >
        {{ item.description }}
      </SBadge>
    </template>
    <template #footer>
      <SKbd
        value="enter"
        size="sm"
      />
      <span>to select</span>
      <SKbd
        value="up"
        size="sm"
      />
      <SKbd
        value="down"
        size="sm"
      />
      <span>to navigate</span>
    </template>
  </SCommandPalette>

<template #code>

```vue
<template>
  <SCommandPalette
    v-model:open="open"
    :groups="groups"
    @select="run"
  >
    <template #item="{ item, active }">
      <SAvatar
        :fallback="item.label.slice(0, 1)"
        size="sm"
      />
      <span style="flex: 1">{{ item.label }}</span>
      <SBadge
        size="sm"
        :variant="active ? 'primary' : 'neutral'"
      >
        {{ item.description }}
      </SBadge>
    </template>

    <template #footer>
      <SKbd
        value="enter"
        size="sm"
      />
      <span>to select</span>
      <SKbd
        value="up"
        size="sm"
      />
      <SKbd
        value="down"
        size="sm"
      />
      <span>to navigate</span>
    </template>
  </SCommandPalette>
</template>
```

  </template>
</Demo>
</ClientOnly>

The `item` slot receives `{ item, active }`, where `active` is true for the highlighted row.

## Server-side search

With `:filter="false"` the palette lists `groups` exactly as they arrive: bind `v-model:search` to
run the query on the server, and raise `loading` while the request is in flight.

<ClientOnly>
<Demo>
  <SButton
    variant="outline"
    @click="serverOpen = true"
  >
    Search people
  </SButton>
  <SCommandPalette
    v-model:open="serverOpen"
    :search="search"
    :groups="serverGroups"
    :filter="false"
    :loading="loading"
    :shortcut-key="false"
    placeholder="Search people"
    empty-text="Type a name to search"
    @update:search="onSearch"
    @select="run"
  />

<template #code>

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const open = ref(false)
const search = ref('')
const loading = ref(false)
const groups = ref([])

watch(search, async (query) => {
  if (!query) {
    groups.value = []
    return
  }
  loading.value = true
  groups.value = [{ label: 'People', items: await searchPeople(query) }]
  loading.value = false
})
</script>

<template>
  <SCommandPalette
    v-model:open="open"
    v-model:search="search"
    :groups="groups"
    :filter="false"
    :loading="loading"
    placeholder="Search people"
    empty-text="Type a name to search"
    @select="run"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

The query is cleared when the palette closes, so the next opening starts from the full list.

## Empty state

Without matches the palette shows the text from `empty-text` — or from the locale dictionary when
the prop is not set. The `empty` slot replaces the whole block.

<ClientOnly>
<Demo>
  <SButton
    variant="outline"
    @click="emptyOpen = true"
  >
    Open an empty palette
  </SButton>
  <SCommandPalette
    v-model:open="emptyOpen"
    :groups="[]"
    :shortcut-key="false"
  >
    <template #empty>
      <SEmptyState
        size="sm"
        icon="search"
        title="No commands yet"
        description="Actions appear here once the workspace has content."
      />
    </template>
  </SCommandPalette>

<template #code>

```vue
<template>
  <SCommandPalette
    v-model:open="open"
    :groups="[]"
  >
    <template #empty>
      <SEmptyState
        size="sm"
        icon="search"
        title="No commands yet"
        description="Actions appear here once the workspace has content."
      />
    </template>
  </SCommandPalette>
</template>
```

  </template>
</Demo>
</ClientOnly>

## API

<ApiTable name="SCommandPalette" />
