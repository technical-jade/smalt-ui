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
