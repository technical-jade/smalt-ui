<script setup>
import { ref, computed } from 'vue'
import { required } from '@smalt-ui/core'

const ALL = [
  { label: 'New York', value: 'nyc', region: 'New York' },
  { label: 'Los Angeles', value: 'la', region: 'California' },
  { label: 'Chicago', value: 'chi', region: 'Illinois' },
  { label: 'Houston', value: 'hou', region: 'Texas' },
  { label: 'San Francisco', value: 'sf', region: 'California' },
]

const query = ref('')
const city = ref()
const found = computed(() =>
  query.value ? ALL.filter((c) => c.label.toLowerCase().includes(query.value.toLowerCase())) : ALL,
)
const cityLabel = computed(() => ALL.find((c) => c.value === city.value)?.label)

const richQuery = ref('')
const richCity = ref()
const richFound = computed(() =>
  richQuery.value
    ? ALL.filter((c) => c.label.toLowerCase().includes(richQuery.value.toLowerCase()))
    : ALL,
)
const richLabel = computed(() => ALL.find((c) => c.value === richCity.value)?.label)

const pickedQuery = ref('')
const pickedCity = ref()
const pickedFound = computed(() =>
  pickedQuery.value
    ? ALL.filter((c) => c.label.toLowerCase().includes(pickedQuery.value.toLowerCase()))
    : ALL,
)
const pickedLabel = computed(() => ALL.find((c) => c.value === pickedCity.value)?.label)

const touchedQuery = ref('')
const touchedCity = ref()
const touched = ref(false)
const touchedFound = computed(() =>
  touchedQuery.value
    ? ALL.filter((c) => c.label.toLowerCase().includes(touchedQuery.value.toLowerCase()))
    : ALL,
)
const touchedLabel = computed(() => ALL.find((c) => c.value === touchedCity.value)?.label)

const DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com']
const email = ref('')
const emailOptions = computed(() => {
  const [name, domain] = email.value.split('@')
  if (!name || domain === undefined) return []
  return DOMAINS.filter((d) => d.startsWith(domain) && d !== domain).map((d) => ({
    label: `${name}@${d}`,
    value: d,
  }))
})
</script>

# Autocomplete

`SAutocomplete` is an input with suggestions from search results. Unlike
[`SSelect`](/components/select) with the `searchable` prop, the options come from outside and change
on every keystroke: the component **does not filter** `options` again, so results of fuzzy search,
transliteration, and index search get through.

It is built on Reka UI Combobox: `combobox`/`listbox`/`option` roles, keyboard navigation, and a
portaled panel. The label, hint and error message come from [`SFormField`](/components/form-field).
`required` adds the `*` marker to the label and `aria-required` to the input. The clear button
returns focus to the input. Inside a `<form>` the field submits the chosen
suggestion's `value` under `name`, not the typed text (in [`free-text`](#free-text) mode, the
text).

## Two v-models

The value and the query are separate: `v-model` holds the selected value, `v-model:search` holds
what the user typed. The app searches by the latter, usually with a debounce.

`v-model:search` receives only typed text: the label of the selected option is not written there,
so there is no extra request for the label. It is emptied when the component takes the input text
over itself, so a query the user can no longer see does not stay behind. Writing to it from
outside puts the text into the field — this is how a saved form is restored.

The label of the selected value comes from the `selected-label` prop: after a selection the
suggestion list is usually empty, so the label cannot be taken from it. While no value is
selected, `selected-label` does not touch the field text.

The `select` event fires on every suggestion pick, by mouse or keyboard. Unlike
`update:modelValue`, it also fires when the same suggestion is picked again, so the app can repeat
a check in a "picked → server rejected → picked again" scenario.

The `Home` and `End` keys stay with the input and move the caret within the text, not through the
suggestion list. The arrow keys navigate the list.

::: tip Focus inside the component is not leaving the field
Clicking a suggestion does not fire `blur`: a "left the field without picking" handler would run
before the selection, and if it changed the list, the item would vanish between mouse down and
mouse up. Moving with Tab from the input to the clear button is not leaving either. `blur` is
emitted when focus leaves the component by any path, including the next Tab from the clear
button; `focus` is emitted when focus enters it.
:::

