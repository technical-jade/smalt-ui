# Shape

Corner rounding is part of a brand style: some apps look soft, others need square corners by
design. So the radius is not set on each component separately but in three ways: the `square` prop,
global defaults and scale tokens.

`square` changes **only the radius**. Shadow is a separate setting with its own `flat` and
`elevation` props, see [Elevation](/style/elevation).

## The `square` prop

Flip the switch: square corners apply to all groups at once, including inputs, controls, cards
and floating panels. More than forty components declare the prop precisely for this
consistency.

<ClientOnly>
  <ShapeShowcase />
</ClientOnly>

An important detail: for a component with a dropdown panel, `square` reaches the panel too. A
square field with a rounded list is the first thing that catches the eye in an app without
rounding.

## One key for the whole app

There is no need to put `square` on every call: it is a [prop default](/guide/defaults). The
`global` key applies to any component that declares the prop:

```ts
import { createSUI } from '@smalt-ui/core'

app.use(createSUI({ defaults: { global: { square: true } } }))
```

In Nuxt, the same through the module option:

```ts
export default defineNuxtConfig({
  sui: { defaults: { global: { square: true } } },
})
```

## Pill-shaped button

`round` is the opposite extreme: fully rounded ends. When set together with `square`, `square`
wins.

<Demo>
  <SButton variant="primary">Regular</SButton>
  <SButton variant="primary" round>Round</SButton>
  <SButton variant="primary" square>Square</SButton>

<template #code>

```vue
<template>
  <SButton variant="primary">Regular</SButton>
  <SButton
    variant="primary"
    round
  >
    Round
  </SButton>
  <SButton
    variant="primary"
    square
  >
    Square
  </SButton>
</template>
```

  </template>
</Demo>

## Radius scale

The base component radius is **8px**. The values come from the `$radius` SASS map and are
emitted as tokens, so they can be changed both at build time and at runtime.

| Token             | Value    | Used in                                                         |
| ----------------- | -------- | --------------------------------------------------------------- |
| `--s-radius-none` | `0`      | result of the `square` prop                                     |
| `--s-radius-sm`   | `8px`    | field borders (through `--s-field-radius`), menu items, tooltip |
| `--s-radius-md`   | `8px`    | buttons, cards, floating panels (through `--s-surface-radius`)  |
| `--s-radius-lg`   | `16px`   | in the scale, not used by components                            |
| `--s-radius-xl`   | `28px`   | same                                                            |
| `--s-radius-full` | `9999px` | shape-driven: pill badges, radio, switch, avatar                |

To shift the shape of the whole interface without touching props, override the tokens:

```css
:root:root:root {
  --s-radius-sm: 2px;
  --s-radius-md: 2px;
}
```

Three `:root`s give the same specificity that `createTheme` uses: it beats both the dark theme and
the media fallback, so the result does not depend on the order in which styles load. See
[Theming](/theming).

## Fine-tuning

Some components read their own variables, which are convenient to set on a subtree without
touching the rest of the interface:

| Variable                     | What it sets                             |
| ---------------------------- | ---------------------------------------- |
| `--s-field-radius`           | field border radius (`square` zeroes it) |
| `--s-surface-radius`         | floating panel radius                    |
| `--s-select-min-width`       | minimum width of the select border       |
| `--s-collapsible-trigger-bg` | `SCollapsible` header background         |
