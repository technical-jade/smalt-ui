# Dialog

`SDialog` is a modal window built on Reka UI: focus trap, closing on `Esc` and on an outside click,
a portal, and correct ARIA relationships. It is controlled with `v-model:open`; the trigger is
passed through a slot.
Long content scrolls in the body while the title, the footer actions and the close button stay in
view.

## Basic usage

<Demo>
  <SDialog title="Confirmation" description="Are you sure you want to continue?">
    <template #trigger>
      <SButton>Open dialog</SButton>
    </template>
    The dialog content goes in the default slot.
    <template #footer>
      <SButton variant="ghost">Cancel</SButton>
      <SButton variant="primary">Confirm</SButton>
    </template>
  </SDialog>

<template #code>

```vue
<template>
  <SDialog
    v-model:open="open"
    title="Confirmation"
    description="Are you sure you want to continue?"
  >
    <template #trigger>
      <SButton>Open dialog</SButton>
    </template>

    The dialog content goes in the default slot.

    <template #footer>
      <SButton variant="ghost">Cancel</SButton>
      <SButton variant="primary">Confirm</SButton>
    </template>
  </SDialog>
</template>
```

  </template>
</Demo>

## Title and close slots

The `title`, `description`, and `close` slots replace the default markup, for example to add an
icon to the title and replace the close cross with an `SIcon`.

<ClientOnly>
<Demo>
  <SDialog>
    <template #trigger>
      <SButton variant="outline">Invite a member</SButton>
    </template>
    <template #title>
      <span style="display: inline-flex; align-items: center; gap: 8px">
        <SIcon icon="user" :size="18" />
        Invite a member
      </span>
    </template>
    <template #description>
      Send an invitation to an email address.
    </template>
    <template #close>
      <SIcon icon="x" :size="16" />
    </template>
    The member will receive an email with a link to join the workspace.
    <template #footer>
      <SButton variant="ghost">Cancel</SButton>
      <SButton variant="primary">Send</SButton>
    </template>
  </SDialog>

<template #code>

```vue
<template>
  <SDialog v-model:open="open">
    <template #trigger>
      <SButton variant="outline">Invite a member</SButton>
    </template>
    <template #title>
      <SIcon
        icon="user"
        :size="18"
      />
      Invite a member
    </template>
    <template #description> Send an invitation to an email address. </template>
    <template #close>
      <SIcon
        icon="x"
        :size="16"
      />
    </template>

    The member will receive an email with a link to join the workspace.

    <template #footer>
      <SButton variant="ghost">Cancel</SButton>
      <SButton variant="primary">Send</SButton>
    </template>
  </SDialog>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Width

The window is `32rem` wide by default. The `width` prop sets a different width as a CSS length or a
number of pixels; on a narrow screen the window is still no wider than `92vw`. The same width can
be set with the `--s-dialog-width` variable if it is easier to set it from a theme or a class.

The window is rendered in a portal at `body`, so the class, style, and attributes passed to
`SDialog` land directly on `.s-dialog__content`: this lets you reach the content without global
selectors.

<ClientOnly>
<Demo>
  <SDialog title="Pickup point on the map" width="48rem">
    <template #trigger>
      <SButton variant="outline">Choose on the map</SButton>
    </template>
    <div style="display: grid; place-items: center; height: 280px; color: var(--s-color-text-muted); background: var(--s-color-surface-variant); border-radius: var(--s-radius-md)">
      Map
    </div>
    <template #footer>
      <SButton variant="primary">Choose</SButton>
    </template>
  </SDialog>

<template #code>

```vue
<template>
  <SDialog
    v-model:open="open"
    title="Pickup point on the map"
    width="48rem"
    class="map-dialog"
  >
    <template #trigger>
      <SButton variant="outline">Choose on the map</SButton>
    </template>

    <MapFrame />

    <template #footer>
      <SButton variant="primary">Choose</SButton>
    </template>
  </SDialog>
</template>
```

  </template>
</Demo>
</ClientOnly>

## API

<ApiTable name="SDialog" />
