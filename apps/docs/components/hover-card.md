<script setup>
import { ref } from 'vue'
const cardOpen = ref(false)
</script>

# Hover Card

`SHoverCard` is a popup card that opens on hovering the trigger (and on keyboard focus): handy for
previewing a profile, a link, or an entity without navigating away. It is built on Reka UI (portal,
open/close delays, positioning). The trigger is the `#trigger` slot (`as-child`), the content is
the default slot.
The card is rendered in a portal; class and attributes passed to the component land on it, not on
the trigger. Touch screens have no hover, so by default the card does not open there and a link
trigger simply navigates on tap; `enable-touch` opens the card on tap.

The card only complements the trigger. A screen reader does not announce its content, and
<kbd>Tab</kbd> from the trigger goes to the next element of the page, not into the card. Do not
put anything essential in it, nor actions that must be reachable from the keyboard: use
[`SPopover`](./popover) for those.

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
position relative to the trigger. By default the card appears below, centered, 8px from the
trigger (`side-offset`).

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

## Delays and touch

The card opens 300 ms after the pointer arrives (`open-delay`) and closes 200 ms after it leaves
(`close-delay`): enough time for the pointer to travel from the trigger to the card.
`enable-touch` opens the card on tap on touch screens.

<ClientOnly>
<Demo>
  <div style="display: flex; flex-wrap: wrap; gap: 24px">
    <SHoverCard
      :open-delay="0"
      :close-delay="500"
    >
      <template #trigger>
        <a
          href="#"
          style="color: var(--s-color-primary); font-weight: 600"
        >no delay</a>
      </template>
      <span>Opened at once, closes after half a second.</span>
    </SHoverCard>
    <SHoverCard enable-touch>
      <template #trigger>
        <a
          href="#"
          style="color: var(--s-color-primary); font-weight: 600"
        >opens on tap</a>
      </template>
      <span>On a touch screen a tap opens the card.</span>
    </SHoverCard>
  </div>

<template #code>

```vue
<template>
  <SHoverCard
    :open-delay="0"
    :close-delay="500"
  >
    <template #trigger>
      <a href="#">no delay</a>
    </template>
    <span>Opened at once, closes after half a second.</span>
  </SHoverCard>
  <SHoverCard enable-touch>
    <template #trigger>
      <a href="#">opens on tap</a>
    </template>
    <span>On a touch screen a tap opens the card.</span>
  </SHoverCard>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Elevation and shape

As with [`SPopover`](./popover#elevation): `flat` removes the shadow, `elevation` sets its level
from 0 to 5 and `square` removes the rounding. The arrow toward the trigger is always there.

## Border color

One CSS variable, `--s-hover-card-border` (defaults to `--s-color-border`), colors both the card
border and the arrow stroke. Set it with a class or a `style` attribute on the component: they go
to the card, and the arrow inside it takes the same color. The arrow stroke is as thick as the
border at any arrow size. The card renders in a portal, so the parent's `scoped` styles do not
reach it — declare the class in global styles.

<ClientOnly>
<Demo>
  <SHoverCard style="--s-hover-card-border: var(--s-primary)">
    <template #trigger>
      <a href="#" style="color: var(--s-color-primary); font-weight: 600">@alex</a>
    </template>
    The border and the arrow share one color.
  </SHoverCard>

<template #code>

```vue
<template>
  <SHoverCard class="brand-card">
    <template #trigger>
      <a href="#">@alex</a>
    </template>
    The border and the arrow share one color.
  </SHoverCard>
</template>

<style>
.brand-card {
  --s-hover-card-border: var(--s-primary);
}
</style>
```

  </template>
</Demo>
</ClientOnly>

## API

<ApiTable name="SHoverCard" />
