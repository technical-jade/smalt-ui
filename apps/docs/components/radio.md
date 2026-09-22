<script setup>
import { ref } from 'vue'

const delivery = ref('courier')
const size = ref('m')
const tariff = ref('parcel')
const TARIFFS = [
  { value: 'parcel', title: 'Standard shipping', note: '2–4 days · from $5' },
  { value: 'express', title: 'Express shipping', note: '1–2 days · from $12' },
]
</script>

# Radio

`SRadioGroup` is a group of radio buttons built on Reka UI (the `radiogroup`/`radio` roles, arrow
key navigation). The group **composes** `SRadio` — a single option that reuses `SLabel`. Options
are set with the `options` prop or with `SRadio` in the slot.

## With options

<ClientOnly>
<Demo>
  <SRadioGroup
    aria-label="Delivery method"
    v-model="delivery"
    :options="[
      { label: 'Courier', value: 'courier' },
      { label: 'Pickup', value: 'pickup' },
      {
        label: 'Mail (unavailable)',
        value: 'post',
        disabled: true
      }
    ]"
  />

<template #code>

```vue
<template>
  <SRadioGroup
    v-model="delivery"
    :options="options"
    aria-label="Delivery method"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Horizontal, with a slot

<ClientOnly>
<Demo>
  <SRadioGroup aria-label="Size" orientation="horizontal" v-model="size">
    <SRadio value="s" label="S" />
    <SRadio value="m" label="M" />
    <SRadio value="l" label="L" />
  </SRadioGroup>

<template #code>

```vue
<template>
  <SRadioGroup
    v-model="size"
    orientation="horizontal"
    aria-label="Size"
  >
    <SRadio
      value="s"
      label="S"
    />
    <SRadio
      value="m"
      label="M"
    />
    <SRadio
      value="l"
      label="L"
    />
  </SRadioGroup>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Disabled group

The `disabled` prop on `SRadioGroup` disables all options at once.

<ClientOnly>
<Demo>
  <SRadioGroup aria-label="Plan" disabled :model-value="'pro'">
    <SRadio value="free" label="Free" />
    <SRadio value="pro" label="Professional" />
    <SRadio value="team" label="Team" />
  </SRadioGroup>

<template #code>

```vue
<template>
  <SRadioGroup
    v-model="plan"
    disabled
    aria-label="Plan"
  >
    <SRadio
      value="free"
      label="Free"
    />
    <SRadio
      value="pro"
      label="Professional"
    />
  </SRadioGroup>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Required choice

The `required` prop makes a choice in the group required for form submission.

<ClientOnly>
<Demo>
  <SRadioGroup aria-label="Payment method" required>
    <SRadio value="card" label="Card" />
    <SRadio value="cash" label="Cash" />
  </SRadioGroup>

<template #code>

```vue
<template>
  <SRadioGroup
    v-model="payment"
    required
    aria-label="Payment method"
  >
    <SRadio
      value="card"
      label="Card"
    />
    <SRadio
      value="cash"
      label="Cash"
    />
  </SRadioGroup>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Color

The `color` prop on `SRadio` sets the color of the checked state from the
[palette](/style/palette).

<ClientOnly>
<Demo>
  <SRadioGroup :model-value="'on'" aria-label="Indigo">
    <SRadio value="on" label="Indigo" color="indigo" />
    <SRadio value="off" label="Second" color="indigo" />
  </SRadioGroup>
  <SRadioGroup :model-value="'on'" aria-label="Blue-grey">
    <SRadio value="on" label="Blue-grey" color="blue-grey" />
    <SRadio value="off" label="Second" color="blue-grey" />
  </SRadioGroup>

<template #code>

```vue
<template>
  <SRadioGroup v-model="value">
    <SRadio
      value="on"
      label="Indigo"
      color="indigo"
    />
  </SRadioGroup>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Label, hint and error

`label` renders the group title and links it with `aria-labelledby` (a native `<label for>` does
not work with a `role="radiogroup"` container — it has no value of its own). `hint` and `error`
go below the group. No separate `SFormField` wrapper is needed for this; `aria-label` remains for
cases without a visible title.

<ClientOnly>
<Demo>
  <SRadioGroup
    label="Tell us who you are"
    required
    orientation="horizontal"
    :options="[
      { label: 'Individual', value: 'person' },
      { label: 'Business', value: 'company' }
    ]"
  />
  <SRadioGroup
    label="Delivery method"
    error="Choose an option"
    :options="[
      { label: 'To the door', value: 'door' },
      { label: 'To a pickup point', value: 'pickup' }
    ]"
  />

<template #code>

```vue
<template>
  <SRadioGroup
    v-model="customerType"
    label="Tell us who you are"
    :error="errors.customerType"
    required
    orientation="horizontal"
    :options="options"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Choice card

`SRadio` can be built into a card where a click anywhere on the row selects the option. `stretch`
stretches the radio button to the container width and gives the free space to the label,
`align="center"` centers the circle against a multi-line label instead of the first line. The
same props exist on [`SCheckbox`](/components/checkbox).

The class and style of `SRadioGroup` go to the field wrapper together with the title and hint;
other attributes (`data-*`, `aria-*`, listeners) go to the element with `role="radiogroup"`. The
layout of the options themselves is set with `group-class` — the class of the
`.s-radio-group` container. The gap between options is the `--s-radio-group-gap` variable.

<ClientOnly>
<Demo>
  <SRadioGroup v-model="tariff" aria-label="Shipping rate" style="--s-radio-group-gap: 8px; width: 100%; max-width: 420px">
    <SCard v-for="t in TARIFFS" :key="t.value" interactive :selected="tariff === t.value" style="--s-card-padding: 12px 16px">
      <SRadio :value="t.value" stretch align="center">
        <span style="display: block">{{ t.title }}</span>
        <span style="display: block; font-weight: var(--s-font-weight-normal); font-size: var(--s-font-size-xs); color: var(--s-color-text-muted)">{{ t.note }}</span>
      </SRadio>
    </SCard>
  </SRadioGroup>

<template #code>

```vue
<template>
  <SRadioGroup
    v-model="tariff"
    aria-label="Shipping rate"
    group-class="tariffs"
  >
    <SCard
      v-for="item in tariffs"
      :key="item.value"
      interactive
      :selected="tariff === item.value"
    >
      <SRadio
        :value="item.value"
        stretch
        align="center"
      >
        <span class="tariff-title">{{ item.title }}</span>
        <span class="tariff-note">{{ item.note }}</span>
      </SRadio>
    </SCard>
  </SRadioGroup>
</template>

<style>
.tariffs {
  --s-radio-group-gap: var(--s-space-2);
}

@media (max-width: 600px) {
  .tariffs {
    flex-direction: column;
  }
}
</style>
```

  </template>
</Demo>
</ClientOnly>

## API

`SRadio` is a group option (reused inside `SRadioGroup`):

<ApiTable name="SRadio" />

The group:

<ApiTable name="SRadioGroup" />
