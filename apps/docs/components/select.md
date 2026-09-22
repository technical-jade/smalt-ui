<script setup>
import { ref } from 'vue'
const framework = ref('vue')
const cities = [
  { label: 'New York', value: 'nyc' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'Chicago', value: 'chi' },
]
const pickedComma = ref(['nyc', 'la'])
const pickedTags = ref(['nyc'])

const parcels = Array.from({ length: 999 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}))
const parcelCount = ref('1')
const parcelSearch = ref('12')
</script>

# Select

`SSelect` is a dropdown list built on Reka UI: keyboard navigation, ARIA roles,
positioning and a portal. Options are set with the `options` array, the value is bound with
`v-model`.

## Basic usage

<Demo>
  <ClientOnly>
    <SSelect
      :options="[
        { label: 'New York', value: 'nyc' },
        { label: 'Los Angeles', value: 'la' },
        { label: 'Chicago', value: 'chi' },
        {
          label: 'Houston',
          value: 'hou',
          disabled: true
        }
      ]"
      placeholder="Choose a city"
      aria-label="City"
    />
  </ClientOnly>

<template #code>

```vue
<template>
  <SSelect
    v-model="city"
    :options="options"
    placeholder="Choose a city"
    aria-label="City"
  />
</template>
```

  </template>
</Demo>

## Searching the list (`searchable`)

The `searchable` prop turns the select into an autocomplete field: an input renders instead of the
trigger, and the list narrows down to the typed query (keyboard navigation, the
`combobox`/`listbox`/`option` roles). The `empty-text` prop sets the message shown when no option
matches.

<Demo>
  <ClientOnly>
    <SSelect
      searchable
      placeholder="Start typing a city…"
      empty-text="City not found"
      aria-label="City"
      :options="cities"
    />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const city = ref()
const cities = [
  { label: 'New York', value: 'nyc' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'Chicago', value: 'chi' },
]
</script>

<template>
  <SSelect
    v-model="city"
    searchable
    placeholder="Start typing a city…"
    empty-text="City not found"
    aria-label="City"
    :options="cities"
  />
</template>
```

  </template>
</Demo>

## Multiple selection (`multiple` / `use-tags`)

The `multiple` prop enables selecting several options: `v-model` becomes a `string[]`, and the
selected labels are listed in the field separated by commas. The `use-tags` prop (implies
`multiple`) displays the selection as [`STag`](/components/tag) chips with a remove button. Both
modes also work with `searchable`.

<Demo>
  <ClientOnly>
      <SSelect v-model="pickedComma" multiple label="Cities (comma-separated)" placeholder="Choose cities" :options="cities" />
      <SSelect v-model="pickedTags" use-tags label="Cities (tags)" placeholder="Add a city" :options="cities" />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const picked = ref(['nyc', 'la'])
const cities = [
  { label: 'New York', value: 'nyc' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'Chicago', value: 'chi' },
]
</script>

<template>
  <SSelect
    v-model="picked"
    multiple
    label="Cities (comma-separated)"
    :options="cities"
  />
  <SSelect
    v-model="picked"
    use-tags
    label="Cities (tags)"
    :options="cities"
  />
</template>
```

  </template>
</Demo>

## Icons and clearing

The `icon` prop draws a leading icon inside the field; an option has an `icon` field (an icon
before the label); `dropdown-icon` changes the expand indicator, and `clearable` adds a clear
button.

<Demo>
  <ClientOnly>
    <SSelect
      v-model="framework"
      icon="search"
      dropdown-icon="chevron-down"
      clearable
      aria-label="Framework"
      :options="[
        { label: 'Vue', value: 'vue', icon: 'circle-check' },
        { label: 'React', value: 'react', icon: 'circle-check' },
        { label: 'Svelte', value: 'svelte', icon: 'circle-check' },
      ]"
    />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const framework = ref('vue')
</script>

<template>
  <SSelect
    v-model="framework"
    icon="search"
    dropdown-icon="chevron-down"
    clearable
    aria-label="Framework"
    :options="[
      { label: 'Vue', value: 'vue', icon: 'circle-check' },
      { label: 'React', value: 'react', icon: 'circle-check' },
      { label: 'Svelte', value: 'svelte', icon: 'circle-check' },
    ]"
  />
</template>
```

  </template>
</Demo>

## `prepend` / `append` slots

The `prepend` and `append` slots put arbitrary content inside the field border (before/after the
control), as in the other form fields.

<Demo>
  <ClientOnly>
    <SSelect
      v-model="framework"
      aria-label="Framework"
      :options="[
        { label: 'Vue', value: 'vue' },
        { label: 'React', value: 'react' },
        { label: 'Svelte', value: 'svelte' },
      ]"
    >
      <template #prepend><SIcon icon="filter" :size="16" /></template>
    </SSelect>
  </ClientOnly>

<template #code>

```vue
<template>
  <SSelect
    v-model="framework"
    aria-label="Framework"
    :options="options"
  >
    <template #prepend>
      <SIcon
        icon="filter"
        :size="16"
      />
    </template>
  </SSelect>
