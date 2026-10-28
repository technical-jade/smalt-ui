# Popover

`SPopover` is a floating panel next to its trigger for interactive content: a short form,
settings, a card with buttons. For a list of commands use [`SDropdownMenu`](./dropdown-menu), for
an explanation on hover use [`STooltip`](./tooltip). It is built on Reka UI. The trigger goes into
the `#trigger` slot (the element itself becomes the trigger, `as-child`), the content into the
default slot. The panel opens on click, renders in a portal and closes on <kbd>Esc</kbd>, a click
outside or a second click on the trigger. When the screen has too little room, long content scrolls
inside the panel instead of running off the edge.

## Basic usage

<ClientOnly>
<Demo>
  <SPopover aria-label="Profile">
    <template #trigger>
      <SButton variant="outline">Open panel</SButton>
    </template>
    <div style="display: flex; flex-direction: column; gap: 8px; min-width: 200px">
      <strong>Alex Johnson</strong>
      <span style="color: var(--s-color-text-muted)">alex@example.com</span>
    </div>
  </SPopover>

<template #code>

```vue
<template>
  <SPopover
    v-model:open="open"
    aria-label="Profile"
  >
    <template #trigger>
      <SButton variant="outline">Open panel</SButton>
    </template>
    <strong>Alex Johnson</strong>
  </SPopover>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Side and alignment

`side` and `align` set where the panel opens relative to the trigger. By default it opens below
(`side="bottom"`), centered on the trigger (`align="center"`), 8px away (`side-offset`). If the
chosen side has no room, the panel flips to the opposite one. When the page scrolls, an
open panel moves together with its trigger, without lagging behind. If the trigger lies in a pinned
block (`position: fixed` or `sticky`, for example in the [`SAppBar`](/components/app-shell)
header), the panel stays in place along with it.

<ClientOnly>
<Demo>
  <SPopover side="right" align="start" aria-label="Help">
    <template #trigger>
      <SButton variant="outline">Right</SButton>
    </template>
    <div style="max-width: 220px">The panel appears on the right, aligned to the start of the side.</div>
  </SPopover>

<template #code>

```vue
<template>
  <SPopover
    side="right"
    align="start"
  >
    <template #trigger>
      <SButton variant="outline">Right</SButton>
    </template>
    Panel on the right.
  </SPopover>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Modal mode

The `modal` prop blocks interaction with the background and enables a focus trap:
while the panel is open, focus cannot leave it, page scrolling is blocked and a screen reader does
not see the content outside the panel. A click outside still closes the panel. There is no
backdrop, so the page is not dimmed; use a [dialog](./dialog) when the content needs one.

<ClientOnly>
<Demo>
  <SPopover modal aria-label="Confirmation">
    <template #trigger>
      <SButton variant="primary">Open modal</SButton>
    </template>
    <div style="display: flex; flex-direction: column; gap: 8px; min-width: 220px">
      <strong>Delete the project?</strong>
      <span style="color: var(--s-color-text-muted)">The background is blocked, focus stays in the panel.</span>
    </div>
  </SPopover>

<template #code>

```vue
<template>
  <SPopover
    v-model:open="open"
    modal
    aria-label="Confirmation"
  >
    <template #trigger>
      <SButton variant="primary">Open modal</SButton>
    </template>
    <strong>Delete the project?</strong>
  </SPopover>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Elevation

The popover panel is raised to the third elevation level. `flat` removes the shadow, `elevation`
sets a custom level; the radius is not affected — `square` controls it, see
[Elevation](/style/elevation).

<Demo>
  <ClientOnly>
    <SPopover flat>
      <template #trigger><SButton variant="outline">flat</SButton></template>
      Panel without a shadow.
    </SPopover>
    <SPopover :elevation="5">
      <template #trigger><SButton variant="outline">elevation 5</SButton></template>
      A higher panel.
    </SPopover>
  </ClientOnly>

<template #code>

```vue
<template>
  <SPopover flat>
    <template #trigger>
      <SButton variant="outline">Filters</SButton>
    </template>
    Panel without a shadow.
  </SPopover>
</template>
```

  </template>
</Demo>

## Border color

One CSS variable, `--s-popover-border` (defaults to `--s-color-border`), colors both the panel
border and the arrow stroke. Set it with a class or a `style` attribute on the component: attributes
go to the panel, and the arrow inside it takes the same color. The arrow stroke is as thick as
the border at any arrow size. The panel renders in a portal, so the parent's `scoped` styles do
not reach it — declare the class in global styles.

<Demo>
  <ClientOnly>
    <SPopover style="--s-popover-border: var(--s-primary)">
      <template #trigger><SButton variant="outline">Primary border</SButton></template>
      The border and the arrow share one color.
    </SPopover>
  </ClientOnly>

<template #code>

```vue
<template>
  <SPopover class="brand-popover">
    <template #trigger>
      <SButton variant="outline">Primary border</SButton>
    </template>
    The border and the arrow share one color.
  </SPopover>
</template>

<style>
.brand-popover {
  --s-popover-border: var(--s-primary);
}
</style>
```

  </template>
</Demo>

## Closing from the content

Buttons inside the panel do not close it. Bind `v-model:open` and reset it in the handler.

## Accessibility

The trigger gets `aria-haspopup`, `aria-expanded` and `aria-controls`. On open, focus moves into
the panel; after closing it returns to the trigger. `aria-label` gives the panel an accessible
name; without it the panel is named by its trigger. Class, style and attributes passed to
`SPopover` land on the panel itself (`.s-popover__content`), because it is rendered in a portal.

## API

<ApiTable name="SPopover" />
