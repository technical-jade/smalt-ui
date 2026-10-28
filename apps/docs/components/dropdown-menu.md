<script setup>
import { ref } from 'vue'
const dropdownOpen = ref(false)
</script>

# Dropdown Menu

`SDropdownMenu` is an action menu that opens on a click on its trigger. The trigger goes into the
`#trigger` slot and becomes the menu button itself, with no extra wrapper. The menu is rendered in
`<body>` through a portal, so a parent's `overflow` does not clip it. It is built on Reka UI.

The entries come from the `items` prop: items, separators (`type: 'separator'`) and group labels
(`type: 'label'`); leading icons are rendered with the reusable `SIcon`. Picking an item closes
the menu and emits `select` with its `value`; an item without a `value` closes the menu but emits
nothing. Attributes passed to the component (`class`, `data-*`) land on the menu panel, not on the
trigger.

## Basic usage

<ClientOnly>
<Demo>
  <SDropdownMenu
    aria-label="User menu"
    :items="[
      { type: 'label', label: 'Account' },
      { label: 'Profile', value: 'profile' },
      { label: 'Settings', value: 'settings' },
      { type: 'separator' },
      {
        label: 'Log out',
        value: 'logout',
        danger: true
      }
    ]"
  >
    <template #trigger>
      <SButton variant="outline">Open menu</SButton>
    </template>
  </SDropdownMenu>

<template #code>

```vue
<script setup>
function onSelect(value) {
  console.log(value)
}
</script>

<template>
  <SDropdownMenu
    aria-label="User menu"
    :items="[
      { type: 'label', label: 'Account' },
      { label: 'Profile', value: 'profile' },
      { type: 'separator' },
      {
        label: 'Log out',
        value: 'logout',
        danger: true,
      },
    ]"
    @select="onSelect"
  >
    <template #trigger>
      <SButton variant="outline">Open menu</SButton>
    </template>
  </SDropdownMenu>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Item icons

The item's `icon` field renders a leading icon with `SIcon` (a registry name or a raw path).
`danger` marks a destructive action in red and `disabled` locks an item; the keyboard skips it.

<ClientOnly>
<Demo>
  <SDropdownMenu
    aria-label="Actions"
    :items="[
      { type: 'label', label: 'Edit' },
      { label: 'Edit', value: 'edit', icon: 'pencil' },
      { label: 'Duplicate', value: 'copy', icon: 'copy' },
      { type: 'separator' },
      {
        label: 'Delete',
        value: 'remove',
        icon: 'trash-2',
        danger: true
      }
    ]"
  >
    <template #trigger>
      <SButton variant="outline">Open menu</SButton>
    </template>
  </SDropdownMenu>

<template #code>

```vue
<script setup>
function onSelect(value) {
  console.log(value)
}
</script>

<template>
  <SDropdownMenu
    aria-label="Actions"
    :items="[
      { type: 'label', label: 'Edit' },
      { label: 'Edit', value: 'edit', icon: 'pencil' },
      { label: 'Duplicate', value: 'copy', icon: 'copy' },
      { type: 'separator' },
      {
        label: 'Delete',
        value: 'remove',
        icon: 'trash-2',
        danger: true,
      },
    ]"
    @select="onSelect"
  >
    <template #trigger>
      <SButton variant="outline">Open menu</SButton>
    </template>
  </SDropdownMenu>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Positioning

`side` sets the side of the trigger the menu appears on (`bottom` by default), `align` the
alignment along that side (`start` by default) and `side-offset` the gap in pixels (8 by default).
If there is not enough room the menu flips to the opposite side.

<ClientOnly>
<Demo>
  <div style="display: flex; flex-wrap: wrap; gap: 8px">
    <SDropdownMenu
      side="bottom"
      align="start"
      aria-label="Bottom-left menu"
      :items="[
        { label: 'Profile', value: 'profile' },
        { label: 'Settings', value: 'settings' }
      ]"
    >
      <template #trigger>
        <SButton variant="outline">bottom / start</SButton>
      </template>
    </SDropdownMenu>
    <SDropdownMenu
      side="right"
      align="start"
      aria-label="Right menu"
      :items="[
        { label: 'Profile', value: 'profile' },
        { label: 'Settings', value: 'settings' }
      ]"
    >
      <template #trigger>
        <SButton variant="outline">right / start</SButton>
      </template>
    </SDropdownMenu>
    <SDropdownMenu
      side="top"
      align="end"
      aria-label="Top-right menu"
      :items="[
        { label: 'Profile', value: 'profile' },
        { label: 'Settings', value: 'settings' }
      ]"
    >
      <template #trigger>
        <SButton variant="outline">top / end</SButton>
      </template>
    </SDropdownMenu>
  </div>

