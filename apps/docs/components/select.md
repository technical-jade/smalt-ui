<script setup>
import { ref } from 'vue'
import { minLength, required } from '@smalt-ui/core'
const visited = ref([])
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
</script>

# Select

`SSelect` is a dropdown list built on Reka UI: keyboard navigation, ARIA roles,
positioning and a portal. Options are set with the `options` array of
`{ label, value, disabled?, icon? }`; `v-model` holds the `value` of the chosen option (a string),
or an array of strings for a multiple choice. The list opens in a portal and matches the width of
the field frame.

The label, hint, and error message come from [`SFormField`](/components/form-field). The label
floats by default: it sits in the frame in place of the placeholder and rises on focus or once a
value is chosen. `:floating-label="false"` puts it above the field, and in `use-tags` mode it is
always above. Without a visible label, set `aria-label`.

## Basic usage

Until a value is chosen, the field shows the `placeholder` in the muted color of the other fields'
placeholders, so it does not pass for a selected value.

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
<script setup>
import { ref } from 'vue'

const city = ref('')
const options = [
  { label: 'New York', value: 'nyc' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'Chicago', value: 'chi' },
  { label: 'Houston', value: 'hou', disabled: true },
]
</script>

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

## Pinned label

`floating-label="pinned"` pins the label to the top edge of the frame: it never drops into an
empty field, and the `placeholder` stays visible, both in a plain list and with `searchable`. See
[`SInput`](/components/input#pinned-label).

<ClientOnly>
<Demo>
  <SSelect label="Plan" floating-label="pinned" placeholder="Choose a plan" :options="[{ value: 'std', label: 'Standard' }, { value: 'exp', label: 'Express' }]" style="max-width: 280px" />

<template #code>

```vue
<script setup lang="ts">
const plans = [
  { value: 'std', label: 'Standard' },
  { value: 'exp', label: 'Express' },
]
</script>

<template>
  <SSelect
    label="Plan"
    floating-label="pinned"
    placeholder="Choose a plan"
    :options="plans"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Searching the list (`searchable`)

The `searchable` prop turns the select into an autocomplete field: an input renders instead of the
trigger, and the list narrows down to the typed query (keyboard navigation, the
`combobox`/`listbox`/`option` roles). After a pick, the field shows the label of the option. The arrow button at the end expands the
whole list; its accessible name is "Show options" (changed with `show-options-label`). When no
option matches, the list shows "No results found" (from the locale dictionary); `empty-text` sets
another text.

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
button. It is visible while a value is chosen and the field is not disabled, resets a single choice
to `undefined` and a multiple one to `[]`, and returns focus to the field. `clear-icon` changes its
icon, and `clear-label` changes its accessible name ("Clear" by default).

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
control), as in the other form fields: `prepend` goes first, `append` after the clear button but
before the expand arrow.

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
<script setup>
import { ref } from 'vue'

const framework = ref('vue')
const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' },
]
</script>

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
it, `error` an error message (the field is marked invalid), `required` adds the `*` marker and
announces the field as required through `aria-required`, and
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

const cities = [
  { label: 'New York', value: 'nyc' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'Chicago', value: 'chi' },
]
const frameworks = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
]
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
<script setup>
import { ref } from 'vue'

const framework = ref('vue')
const frameworks = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' },
]
</script>

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
<script setup>
import { ref } from 'vue'

const count = ref('1')
const options = Array.from({ length: 999 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}))
</script>

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
      :options="parcels"
      searchable
      label="Number of parcels"
      placeholder="Enter a number"
    />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const count = ref('1')
const options = Array.from({ length: 999 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}))
</script>

<template>
  <SSelect
    v-model="count"
    :options="options"
    searchable
    label="Number of parcels"
    placeholder="Enter a number"
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

Without `searchable`, the list opens with `Enter`, `Space`, and the arrow keys; the arrows and
`Home`/`End` move between options, typing letters jumps to the option with that label, `Enter` or
`Space` picks, and `Esc` closes the list. With `searchable`, the list opens on typing or `↓`, the
arrows move through the found options, `Enter` picks, and `Esc` closes.

The clear button returns focus to the field. In `searchable` mode Home and End move the caret in
the text, as in any input, instead of jumping to the first or last option.

The field emits `focus` when focus enters it or its list and `blur` once focus has left both,
however the list was opened: with the mouse the list takes focus right away, and `focus` still
fires then. Moving between the field and its open list emits nothing, so validation on blur runs
only when the user is done with the field.

## Size, shadow, and form submission

`size` (`sm`/`md`/`lg`) sets the field height: 32, 40, or 48 px. `flat` removes the shadow of the
dropdown panel, and `elevation` (0-5, see the [scale](/style/elevation)) sets its level and wins
over `flat`. With the `name` prop, the value is sent on native form submission through a hidden
`<select>` (with a multiple choice, one value per option), and `required` takes part in the native
form check: the browser moves focus to the visible field.

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
<script setup>
const cities = [
  { label: 'New York', value: 'nyc' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'Chicago', value: 'chi' },
]
</script>

<template>
  <SSelect
    :options="cities"
    label="Regular"
  />
  <SSelect
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

## Validation

`rules` checks the selection when focus leaves the field. Opening the list does not count as
leaving: the field checks once focus has left both the field and its list. The rules receive the
`v-model` value: a `string` (`undefined` while nothing is chosen), and a `string[]` with
`multiple` or `use-tags`. For a list, `minLength()` and `maxLength()` count the chosen options
("Select at least 2"). See the [Validation](/guide/validation) guide for the details.

Open the list, pick one city and close it: the field asks for one more.

<Demo>
  <ClientOnly>
    <SSelect
      v-model="visited"
      multiple
      label="Cities you visited"
      placeholder="Choose at least two"
      :options="cities"
      :rules="[required(), minLength(2)]"
    />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { minLength, required } from '@smalt-ui/core'

const visited = ref<string[]>([])
const cities = [
  { label: 'New York', value: 'nyc' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'Chicago', value: 'chi' },
]
</script>

<template>
  <SSelect
    v-model="visited"
    multiple
    label="Cities you visited"
    placeholder="Choose at least two"
    :options="cities"
    :rules="[required(), minLength(2)]"
  />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SSelect" />
