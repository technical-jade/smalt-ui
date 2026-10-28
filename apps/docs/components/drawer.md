# Drawer

`SDrawer` is a panel that slides in from the side (or from the top or bottom). It is built on the
modal Reka UI Dialog primitive (focus trap, `Esc`, overlay, portal) and attached to an edge with
the `side` prop. It is controlled with `v-model:open`; the title and description come from props or
slots, the body from the default slot, and the buttons from the `#footer` slot. After closing,
focus returns to the trigger, or, without a `#trigger` slot, to the element that had focus when
the drawer opened.

## Sides

<ClientOnly>
<Demo>
  <div style="display: flex; flex-wrap: wrap; gap: 8px">
    <SDrawer side="right" title="Right" description="A panel on the right">
      <template #trigger><SButton variant="outline">Right</SButton></template>
      <p>Side panel content.</p>
      <template #footer><SButton>Done</SButton></template>
    </SDrawer>
    <SDrawer side="left" title="Left">
      <template #trigger><SButton variant="outline">Left</SButton></template>
      <p>Navigation or filters.</p>
    </SDrawer>
    <SDrawer side="bottom" title="Bottom">
      <template #trigger><SButton variant="outline">Bottom</SButton></template>
      <p>An action at the bottom of the screen.</p>
    </SDrawer>
  </div>

<template #code>

```vue
<template>
  <SDrawer
    v-model:open="open"
    side="right"
    title="Settings"
  >
    <template #trigger><SButton variant="outline">Open</SButton></template>
    <p>Panel content.</p>
    <template #footer><SButton>Done</SButton></template>
  </SDrawer>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Size

A side drawer (`left`, `right`) is `22rem` wide but no wider than 90% of the screen; a top or
bottom one is `20rem` tall but no taller than 90% of the screen. The `width` prop sets the width
of a side drawer and `height` the height of a top or bottom one, as a CSS length or a number of
pixels. The prop for the other axis does not apply: `height` on a `left` drawer and `width` on a
`bottom` one are ignored, so a drawer that switches sides can carry both.

`width="100%"` (or `height="100%"`) opens the drawer across the whole screen, as a mobile menu
usually does. A drawer never grows past the screen. A drawer that fills the screen loses its
rounded corners and the border on the page side, both with `width="100%"` and when
`width="30rem"` runs into the edge of a narrow phone.

The `--s-drawer-size` variable sets the same size along the drawer's axis: set it once for the
whole app instead of repeating the prop.

<ClientOnly>
<Demo>
  <div style="display: flex; flex-wrap: wrap; gap: 8px">
    <SDrawer side="right" title="Filters" width="30rem">
      <template #trigger><SButton variant="outline">width="30rem"</SButton></template>
      <p>A wide drawer for filters and forms.</p>
    </SDrawer>
    <SDrawer side="left" title="Menu" width="100%">
      <template #trigger><SButton variant="outline">width="100%"</SButton></template>
      <p>A drawer across the whole screen.</p>
    </SDrawer>
    <SDrawer side="bottom" title="Bottom" :height="160">
      <template #trigger><SButton variant="outline">:height="160"</SButton></template>
      <p>A bottom drawer 160 px tall.</p>
    </SDrawer>
  </div>

<template #code>

```vue
<template>
  <SDrawer
    side="left"
    title="Menu"
    width="100%"
  >
    <template #trigger>
      <SButton variant="outline">Menu</SButton>
    </template>

    <p>A drawer across the whole screen.</p>
  </SDrawer>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Title and close slots

The `title`, `description`, and `close` slots replace the default header markup, for example an
icon next to the title and a custom close button with `SIcon`.

<ClientOnly>
<Demo>
  <SDrawer side="right">
    <template #trigger>
      <SButton variant="outline">Open settings</SButton>
    </template>
    <template #title>
      <span style="display: inline-flex; align-items: center; gap: 8px">
        <SIcon icon="settings" :size="18" />
        Settings
      </span>
    </template>
    <template #description>
      Profile and notification preferences.
    </template>
    <template #close>
      <SIcon icon="x" :size="16" />
    </template>
    <p>Settings panel content.</p>
    <template #footer>
      <SButton variant="ghost">Cancel</SButton>
      <SButton variant="primary">Save</SButton>
    </template>
  </SDrawer>

<template #code>

```vue
<template>
  <SDrawer
    v-model:open="open"
    side="right"
  >
    <template #trigger>
      <SButton variant="outline">Open settings</SButton>
    </template>
    <template #title>
      <SIcon
        icon="settings"
        :size="18"
      />
      Settings
    </template>
    <template #description> Profile and notification preferences. </template>
    <template #close>
      <SIcon
        icon="x"
        :size="16"
      />
    </template>

    <p>Settings panel content.</p>

    <template #footer>
      <SButton variant="ghost">Cancel</SButton>
      <SButton variant="primary">Save</SButton>
    </template>
  </SDrawer>
</template>
```

  </template>
</Demo>
</ClientOnly>

The panel is rendered in a portal at `body`, so the class, style, and attributes passed to
`SDrawer` land directly on `.s-drawer__content`.

## Animation

The panel slides in from its side while the overlay darkens, and slides back out on close. The
entry takes `--s-duration-slow`, the exit `--s-duration-base`. With
`prefers-reduced-motion: reduce` there is no animation.

## API

<ApiTable name="SDrawer" />
