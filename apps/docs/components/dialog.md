# Dialog

`SDialog` is a modal window built on Reka UI. While it is open the background is dimmed and inert,
focus cannot leave the window, and the content is rendered in a portal at `body`. The window closes
on <kbd>Esc</kbd>, on a click on the overlay and with the cross button in the corner. It is
controlled with `v-model:open`; the element that opens it is passed through the `#trigger` slot.
After closing, focus returns to the trigger, or, when the dialog is opened from code without a
`#trigger` slot, to the element that had focus when it opened. Long content scrolls in the body
while the title, the footer actions and the close button stay in view.

## Basic usage

<ClientOnly>
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
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

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
</ClientOnly>

Buttons in the `#footer` slot do not close the window themselves: close it in the handler by
resetting `v-model:open`.

## Opening without a trigger

The `#trigger` slot is optional. Without it, open the window from code by setting `v-model:open` to
`true`, for example after a server response or from a menu item. After closing, focus returns to
the element that had focus at the moment of opening; if nothing had focus, there is nothing to
return to.

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
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

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

## Animation

The window fades in with a slight zoom while the overlay darkens, and both leave the same way on
close. The entry takes `--s-duration-slow`, the exit `--s-duration-base`. With
`prefers-reduced-motion: reduce` there is no animation. [`SAlertDialog`](/components/alert-dialog)
appears the same way, and [`SDrawer`](/components/drawer) slides in from its side.

## Accessibility

- The window has the `dialog` role. Its accessible name comes from the title (`title` or the
  `#title` slot); without one a screen reader reads the visually hidden "Dialog" label, so set a
  title whenever you can.
- The description (`description` or the `#description` slot) is linked through
  `aria-describedby`; without a description the attribute is absent.
- On open, focus moves into the window and <kbd>Tab</kbd> cycles through its elements only. After
  closing, focus returns to the trigger, or, without a trigger, to where it was before opening.
- The close button is named "Close"; the `closeLabel` prop changes the name and the `#close` slot
  changes its content.

## API

<ApiTable name="SDialog" />
