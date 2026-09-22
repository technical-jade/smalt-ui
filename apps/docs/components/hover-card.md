<script setup>
import { ref } from 'vue'
const cardOpen = ref(false)
</script>

# Hover Card

`SHoverCard` is a popup card that opens on hovering the trigger (and on keyboard focus): handy for
previewing a profile, a link, or an entity without navigating away. It is built on Reka UI (portal,
open/close delays, positioning). The trigger is the `#trigger` slot (`as-child`), the content is
the default slot.
Touch screens have no hover, so by default the card does not open there; `enable-touch` opens it
on tap.

## Basic usage

<ClientOnly>
<Demo>
  <SHoverCard>
    <template #trigger>
      <a href="#" style="color: var(--s-color-primary); font-weight: 600">@alex</a>
    </template>
    <div style="display: flex; flex-direction: column; gap: 4px">
      <strong>Alex Johnson</strong>
      <span style="color: var(--s-color-text-muted)">Frontend developer · 128 projects</span>
    </div>
  </SHoverCard>

<template #code>

```vue
<template>
  <SHoverCard>
    <template #trigger>
      <a href="#">@alex</a>
    </template>
    <strong>Alex Johnson</strong>
    <span>Frontend developer</span>
  </SHoverCard>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Positioning

The `side` (where the card appears) and `align` (alignment along that side) props set the card
position relative to the trigger.

<ClientOnly>
<Demo>
  <div style="display: flex; flex-wrap: wrap; gap: 24px">
    <SHoverCard side="right" align="start">
      <template #trigger>
        <a href="#" style="color: var(--s-color-primary); font-weight: 600">right / start</a>
      </template>
      <span>A card to the right of the trigger.</span>
    </SHoverCard>
    <SHoverCard side="top" align="center">
      <template #trigger>
        <a href="#" style="color: var(--s-color-primary); font-weight: 600">top / center</a>
      </template>
      <span>A card above, centered.</span>
    </SHoverCard>
  </div>

<template #code>

```vue
<template>
  <SHoverCard
    side="right"
    align="start"
  >
    <template #trigger>
      <a href="#">right / start</a>
    </template>
    <span>A card to the right of the trigger.</span>
  </SHoverCard>
</template>
```

  </template>
</Demo>
</ClientOnly>

## External control

The `open` prop (two-way binding with `v-model:open`) lets you open the card programmatically in
addition to hovering.

<ClientOnly>
<Demo>
  <div style="display: flex; align-items: center; gap: 12px">
    <SButton @click="cardOpen = !cardOpen">Toggle</SButton>
    <SHoverCard v-model:open="cardOpen">
      <template #trigger>
        <a href="#" style="color: var(--s-color-primary); font-weight: 600">@alex</a>
      </template>
      <strong>Alex Johnson</strong>
    </SHoverCard>
  </div>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <SButton @click="open = !open">Toggle</SButton>
  <SHoverCard v-model:open="open">
    <template #trigger>
      <a href="#">@alex</a>
    </template>
    <strong>Alex Johnson</strong>
  </SHoverCard>
</template>
```

  </template>
</Demo>
</ClientOnly>

## API

<ApiTable name="SHoverCard" />
