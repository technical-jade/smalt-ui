# Slider

`SSlider` is a slider for picking a number or a range. It is built on Reka UI (the `slider`
role, `aria-valuenow`/`min`/`max`, arrow-key control) and reuses `SFormField` for the label,
hint, error message and a11y wiring. `v-model` takes a number (a single thumb) or an array
(a range).
`v-model` updates on every step of a drag; `value-commit` fires once the user releases the thumb
or presses a key. Without a visible `label`, name the slider with `aria-label`: in a range the
thumbs are announced as its start and end.

<script setup>
import { ref } from 'vue'

const volume = ref(40)
const priceRange = ref([20, 70])
const sliderError = ref(80)
const sliderInvalid = ref(70)
const sliderRequired = ref(50)
const volumeLabel = ref(65)
const priceRangeLabel = ref([30, 80])
</script>

## Single value

<ClientOnly>
<Demo>
  <div style="width: 100%">
    <SSlider v-model="volume" label="Volume" hint="From 0 to 100" />
  </div>

<template #code>

```vue
<template>
  <SSlider
    v-model="volume"
    label="Volume"
    hint="From 0 to 100"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Range

<ClientOnly>
<Demo>
  <div style="width: 100%">
    <SSlider v-model="priceRange" label="Price range" :min="0" :max="100" :step="5" />
  </div>

<template #code>

```vue
<template>
  <SSlider
    v-model="priceRange"
    label="Price range"
    :min="0"
    :max="100"
    :step="5"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## States

`disabled` blocks the slider; `error` (or explicit `invalid`) marks the field invalid and
highlights the track; `required` marks the field as required.

<ClientOnly>
<Demo>
  <div style="display: flex; flex-direction: column; gap: 20px; width: 100%">
    <SSlider :model-value="30" label="Disabled" disabled />
    <SSlider v-model="sliderError" label="With an error" error="The value is too high" />
    <SSlider v-model="sliderInvalid" label="Invalid" invalid />
    <SSlider v-model="sliderRequired" label="Required" required />
  </div>

<template #code>

```vue
<template>
  <SSlider
    v-model="a"
    label="Disabled"
    disabled
  />
  <SSlider
    v-model="b"
    label="With an error"
    error="The value is too high"
  />
  <SSlider
    v-model="c"
    label="Invalid"
    invalid
  />
  <SSlider
    v-model="d"
    label="Required"
    required
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Color

The `color` prop sets the color of the fill and the thumb from the [palette](/style/palette).

<ClientOnly>
<Demo>
  <div style="width: 100%; display: grid; gap: 20px">
    <SSlider :model-value="60" color="indigo" label="Indigo" />
    <SSlider :model-value="40" color="blue-grey" label="Blue-grey" />
  </div>

<template #code>

```vue
<template>
  <SSlider
    v-model="value"
    color="indigo"
    label="Indigo"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Showing the value

`showValue` displays the current value in a bubble above the thumb. By default the bubble
appears on hover, focus or drag; `valueAlways` keeps it visible at all times. The format is set
with the `value` slot (a number by default) — for a range, the slot renders for each thumb.

<ClientOnly>
<Demo>
  <div style="width: 100%; display: grid; gap: 20px">
    <SSlider
      v-model="volumeLabel"
      show-value
      label="Volume"
    />
    <SSlider
      v-model="priceRangeLabel"
      show-value
      value-always
      :min="0"
      :max="100"
      label="Price range"
    >
      <template #value="{ value }">
        {{ value }}%
      </template>
    </SSlider>
  </div>

<template #code>

```vue
<template>
  <SSlider
    v-model="volume"
    show-value
    label="Volume"
  />
  <SSlider
    v-model="priceRange"
    show-value
    value-always
    :min="0"
    :max="100"
    label="Price range"
  >
    <template #value="{ value }"> {{ value }}% </template>
  </SSlider>
</template>
```

  </template>
</Demo>
</ClientOnly>

## API

<ApiTable name="SSlider" />
