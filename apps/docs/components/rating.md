# Rating

`SRating` is a star rating. It is built on Reka UI Rating (the `radiogroup` role, keyboard/mouse
selection). The stars are a reused `SIcon`; filled ones are highlighted with the accent color
(gold by default), and the item under the cursor grows slightly. The value is bound with
`v-model`.
While the pointer moves over the stars, they preview the rating it would set.

<script setup>
import { ref } from 'vue'

const ratingBasic = ref(3)
const ratingSeven = ref(0)
const ratingHeart = ref(3)
const ratingHalf = ref(3.5)
const ratingClearable = ref(4)
const ratingSm = ref(3)
const ratingMd = ref(3)
const ratingLg = ref(3)
const ratingPx = ref(3)
const ratingGold = ref(4)
const ratingRed = ref(4)
const ratingIndigo = ref(4)
const ratingBlueGrey = ref(5)
</script>

## Basic usage

<ClientOnly>
<Demo>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <SRating v-model="ratingBasic" aria-label="Rating" />
    <SRating :model-value="4" :length="5" readonly aria-label="Average rating" />
    <SRating v-model="ratingSeven" :length="7" aria-label="Rating out of 7" />
  </div>

<template #code>

```vue
<template>
  <SRating
    v-model="score"
    aria-label="Rating"
  />
  <SRating
    :model-value="4"
    readonly
    aria-label="Average rating"
  />
  <SRating
    v-model="score"
    :length="7"
    aria-label="Rating out of 7"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Size

`size` takes a token (`sm` 16px / `md` 20px / `lg` 24px) or a number of pixels — the value goes
to `SIcon`, so the scale is the same as for the library icons.

<ClientOnly>
<Demo>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <SRating v-model="ratingSm" size="sm" aria-label="Small rating" />
    <SRating v-model="ratingMd" size="md" aria-label="Medium rating" />
    <SRating v-model="ratingLg" size="lg" aria-label="Large rating" />
    <SRating v-model="ratingPx" :size="40" aria-label="40-pixel rating" />
  </div>

<template #code>

```vue
<template>
  <SRating
    v-model="score"
    size="sm"
  />
  <SRating
    v-model="score"
    size="md"
  />
  <SRating
    v-model="score"
    size="lg"
  />
  <SRating
    v-model="score"
    :size="40"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Custom item icon

`icon` sets the shape of an empty item, `selected-icon` the shape of a selected one (a registry
name or a raw SVG path). Here the star is replaced with a red heart.

<ClientOnly>
<Demo>
  <SRating
    v-model="ratingHeart"
    :length="5"
    color="red"
    size="lg"
    icon="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z"
    selected-icon="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z"
    aria-label="Heart rating"
  />

<template #code>

```vue
<script setup lang="ts">
const heart =
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z'
</script>

<template>
  <SRating
    v-model="score"
    color="red"
    size="lg"
    :icon="heart"
    :selected-icon="heart"
    aria-label="Heart rating"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Half ratings

The `allow-half` prop allows a step of 0.5 — you can select and display half a star
(for example, an average rating of 3.5).

<ClientOnly>
<Demo>
  <SRating v-model="ratingHalf" allow-half aria-label="Rating with halves" />

<template #code>

```vue
<template>
  <SRating
    v-model="score"
    allow-half
    aria-label="Rating with halves"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Clearing the rating

The `clearable` prop lets the user reset the rating to 0 by clicking the current star again.

<ClientOnly>
<Demo>
  <SRating v-model="ratingClearable" clearable aria-label="Clearable rating" />

<template #code>

```vue
<template>
  <SRating
    v-model="score"
    clearable
    aria-label="Clearable rating"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Read-only and disabled

`readonly` shows the rating without letting the user change it, `disabled` also dims the control
and blocks interaction.

<ClientOnly>
<Demo>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <SRating :model-value="4" readonly aria-label="Read-only" />
    <SRating :model-value="2" disabled aria-label="Disabled" />
  </div>

<template #code>

```vue
<template>
  <SRating
    :model-value="4"
    readonly
    aria-label="Read-only"
  />
  <SRating
    :model-value="2"
    disabled
    aria-label="Disabled"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Color

The `color` prop sets the star color from the [palette](/style/palette). The default is gold
`amber`; hearts and "likes" usually use `red`.

<ClientOnly>
<Demo>
  <div style="display: grid; gap: 8px">
    <SRating v-model="ratingGold" aria-label="Gold (default)" />
    <SRating v-model="ratingRed" color="red" aria-label="Red" />
    <SRating v-model="ratingIndigo" color="indigo" aria-label="Indigo" />
    <SRating v-model="ratingBlueGrey" color="blue-grey" aria-label="Blue-grey" />
  </div>

<template #code>

```vue
<template>
  <SRating v-model="rate" />
  <SRating
    v-model="rate"
    color="red"
  />
  <SRating
    v-model="rate"
    color="indigo"
  />
  <SRating
    v-model="rate"
    color="blue-grey"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## API

<ApiTable name="SRating" />