`@focus` and `@blur` are events of the component, not of the input: they mark entering and leaving
the component. Other attributes that are not props (`autocomplete`, `maxlength`, `inputmode`) go
to the input itself; only `class` and `style` stay on the frame.

<Demo>
  <ClientOnly>
    <SAutocomplete
      v-model="city"
      v-model:search="query"
      :options="found"
      :selected-label="cityLabel"
      label="City"
      placeholder="Start typing"
    />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const city = ref()
const query = ref('')
const options = ref([])
const selectedLabel = ref()

const search = useDebounceFn(async (text) => {
  options.value = await api.searchCities(text)
}, 300)

watch(query, search)
</script>

<template>
  <SAutocomplete
    v-model="city"
    v-model:search="query"
    :options="options"
    :selected-label="selectedLabel"
    label="City"
    placeholder="Start typing"
  />
</template>
```

  </template>
</Demo>

## Free text

In `free-text` mode the value is the input text itself, and suggestions help complete it: an
address, an email with its domain, a search string with history. `v-model` receives the text on
every keystroke; `v-model:search` and `selected-label` are not needed. The app searches for
suggestions by the same `v-model`.

Picking a suggestion puts its `label` into the input and passes the whole option in the `select`
event: from there the app takes the option's data (say, the coordinates of an address) and may
write its own text into `v-model` — that text is what stays in the input. Otherwise the component
never changes the text on its own: neither when the panel closes nor when focus leaves the field.
The clear button makes the text an empty string.

While there are no suggestions, the panel is closed and there is no "Nothing found" placeholder:
in free text an empty result is a normal state. When suggestions for the typed text arrive, the
panel opens by itself, unless the user closed it with `Esc` or left the field. The `loading`
indicator is shown as usual. Enter picks the highlighted suggestion; if the panel opened while
typing, the first one is highlighted.

<Demo>
  <ClientOnly>
    <SAutocomplete
      v-model="email"
      free-text
      :options="emailOptions"
      label="Email"
      placeholder="name@example.com"
    />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { computed, ref } from 'vue'

const DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com']
const email = ref('')

const suggestions = computed(() => {
  const [name, domain] = email.value.split('@')
  if (!name || domain === undefined) return []
  return DOMAINS.filter((d) => d.startsWith(domain) && d !== domain).map((d) => ({
    label: `${name}@${d}`,
    value: d,
  }))
})

function onSelect(option) {
  console.log('Picked domain', option.value)
}
</script>

<template>
  <SAutocomplete
    v-model="email"
    free-text
    :options="suggestions"
    label="Email"
    placeholder="name@example.com"
    @select="onSelect"
  />
</template>
```

  </template>
</Demo>

## The typed text stays

Leaving the field without picking anything is not a reason to throw the query away: the text stays
in the input and in `v-model:search`, so the suggestions are still the answer to what is written
there. Closing the panel with `Esc` and opening it again keeps the text too.

The field replaces the text only when it has something truer to show:

- a suggestion is picked — the input switches to `selected-label`, because the text must match the
  value the form will submit. This also happens when the user edits the text after a pick and then
  leaves without picking again: the value is still the old one, so its label comes back;
- the value is cleared — by the clear button or by a reset of `v-model` from the app, after which
  the input is empty. A reset while the panel is open reaches the field as soon as it closes.

In both cases the typed query is gone with the text, so `v-model:search` becomes an empty string:
otherwise the next opening of the panel would list suggestions for text that is no longer in the
field. This applies to text the user typed; a query the app writes into `v-model:search` itself is
never touched, so after such a write the query and the field text can differ.

## Custom option row

The `#option` slot replaces the row content, since a suggestion is rarely a single line of text.
The `#prepend` slot places an element inside the frame on the left, usually an icon or a country
flag.

<Demo>
  <ClientOnly>
    <SAutocomplete
      v-model="richCity"
      v-model:search="richQuery"
      :options="richFound"
      :selected-label="richLabel"
      label="Delivery city"
      placeholder="Start typing"
      icon="map-pin"
    >
      <template #option="{ option }">
        <div>
          <div>{{ option.label }}</div>
          <div style="font-size: var(--s-font-size-xs); color: var(--s-color-text-muted)">
            {{ option.region }}
          </div>
        </div>
      </template>
    </SAutocomplete>
  </ClientOnly>

<template #code>

