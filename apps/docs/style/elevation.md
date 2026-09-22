# Elevation

A shadow shows height: the higher an element sits above the page, the closer it is to the user and
the softer and wider its shadow. A dropdown list lies above a form, and the form lies above the
background, so a panel's shadow is more visible than a card's.

This is **a setting separate from shape**: [`square`](/style/shape) controls only the corner
radius and never affects the shadow. Two props control the shadow: `flat` and `elevation`.

## Showcase

The switch and the scale act on all groups at once: the shadow is configured the same way on the
card, the button, the tooltip and floating panels.

<ClientOnly>
  <ElevationShowcase />
</ClientOnly>

## `flat`: remove the shadow

A boolean prop, most often set once for the whole app. A layout without shadows is a common
requirement, and there is no need to repeat it on every call:

```ts
import { createSUI } from '@smalt-ui/core'

app.use(createSUI({ defaults: { global: { flat: true } } }))
```

<Demo>
  <SButton variant="primary">With shadow</SButton>
  <SButton variant="primary" flat>flat</SButton>
  <SCard variant="elevated" style="width: 160px">With shadow</SCard>
  <SCard variant="elevated" flat style="width: 160px">flat</SCard>

<template #code>

```vue
<template>
  <SButton
    variant="primary"
    flat
  >
    No shadow
  </SButton>
  <SCard
    variant="elevated"
    flat
  >
    No shadow
  </SCard>
</template>
```

  </template>
</Demo>

## `elevation`: set the level

A number from 0 to 5 on the Material Design scale. `0` is the same as `flat`; higher is more
visible.

<Demo>
  <div style="display: flex; flex-wrap: wrap; gap: 20px; padding: 8px">
    <SCard v-for="n in [0, 1, 2, 3, 4, 5]" :key="n" :elevation="n" style="width: 92px">
      <div style="text-align: center">{{ n }}</div>
    </SCard>
  </div>

<template #code>

```vue
<template>
  <SCard :elevation="3">Raised card</SCard>
</template>
```

  </template>
</Demo>

::: tip Priority
`elevation` overrides `flat`, not the other way around. The order follows practice: `flat` usually
comes from global defaults, while `elevation` is written locally in place; otherwise there would be
no way to bring the shadow back on a single card.

```vue
<!-- with global: { flat: true } this card still has a shadow -->
<SCard :elevation="2">Highlighted card</SCard>
```

:::

## Default levels

| Level | Who                                                                   |
| ----- | --------------------------------------------------------------------- |
| 3     | floating panels: lists, menus, popovers, calendars, toasts            |
| 2     | tooltip                                                               |
| 1     | button (filled variants), `SCard variant="elevated"`, toolbar         |
| —     | everything else: toggles, inputs and navigation have no shadow at all |

On hover a button rises one step, also with an explicit `elevation`: level 3 becomes 4 under the
pointer. This keeps the material physics intact.

## Modal windows have no such prop

`SDialog`, `SAlertDialog` and `SDrawer` do not turn off their shadow. It is not decoration there:
the window lies over a dimmed backdrop, and the shadow is the only thing that separates its edge
from the backdrop.

For the same reason the shadow of the `SSlider` thumb is not configurable: it is part of its
physical metaphor, not surface styling.

## Tokens and fine-tuning

Levels are emitted as the `--s-elevation-0…5` tokens and can be overridden like any other token,
including through [`createTheme`](/theming). Changing a token changes the shadow everywhere that
level is used.

## Dark theme

A black shadow disappears on a dark page, so in the dark theme the same levels are drawn with a
light shadow: the surface gets a soft glow that grows with the level. Both themes build the
levels from three tokens, which also retune the shadows without redefining every level:

| Token                        | Light  | Dark   | What it sets                          |
| ---------------------------- | ------ | ------ | ------------------------------------- |
| `--s-shadow-color`           | `#000` | `#fff` | shadow color                          |
| `--s-shadow-key-opacity`     | `30%`  | `20%`  | strength of the sharp shadow under it |
| `--s-shadow-ambient-opacity` | `15%`  | `12%`  | strength of the soft spread around it |

The values differ between the themes, so a change sets each one with its own selector:

```css
:root {
  --s-shadow-key-opacity: 40%;
}
:root[data-theme='dark'] {
  --s-shadow-key-opacity: 28%;
}
```

To change the shadow of one component without touching props, use these variables:

| Variable                                              | What it sets                                      |
| ----------------------------------------------------- | ------------------------------------------------- |
| `--s-surface-elevation`                               | all floating panels (shared, they live in `body`) |
| `--s-button-elevation` / `--s-button-elevation-hover` | button at rest and under the pointer              |
| `--s-card-elevation`                                  | card                                              |
| `--s-toolbar-elevation`                               | toolbar                                           |
| `--s-tooltip-elevation`                               | tooltip                                           |

```css
/* softer shadows on all dropdown panels of the app */
:root {
  --s-surface-elevation: var(--s-elevation-2);
}
```