</template>
```

  </template>
</Demo>

## Label, hint and error

`SSelect` is built on `SFormField`: `label` renders a label above the field, `hint` a hint below
it, `error` an error message (the field is marked invalid), `required` adds the `*` marker, and
`invalid` marks the field invalid explicitly.

<Demo>
  <ClientOnly>
      <SSelect label="City" hint="Main office" placeholder="Choose a city" :options="cities" />
      <SSelect label="City" error="This field is required" required placeholder="Choose a city" :options="cities" />
      <SSelect label="City" invalid placeholder="Choose a city" :options="cities" />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
const cities = [
  { label: 'New York', value: 'nyc' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'Chicago', value: 'chi' },
]
</script>

<template>
  <SSelect
    label="City"
    hint="Main office"
    placeholder="Choose a city"
    :options="cities"
  />
  <SSelect
    label="City"
    error="This field is required"
    required
    placeholder="Choose a city"
    :options="cities"
  />
  <SSelect
    label="City"
    invalid
    placeholder="Choose a city"
    :options="cities"
  />
</template>
```

  </template>
</Demo>

## States and clearing

`disabled` blocks the select. The `clearable` flag adds a button that clears the selection, and
`clearIcon` sets a custom icon for that button.

<Demo>
  <ClientOnly>
      <SSelect label="Disabled" disabled placeholder="Unavailable" :options="cities" />
      <SSelect v-model="framework" clearable clear-icon="circle-x" aria-label="Framework" :options="[{ label: 'Vue', value: 'vue' }, { label: 'React', value: 'react' }]" />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const framework = ref('vue')
</script>

<template>
  <SSelect
    label="Disabled"
    disabled
    placeholder="Unavailable"
    :options="cities"
  />
  <SSelect
    v-model="framework"
    clearable
    clear-icon="circle-x"
    aria-label="Framework"
    :options="frameworks"
  />
</template>
```

  </template>
</Demo>

## `append` slot

The `append` slot puts content inside the field border on the right (after the control) — the
counterpart of `prepend`.

<Demo>
  <ClientOnly>
    <SSelect v-model="framework" aria-label="Framework" :options="[{ label: 'Vue', value: 'vue' }, { label: 'React', value: 'react' }, { label: 'Svelte', value: 'svelte' }]">
      <template #append><SIcon icon="tag" :size="16" /></template>
    </SSelect>
  </ClientOnly>

<template #code>

```vue
<template>
  <SSelect
    v-model="framework"
    aria-label="Framework"
    :options="frameworks"
  >
    <template #append>
      <SIcon
        icon="tag"
        :size="16"
      />
    </template>
  </SSelect>
</template>
```

  </template>
</Demo>

## Long list

The panel has a limited height and scrolls inside: the limit is the smaller of `max-height`
(`20rem` by default) and the free space to the edge of the window. The prop takes either a number
(pixels) or a string with any unit.

Both selects below have **999 options**. On the left is the default limit, on the right a smaller
custom one.

<Demo>
  <ClientOnly>
    <SSelect
      v-model="parcelCount"
      :options="parcels"
      label="Number of parcels"
    />
    <SSelect
      v-model="parcelCount"
      :options="parcels"
      label="Same list, max-height 160"
      :max-height="160"
    />
  </ClientOnly>

<template #code>

```vue
<template>
  <SSelect
    v-model="count"
    :options="options"
    label="Number of parcels"
  />
  <SSelect
    v-model="count"
    :options="options"
    :max-height="160"
    label="With a custom limit"
  />
</template>
```

  </template>
</Demo>

With a hundred or more options, `searchable` mode turns on virtualization: only the visible rows
are kept in the DOM, so opening the list does not freeze the tab. It is controlled by the
`virtualize` prop (`true`/`false` is an explicit choice, a number is a custom threshold). Open the
list below and look in the inspector: there are a couple dozen nodes, not a thousand.

<Demo>
  <ClientOnly>
    <SSelect
      v-model="parcelCount"
      v-model:search="parcelSearch"
      :options="parcels"
      searchable
      label="Number of parcels"
      placeholder="Enter a number"
    />
  </ClientOnly>

<template #code>

```vue
<template>
  <SSelect
    v-model="count"
    :options="options"
    searchable
    :virtualize="50"
    label="Number of parcels"
  />
</template>
```

  </template>
</Demo>

::: warning Virtualization is for `searchable` only
The regular dropdown list is built on the Select primitive, and Reka UI has no virtualizer for it.
If there really are thousands of options, enable `searchable`: it also makes them actually
findable.
:::

## Keyboard and focus

The clear button returns focus to the field. In `searchable` mode Home and End move the caret in
the text, as in any input, instead of jumping to the first or last option.

## Square corners

`square` removes the rounding from both the border and the dropdown panel — open both lists and
compare. The prop can also be set globally, with one key for the whole app: see
[Shape](/style/shape).

<Demo>
  <ClientOnly>
    <SSelect
      :options="cities"
      label="Regular"
    />
    <SSelect
      :options="cities"
      label="square"
      square
    />
  </ClientOnly>

<template #code>

```vue
<template>
  <SSelect
    v-model="city"
    :options="cities"
    label="square"
    square
  />
</template>
```

  </template>
</Demo>

## Width

The border takes the parent's width and shrinks with it — in a narrow grid column the select does
not overflow its boundary. If you still need a minimum, set it with a variable:

```css
.filters .s-select__control {
  --s-select-min-width: 12rem;
}
```

## List vs. search suggestions

`SSelect` picks from a **known** set: `searchable` filters the same `options` by substring. When
the options come from the server and change on every keystroke, use
[`SAutocomplete`](/components/autocomplete) — it does not filter the suggestions again and passes
the query text out.

## API

<ApiTable name="SSelect" />
