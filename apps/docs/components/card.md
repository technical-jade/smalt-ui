<script setup>
import { ref } from 'vue'

const size = ref('m')
const SIZES = [
  { code: 'S', label: 'up to 5 kg', dims: '30 × 20 × 10 cm' },
  { code: 'M', label: 'up to 15 kg', dims: '40 × 30 × 20 cm' },
  { code: 'L', label: 'up to 30 kg', dims: '60 × 40 × 30 cm' },
]
</script>

# Card

`SCard` is a card container with `header` / content / `footer` slots and style variants (border or
shadow). It uses semantic tokens; the root is polymorphic (`as`), so a card can also be a
selectable item or a link.

## Variants

<Demo>
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <SCard variant="outline" style="width: 220px">
      <template #header>Outline</template>
      A card with a border.
      <template #footer><SButton size="sm">Action</SButton></template>
    </SCard>
    <SCard variant="elevated" style="width: 220px">
      <template #header>Elevated</template>
      A card with a shadow.
      <template #footer><SButton size="sm" variant="outline">Action</SButton></template>
    </SCard>
  </div>

<template #code>

```vue
<template>
  <SCard variant="elevated">
    <template #header>Title</template>
    Card content.
    <template #footer><SButton size="sm">Action</SButton></template>
  </SCard>
</template>
```

  </template>
</Demo>

## Square corners

The `square` prop removes the frame rounding (the radius is on by default).

<Demo>
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <SCard variant="outline" style="width: 220px">
      <template #header>Regular</template>
      Rounded corners.
    </SCard>
    <SCard square variant="outline" style="width: 220px">
      <template #header>Square</template>
      Square corners.
    </SCard>
  </div>

<template #code>

```vue
<template>
  <SCard
    square
    variant="outline"
  >
    <template #header>Square</template>
    Square corners.
  </SCard>
</template>
```

  </template>
</Demo>

## Content only

<Demo>
  <SCard style="width: 260px">A card without a header or footer, just the body.</SCard>

<template #code>

```vue
<template>
  <SCard>A card without a header or footer.</SCard>
</template>
```

  </template>
</Demo>

## Interactivity

`interactive` adds hover and focus feedback, `selected` renders the selected look, `disabled` dims
the card and disables the pointer. The clickability itself comes from the `as` prop and the
content: a card can be a link (`as="a"`), a button (`as="button"`), or a control wrapper
(`as="label"`).

<Demo>
  <div style="display: flex; flex-wrap: wrap; gap: 12px">
    <SCard interactive style="width: 180px">Hover over me</SCard>
    <SCard interactive selected style="width: 180px">Selected</SCard>
    <SCard interactive disabled style="width: 180px">Unavailable</SCard>
    <SCard as="a" href="/components/card" interactive style="width: 180px">
      Link card
    </SCard>
  </div>

<template #code>

```vue
<template>
  <SCard interactive>Hover over me</SCard>
  <SCard
    interactive
    selected
  >
    Selected
  </SCard>
  <SCard
    interactive
    disabled
  >
    Unavailable
  </SCard>
  <SCard
    as="a"
    href="/orders/1024"
    interactive
  >
    Link card
  </SCard>
</template>
```

  </template>
</Demo>

## Custom content layout

The default slot is wrapped in `.s-card__body` with its own padding. The `body-class` prop passes a
class to that wrapper, so the content can be laid out as a row or a grid without rules targeting
the internal class. The `--s-card-padding` variable sets the padding of the header, body, and
footer: setting it on the card itself is enough, and nested cards do not inherit it.

<Demo>
  <div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: 12px; width: 100%">
    <SCard body-class="s-row s-col-gutter-3" style="flex: 1 1 280px">
      <template #header>Cargo</template>
      <div class="s-col-6">
        <div style="color: var(--s-color-text-muted); font-size: var(--s-font-size-xs)">Weight</div>
        <div>12 kg</div>
      </div>
      <div class="s-col-6">
        <div style="color: var(--s-color-text-muted); font-size: var(--s-font-size-xs)">Dimensions</div>
        <div>40 × 30 × 20 cm</div>
      </div>
    </SCard>
    <SCard style="--s-card-padding: 0; flex: 1 1 280px">
      <div style="display: grid; place-items: center; height: 96px; background: var(--s-color-surface-variant); color: var(--s-color-text-muted)">
        Content flush with the edges
      </div>
    </SCard>
  </div>

<template #code>

```vue
<template>
  <SCard body-class="cargo">
    <template #header>Cargo</template>
    <CargoField label="Weight" />
    <CargoField label="Dimensions" />
  </SCard>

  <SCard class="flush">
    <MapPreview />
  </SCard>
</template>

<style>
.cargo {
  display: flex;
  gap: var(--s-space-3);
}

.flush {
  --s-card-padding: 0;
}
</style>
```

  </template>
</Demo>

## Selection card

The `interactive` prop adds hover and focus feedback, `selected` renders the selected look. The
clickability comes from `as`: a `label` around a native radio is the most reliable option, because
arrow keys, toggling, and screen reader announcements work without a custom keyboard handler.
To make an option unavailable, put `disabled` on both the card and its radio: the card only dims
and swallows clicks, while the radio itself has to leave the tab order and be announced as
disabled.

<Demo>
  <div class="s-row s-col-gutter-3" role="radiogroup" aria-label="Parcel size" style="width: 100%">
    <div v-for="s in SIZES" :key="s.code" class="s-col-12 s-col-sm-4">
      <SCard as="label" interactive :selected="size === s.code.toLowerCase()" style="height: 100%">
        <input
          v-model="size"
          type="radio"
          name="typosize"
          :value="s.code.toLowerCase()"
          class="s-sr-only"
        />
        <div style="font-weight: var(--s-font-weight-semibold)">Size {{ s.code }}</div>
        <div style="color: var(--s-color-text-muted); font-size: var(--s-font-size-sm)">
          {{ s.label }} · {{ s.dims }}
        </div>
      </SCard>
    </div>
  </div>

<template #code>

```vue
<template>
  <div
    role="radiogroup"
    aria-label="Parcel size"
  >
    <SCard
      v-for="size in sizes"
      :key="size.code"
      as="label"
      interactive
      :selected="picked === size.code"
    >
      <input
        v-model="picked"
        type="radio"
        name="typosize"
        :value="size.code"
        class="s-sr-only"
      />
      Size {{ size.code }}
    </SCard>
  </div>
</template>
```

  </template>
</Demo>

The radio is hidden with the `.s-sr-only` class: it removes the element from the screen but keeps
it in the flow, so focus, keyboard, and screen readers keep working.

## Elevation

The `elevated` variant provides a shadow, but the shadow is configured separately: `flat` removes
it from any variant, and `elevation` sets a level even on an outlined card. See
[Elevation](/style/elevation) for details.

<Demo>
  <div style="display: flex; flex-wrap: wrap; gap: 12px">
    <SCard variant="elevated" style="width: 150px">elevated</SCard>
    <SCard variant="elevated" flat style="width: 150px">elevated + flat</SCard>
    <SCard :elevation="3" style="width: 150px">elevation 3</SCard>
    <SCard variant="elevated" selected style="width: 150px">Selected, shadow stays</SCard>
  </div>

<template #code>

```vue
<template>
  <SCard
    variant="elevated"
    flat
  >
    No shadow
  </SCard>
  <SCard :elevation="3">Above the rest</SCard>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SCard" />
