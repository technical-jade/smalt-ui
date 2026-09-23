<script setup>
import { ref } from 'vue'

const cities = [
  { label: 'New York', value: 'nyc' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'Chicago', value: 'chi' },
  { label: 'Houston', value: 'hou', disabled: true },
]
const city = ref('nyc')
const visited = ref(['nyc', 'chi'])

const views = [
  { label: 'Overview', value: 'overview', icon: 'home' },
  { label: 'Documents', value: 'docs', icon: 'file-text' },
  { label: 'Calendar', value: 'calendar', icon: 'calendar' },
]
const view = ref('overview')

const members = [
  { label: 'Ada Lovelace', value: 'ada', role: 'Owner' },
  { label: 'Grace Hopper', value: 'grace', role: 'Admin' },
  { label: 'Alan Turing', value: 'alan', role: 'Editor' },
]
const member = ref('grace')

const releases = Array.from({ length: 24 }, (_, i) => ({
  label: `Release 1.${i + 1}.0`,
  value: String(i + 1),
}))
const release = ref('3')
</script>

# Listbox

`SListbox` is an always-visible list of options: what a select shows inside its dropdown, usable on
its own. It fits a picker in a settings panel, a command list, a filter column next to a table — any
place where the choices should stay on screen instead of hiding behind a trigger.

Use [`SSelect`](./select) when the value belongs in a form field: it has a labelled frame, a
placeholder, a floating label and validation. `SListbox` is the bare surface — no frame chrome, no
trigger — so it also composes inside popovers, drawers and command palettes.

Options come from the `options` array, the value is bound with `v-model`: a single `value` by
default, an array of them with `multiple`.

Reka UI owns the interaction. Tab moves onto the list (focus lands on the active option, not on the
whole list), the arrow keys and Home/End move between options and skip the disabled ones, typing the
first letters of a label jumps to it, and Space or Enter picks the highlighted option. The list
reports itself as `role="listbox"` with `role="option"` rows, so it needs an accessible name: pass
`label`, or point your own `aria-labelledby` at a visible heading.

## Single selection

<Demo>
  <ClientOnly>
    <SListbox
      v-model="city"
      label="City"
      :options="cities"
      style="max-width: 280px"
    />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const city = ref('nyc')
const cities = [
  { label: 'New York', value: 'nyc' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'Chicago', value: 'chi' },
  { label: 'Houston', value: 'hou', disabled: true },
]
</script>

<template>
  <SListbox
    v-model="city"
    label="City"
    :options="cities"
  />
</template>
```

  </template>
</Demo>

Picking the selected option clears it, the way a checkbox does. Set `selection-behavior="replace"`
to keep exactly one option picked at all times. With `multiple`, `replace` also gives the keyboard a
range: `Shift` with the arrow keys, `Home` or `End` extends the selection from the last pick. The
range is a keyboard gesture — `Shift` with a click is an ordinary click.

## Multiple selection

With `multiple` the model becomes an array, every pick toggles its own option, and the list
announces itself as multi-selectable.

<Demo>
  <ClientOnly>
    <SListbox
      v-model="visited"
      multiple
      label="Visited cities"
      :options="cities"
      style="max-width: 280px"
    />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visited = ref(['nyc', 'chi'])
</script>

<template>
  <SListbox
    v-model="visited"
    multiple
    label="Visited cities"
    :options="cities"
  />
</template>
```

  </template>
</Demo>

## Option content

An option takes an `icon` — a name from the icon registry or a raw path. For anything richer, the
`option` slot replaces the whole row and receives the option itself along with its `selected` and
`disabled` state.

<Demo>
  <ClientOnly>
    <div style="display: flex; gap: 16px; flex-wrap: wrap">
      <SListbox
        v-model="view"
        label="View"
        :options="views"
        style="min-width: 200px"
      />
      <SListbox
        v-model="member"
        label="Member"
        :options="members"
        style="min-width: 240px"
      >
        <template #option="{ option, selected }">
          <span style="flex: 1">{{ option.label }}</span>
          <SBadge :variant="selected ? 'primary' : 'neutral'" size="sm">{{ option.role }}</SBadge>
        </template>
      </SListbox>
    </div>
  </ClientOnly>

<template #code>

```vue
<template>
  <SListbox
    v-model="view"
    label="View"
    :options="[
      { label: 'Overview', value: 'overview', icon: 'home' },
      { label: 'Documents', value: 'docs', icon: 'file-text' },
    ]"
  />

  <SListbox
    v-model="member"
    label="Member"
    :options="members"
  >
    <template #option="{ option, selected }">
      <span style="flex: 1">{{ option.label }}</span>
      <SBadge
        :variant="selected ? 'primary' : 'neutral'"
        size="sm"
      >
        {{ option.role }}
      </SBadge>
    </template>
  </SListbox>
</template>
```

  </template>
</Demo>

## Long lists (`max-height`)

`max-height` is the height the list may grow to before it starts scrolling; a number means pixels.
The list scrolls inside a [scroll area](./scroll-area), and moving the highlight with the keyboard
keeps the active option in view.

<Demo>
  <ClientOnly>
    <SListbox
      v-model="release"
      label="Release"
      :options="releases"
      :max-height="220"
      style="max-width: 280px"
    />
  </ClientOnly>

<template #code>

```vue
<template>
  <SListbox
    v-model="release"
    label="Release"
    :options="releases"
    :max-height="220"
  />
</template>
```

  </template>
</Demo>

## Empty state

With an empty `options` array the list shows a message from the locale dictionary — the
`listboxEmpty` key, "No options". Override it with `empty-text`, or replace it entirely with the
`empty` slot.

<Demo>
  <ClientOnly>
    <div style="display: flex; gap: 16px; flex-wrap: wrap">
      <SListbox
        label="Cities"
        :options="[]"
        style="min-width: 200px"
      />
      <SListbox
        label="Members"
        :options="[]"
        empty-text="Nobody has joined yet"
        style="min-width: 240px"
      />
    </div>
  </ClientOnly>

<template #code>

```vue
<template>
  <SListbox
    label="Members"
    :options="[]"
    empty-text="Nobody has joined yet"
  />

  <SListbox
    label="Members"
    :options="[]"
  >
    <template #empty>
      <SButton
        variant="ghost"
        size="sm"
      >
        Invite a teammate
      </SButton>
    </template>
  </SListbox>
</template>
```

  </template>
</Demo>

## Sizes and shape

`size` sets the option row height — `sm` (32px), `md` (40px) or `lg` (48px) — and `square` removes
the rounding of the frame.

<Demo>
  <ClientOnly>
    <div style="display: flex; gap: 16px; flex-wrap: wrap">
      <SListbox
        label="Small"
        size="sm"
        :options="views"
        style="min-width: 180px"
      />
      <SListbox
        label="Large"
        size="lg"
        square
        :options="views"
        style="min-width: 180px"
      />
    </div>
  </ClientOnly>

<template #code>

```vue
<template>
  <SListbox
    label="Small"
    size="sm"
    :options="views"
  />

  <SListbox
    label="Large"
    size="lg"
    square
    :options="views"
  />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SListbox" />
