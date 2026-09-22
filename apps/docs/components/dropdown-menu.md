<script setup>
import { ref } from 'vue'
const dropdownOpen = ref(false)
</script>

# Dropdown Menu

`SDropdownMenu` is a dropdown action menu attached to a trigger. It is built on Reka UI (portal,
keyboard navigation, `roving focus`, `menu`/`menuitem` roles). The entries come from the `items`
prop: items, separators (`separator`), and group labels (`label`); leading icons are rendered with
the reusable `SIcon`.
`aria-label` names the menu; without it the menu is named by its trigger. Tab in a non-modal menu
closes it and moves focus on from the trigger, the same as leaving any other control.

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

The `side` (where the menu appears) and `align` (alignment along that side) props control the menu
position relative to the trigger.

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

The open state is bound with `v-model:open`, so it can be controlled from an external button.

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

## API

<ApiTable name="SDropdownMenu" />
