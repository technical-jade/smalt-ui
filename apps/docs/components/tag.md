<script setup>
import { ref } from 'vue'

const chips = ref(['Vue', 'Nuxt', 'Reka UI'])
const removeChip = (t) => {
  chips.value = chips.value.filter((x) => x !== t)
}
</script>

# Tag

`STag` is a reusable chip: a compact label with an optional remove button. It is composed on top
of [`SBadge`](/components/badge) (visuals) and [`SIcon`](/components/icon) (the cross). It is used
on its own and as the tag element inside [`SInput`](/components/input) (`use-tags`) and
[`SSelect`](/components/select) (`use-tags`).

## Variants

Inherits the `SBadge` palette: the neutral and semantic variants. `variant` sets the role:
`primary` is a solid fill, the others are a soft background with colored text. The default is
`neutral`.

<Demo>
  <STag variant="neutral">Neutral</STag>
  <STag variant="primary">Primary</STag>
  <STag variant="positive">Positive</STag>
  <STag variant="warning">Warning</STag>
  <STag variant="negative">Negative</STag>

<template #code>

```vue
<template>
  <STag variant="neutral">Neutral</STag>
  <STag variant="primary">Primary</STag>
  <STag variant="positive">Positive</STag>
  <STag variant="warning">Warning</STag>
  <STag variant="negative">Negative</STag>
</template>
```

  </template>
</Demo>

## Sizes and icon

`size` is `sm`, `md` (the default) or `lg`. `square` removes the rounding. `icon` draws a leading
icon: a registry name or a raw SVG path.

<Demo>
  <STag size="sm">sm</STag>
  <STag size="md">md</STag>
  <STag size="lg">lg</STag>
  <STag square>Square</STag>
  <STag icon="star" variant="warning">Favorite</STag>

<template #code>

```vue
<template>
  <STag size="sm">sm</STag>
  <STag size="md">md</STag>
  <STag size="lg">lg</STag>
  <STag square>Square</STag>
  <STag
    icon="star"
    variant="warning"
  >
    Favorite
  </STag>
</template>
```

  </template>
</Demo>

## Removal

The `removable` flag adds a cross button; clicking it emits the `remove` event. The tag does not
disappear on its own: removing it from the list is up to the parent. The button is native, so it
is reachable with <kbd>Tab</kbd> and fires on <kbd>Enter</kbd> and <kbd>Space</kbd>.

All buttons share one accessible name from the locale dictionary ("Remove tag" in `removeTag`).
With several tags a screen reader cannot tell which one is being removed, so pass `remove-label`
with the tag text. `remove-icon` replaces the cross icon.

<Demo>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; min-height: 24px">
    <STag
      v-for="t in chips"
      :key="t"
      removable
      variant="primary"
      :remove-label="`Remove ${t}`"
      @remove="removeChip(t)"
    >
      {{ t }}
    </STag>
  </div>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const chips = ref(['Vue', 'Nuxt', 'Reka UI'])
const removeChip = (t: string) => {
  chips.value = chips.value.filter((x) => x !== t)
}
</script>

<template>
  <STag
    v-for="t in chips"
    :key="t"
    removable
    variant="primary"
    :remove-label="`Remove ${t}`"
    @remove="removeChip(t)"
  >
    {{ t }}
  </STag>
</template>
```

  </template>
</Demo>

After a tag is removed, focus stays on the button that no longer exists and falls back to `body`.
When tags are removed from the keyboard, move focus yourself, for example to a neighboring tag or
to the input.

## Custom remove control

The `remove` slot replaces the built-in button entirely and renders even without `removable`.
Markup, accessible name and handler are yours in that case, and the `remove` event is not emitted.

## Color

The `color` prop sets a color from the [palette](/style/palette) and overrides the variant color,
keeping its style. `text-color` changes the text color on the `primary` fill.

<Demo>
  <STag variant="primary" color="indigo">indigo</STag>
  <STag variant="primary" color="blue-grey">blue-grey</STag>
  <STag variant="positive" color="deep-purple">soft deep-purple</STag>
  <STag variant="primary" color="cyan">cyan</STag>

<template #code>

```vue
<template>
  <STag
    variant="primary"
    color="indigo"
  >
    indigo
  </STag>
  <STag
    variant="positive"
    color="deep-purple"
  >
    soft deep-purple
  </STag>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="STag" />
