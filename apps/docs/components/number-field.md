# Number Field

`SNumberField` is a number input with "plus"/"minus" buttons. It is built on Reka UI
(the `spinbutton` role, arrow-key stepping, `min`/`max` bounds, formatting) and
reuses `SFormField` (label, hint, error message, a11y), `SButton`-like step buttons
and `SIcon`. The value is bound with `v-model`.
`size` (`sm`/`md`/`lg`) matches the height of the other fields, so density presets reach it, and
`invalid`/`error` turn the frame red. Focus moving between the input and the buttons does not
emit `blur`.

<script setup>
import { ref } from 'vue'

const qty = ref(3)
const price = ref(50)
const nfInvalid = ref(5)
</script>

## Basic usage

<ClientOnly>
<Demo>
  <SNumberField v-model="qty" label="Quantity" hint="Items in the order" :min="0" :max="99" />

<template #code>

```vue
<template>
  <SNumberField
    v-model="qty"
    label="Quantity"
    :min="0"
    :max="99"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Step

<ClientOnly>
<Demo>
  <SNumberField v-model="price" label="Price" :step="10" :min="0" />

<template #code>

```vue
<template>
  <SNumberField
    v-model="price"
    label="Price"
    :step="10"
    :min="0"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## States and placeholder

`required` marks the field as required, `error` shows an error message and makes the field
invalid (explicit `invalid` does the same), `disabled` blocks the field and the step buttons,
`placeholder` is visible while the field is empty.

<ClientOnly>
<Demo>
  <div style="display: grid; gap: 16px; max-width: 220px">
    <SNumberField label="Quantity" required placeholder="0" :min="0" />
    <SNumberField label="Price" error="Enter a number greater than zero" :min="0" />
    <SNumberField v-model="nfInvalid" label="Invalid" invalid :min="0" />
    <SNumberField :model-value="3" label="Disabled" disabled />
  </div>

<template #code>

```vue
<template>
  <SNumberField
    v-model="qty"
    label="Quantity"
    required
    placeholder="0"
    :min="0"
  />
  <SNumberField
    v-model="price"
    label="Price"
    error="Enter a number greater than zero"
    :min="0"
  />
  <SNumberField
    v-model="qty"
    label="Invalid"
    invalid
    :min="0"
  />
  <SNumberField
    v-model="qty"
    label="Disabled"
    disabled
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## When this is not the right component

`SNumberField` is a stepper: a border with "minus" and "plus" buttons at the edges, and those
buttons cannot be turned off. It does not fit a form field that needs plain input with a unit on
the right — use [`SInput`](/components/input#numeric-mode) with the `numeric` prop instead: it has
the same precision and bounds constraints, plus `suffix`, slots and `size`.

```vue
<template>
  <!-- counter: stepping matters more than typing -->
  <SNumberField
    v-model="quantity"
    :min="1"
    :max="99"
    label="Quantity"
  />

  <!-- form field: typing and the unit matter -->
  <SInput
    v-model="weight"
    :numeric="{ decimals: 2, unsigned: true }"
    suffix="kg"
    label="Weight"
  />
</template>
```

## API

<ApiTable name="SNumberField" />