```vue
<template>
  <SAutocomplete
    v-model="city"
    v-model:search="query"
    :options="options"
    label="Delivery city"
    icon="map-pin"
  >
    <template #prepend>
      <CountryFlag :code="country" />
    </template>
    <template #option="{ option }">
      <div>
        <div>{{ option.label }}</div>
        <div class="s-text-caption">{{ option.region }}</div>
      </div>
    </template>
  </SAutocomplete>
</template>
```

  </template>
</Demo>

## Loading and empty results

While a request is in flight, `loading` shows an indicator instead of the list. When there are no
suggestions, the panel shows a placeholder: the `empty-text` prop sets its text, the `#empty` slot
sets its markup.

<Demo>
  <ClientOnly>
    <SAutocomplete
      :options="[]"
      loading
      label="City (searching)"
      placeholder="Start typing"
    />
    <SAutocomplete
      :options="[]"
      label="City (nothing found)"
      empty-text="No matching city"
      placeholder="Start typing"
    />
  </ClientOnly>

<template #code>

```vue
<template>
  <SAutocomplete
    :options="options"
    :loading="pending"
    empty-text="No matching city"
    label="City"
  />
</template>
```

  </template>
</Demo>

## `SSelect` or `SAutocomplete`

| Situation                                                  | Component                   |
| ---------------------------------------------------------- | --------------------------- |
| The full list of options is known in advance               | `SSelect`                   |
| Many options, search over a ready list                     | `SSelect` with `searchable` |
| Options come from the server and change on every keystroke | `SAutocomplete`             |
| Fuzzy search, transliteration, or index search is needed   | `SAutocomplete`             |
| The value is free text that suggestions help complete      | `SAutocomplete free-text`   |

## Validation

`rules` checks the value when focus leaves the field; picking a suggestion with the mouse is not
leaving it. The rules receive the `v-model` value: the `value` of the chosen suggestion, not the
typed query, so `required()` fails on text that matches no suggestion. The value stays
`undefined` until a suggestion is picked. In `free-text` mode the rules check the input text. See the [Validation](/guide/validation) guide for the
details.

Type "chi" and move focus out of the field without picking a suggestion: the typed text is not a
choice, so the error appears — and the text stays in the field, so it is clear what the error is
about. Pick Chicago and the error goes away.

<Demo>
  <ClientOnly>
    <SAutocomplete
      v-model="pickedCity"
      v-model:search="pickedQuery"
      :options="pickedFound"
      :selected-label="pickedLabel"
      label="City"
      placeholder="Start typing"
      :rules="[required('Pick a city from the list')]"
    />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { required } from '@smalt-ui/core'

const cities = [
  { label: 'New York', value: 'nyc' },
  { label: 'Chicago', value: 'chi' },
  { label: 'Houston', value: 'hou' },
]

const city = ref<string>()
const query = ref('')
const options = computed(() =>
  cities.filter((c) => c.label.toLowerCase().includes(query.value.toLowerCase())),
)
const selectedLabel = computed(() => cities.find((c) => c.value === city.value)?.label)
</script>

<template>
  <SAutocomplete
    v-model="city"
    v-model:search="query"
    :options="options"
    :selected-label="selectedLabel"
    label="City"
    placeholder="Start typing"
    :rules="[required('Pick a city from the list')]"
  />
</template>
```

  </template>
</Demo>

If a form checks its fields itself, without `rules`, mark the field as touched on `@blur`. The
event arrives however focus leaves the component: by clicking elsewhere or with Tab, including
through the clear button. Type "chi" and leave the field with two Tab presses — the error shows up
right away, not after the form is submitted.

<Demo>
  <ClientOnly>
    <SAutocomplete
      v-model="touchedCity"
      v-model:search="touchedQuery"
      :options="touchedFound"
      :selected-label="touchedLabel"
      label="Departure city"
      placeholder="Start typing"
      :error="touched && !touchedCity ? 'Enter the departure city' : undefined"
      @blur="touched = true"
    />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const city = ref<string>()
const touched = ref(false)
</script>

<template>
  <SAutocomplete
    v-model="city"
    v-model:search="query"
    :options="options"
    :selected-label="selectedLabel"
    label="Departure city"
    :error="touched && !city ? 'Enter the departure city' : undefined"
    @blur="touched = true"
  />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SAutocomplete" />
