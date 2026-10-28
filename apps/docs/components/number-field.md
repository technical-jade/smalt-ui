# Number Field

`SNumberField` is a number input with "plus"/"minus" buttons. It is built on Reka UI
(the `spinbutton` role, arrow-key stepping, `min`/`max` bounds, formatting) and
reuses `SFormField` (label, hint, error message, a11y), `SButton`-like step buttons
and `SIcon`. The value is bound with `v-model`. The label stands above the field;
[`floating-label`](#floating-label) puts it on the frame edge.
`size` (`sm`/`md`/`lg`) matches the height of the other fields, so density presets reach it, and
`invalid`/`error` turn the frame red. Focus moving between the input and the buttons does not
emit `blur`.

<script setup>
import { ref } from 'vue'
import { max, min, required } from '@smalt-ui/core'

const age = ref(null)
const qty = ref(3)
const price = ref(50)
const nfInvalid = ref(5)
const amount = ref(1234.5)
const weight = ref(1)
const parcels = ref(2)
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

## Number format

The number is formatted and parsed by the library locale, `1,234.5` by default, the same way date
fields follow it. The `locale` prop takes a BCP 47 tag and sets the format of one field: with
`de-DE` the field shows `1.234,5` and reads a comma as the decimal separator. To use one format
across the app, set `locale` as a [`global` prop default](/guide/i18n#date-time-and-number-format).
A screen reader announces the field as a "number field", the `numberField` string of the
[locale dictionary](/guide/i18n#dictionary-keys-smessages).

<ClientOnly>
<Demo>
  <SNumberField v-model="amount" label="Betrag" locale="de-DE" :step="0.5" />

<template #code>

```vue
<template>
  <SNumberField
    v-model="amount"
    label="Betrag"
    locale="de-DE"
    :step="0.5"
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

## Width

By default the field is as wide as its content: a `4rem` input with the buttons at its edges.
`stretch` spreads the field across the column, like [`SInput`](/components/input): the buttons
stay at the edges and the input takes the free space. The `--s-number-field-input-width` CSS
variable sets another fixed input width.

<ClientOnly>
<Demo>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; max-width: 480px">
    <SNumberField v-model="weight" label="Weight, kg" stretch :min="0" />
    <SInput label="Contents" :floating-label="false" placeholder="Box" />
    <SNumberField v-model="parcels" label="Parcels" :min="1" style="--s-number-field-input-width: 6rem" />
  </div>

<template #code>

```vue
<template>
  <div class="row">
    <SNumberField
      v-model="weight"
      label="Weight, kg"
      stretch
      :min="0"
    />
    <SInput
      label="Contents"
      :floating-label="false"
      placeholder="Box"
    />
    <SNumberField
      v-model="parcels"
      class="parcels"
      label="Parcels"
      :min="1"
    />
  </div>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.parcels {
  --s-number-field-input-width: 6rem;
}
</style>
```

  </template>
</Demo>
</ClientOnly>

## Floating label

By default the label stands above the field. With `floating-label` it sits on the top edge of the
frame, so the field lines up with neighboring fields that have a
[floating label](/components/input). The step buttons take the field edges, so the label is
always raised rather than resting inside an empty frame; `floating-label="pinned"` works the
same. A label too long for the frame is cut off with an ellipsis once it does not fit at its
reduced size. A `floatingLabel` default in [`global`](/guide/defaults) turns it on here too. The
label and the frame (`.s-number-field__control`) sit in a shared `.s-number-field__wrap` wrapper.

<ClientOnly>
<Demo>
  <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start">
    <SInput label="Product" />
    <SNumberField v-model="qty" label="Quantity" floating-label :min="0" />
  </div>

<template #code>

```vue
<template>
  <SInput
    v-model="product"
    label="Product"
  />
  <SNumberField
    v-model="qty"
    label="Quantity"
    floating-label
    :min="0"
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

## Validation

`rules` checks the number when focus leaves the field, and then on every change while the error
is shown. The rules receive the `v-model` value, a `number`, or `null` when the field is empty:
`required()` fails on `null`, and `min()`/`max()` let it pass. Unlike the `min`/`max` props, which
clamp the typed number to the bounds, the rules keep the number and report it. See the
[Validation](/guide/validation) guide for the details.

Clear the field and leave it, then type 12.

<ClientOnly>
<Demo>
  <SNumberField
    v-model="age"
    label="Age"
    :rules="[required(), min(18), max(99)]"
  />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { max, min, required } from '@smalt-ui/core'

const age = ref<number | null>(null)
</script>

<template>
  <SNumberField
    v-model="age"
    label="Age"
    :rules="[required(), min(18), max(99)]"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## API

<ApiTable name="SNumberField" />