<template #code>

```vue
<template>
  <SDropdownMenu
    side="right"
    align="start"
    aria-label="Action menu"
    :items="[
      { label: 'Profile', value: 'profile' },
      { label: 'Settings', value: 'settings' },
    ]"
  >
    <template #trigger>
      <SButton variant="outline">right / start</SButton>
    </template>
  </SDropdownMenu>
</template>
```

  </template>
</Demo>
</ClientOnly>

## External control

The open state is bound with `v-model:open`, so the menu can be opened and closed from code, for
example by an external button. It is still positioned relative to its own trigger.

<ClientOnly>
<Demo>
  <div style="display: flex; align-items: center; gap: 8px">
    <SButton @click="dropdownOpen = !dropdownOpen">Toggle menu</SButton>
    <SDropdownMenu
      v-model:open="dropdownOpen"
      aria-label="Controlled menu"
      :items="[
        { label: 'Profile', value: 'profile' },
        { label: 'Settings', value: 'settings' }
      ]"
    >
      <template #trigger>
        <SButton variant="outline">Anchor</SButton>
      </template>
    </SDropdownMenu>
  </div>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <SButton @click="open = !open">Toggle menu</SButton>
  <SDropdownMenu
    v-model:open="open"
    aria-label="Controlled menu"
    :items="[
      { label: 'Profile', value: 'profile' },
      { label: 'Settings', value: 'settings' },
    ]"
  >
    <template #trigger>
      <SButton variant="outline">Anchor</SButton>
    </template>
  </SDropdownMenu>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Custom content

The default slot replaces the list from `items`. Only Reka UI primitives become menu items:
`DropdownMenuItem`, `DropdownMenuSeparator` and `DropdownMenuLabel` from `reka-ui`, a peer
dependency of `@smalt-ui/core`. They get `role="menuitem"` and arrow-key navigation, and picking
one closes the menu. The classes `s-dropdown-menu__item`, `__separator`, `__label` and `__icon`
give them the look of the built-in entries, and `s-dropdown-menu__item--danger` the accent of a
destructive action. The component's `select` event does not fire for these items: listen to
`@select` on the item itself. Do not put plain buttons or links in the slot: inside `role="menu"`
they stay without an item role, and the arrow keys skip them.

```vue
<script setup lang="ts">
import { DropdownMenuItem, DropdownMenuSeparator } from 'reka-ui'

function openProfile() {}
function signOut() {}
</script>

<template>
  <SDropdownMenu aria-label="Account">
    <template #trigger>
      <SButton variant="outline">Account</SButton>
    </template>
    <DropdownMenuItem
      class="s-dropdown-menu__item"
      @select="openProfile"
    >
      Profile
    </DropdownMenuItem>
    <DropdownMenuSeparator class="s-dropdown-menu__separator" />
    <DropdownMenuItem
      class="s-dropdown-menu__item s-dropdown-menu__item--danger"
      @select="signOut"
    >
      Sign out
    </DropdownMenuItem>
  </SDropdownMenu>
</template>
```

## Keyboard and accessibility

The panel gets `role="menu"` and the items `role="menuitem"`.

- <kbd>Enter</kbd>, <kbd>Space</kbd> or <kbd>↓</kbd> on the trigger open the menu and focus the
  first item.
- <kbd>↑</kbd>/<kbd>↓</kbd> move between items, <kbd>Home</kbd>/<kbd>End</kbd> go to the first
  and the last. Typing letters moves focus to the item that starts with them.
- <kbd>Enter</kbd> or <kbd>Space</kbd> pick an item.
- <kbd>Escape</kbd> closes the menu and returns focus to the trigger.
- <kbd>Tab</kbd> closes the menu, and focus moves on to the element after the trigger.

The `aria-label` prop gives the menu its own accessible name; without it the menu is named by the
trigger text. By default the menu is non-modal: the page behind it scrolls and a click outside
simply closes it. `modal` blocks interaction with the background and keeps focus inside the menu,
but it removes the page scroll bar while open, so the layout may shift.

## API

<ApiTable name="SDropdownMenu" />
