# Menubar

`SMenubar` is a horizontal application menu bar (like "File / Edit / View"). It is built on
Reka UI (the `menubar` role, arrow-key navigation between menus, portaled dropdown panels). Menus
are set with the `menus` prop (a label + items); items work as in `SDropdownMenu`
(item/separator/label, icons via `SIcon`). Choosing an item emits `select`.

## Basic usage

<ClientOnly>
<Demo>
  <SMenubar
    aria-label="Main menu"
    :menus="[
      {
        label: 'File',
        items: [
          { label: 'New', value: 'new' },
          { label: 'Open…', value: 'open' },
          { type: 'separator' },
          {
            label: 'Quit',
            value: 'quit',
            danger: true
          }
        ],
      },
      {
        label: 'Edit',
        items: [
          { label: 'Copy', value: 'copy' },
          { label: 'Paste', value: 'paste' }
        ],
      },
      { label: 'View', items: [{ label: 'Full screen', value: 'fullscreen' }] }
    ]"
  />

<template #code>

```vue
<template>
  <SMenubar
    aria-label="Main menu"
    :menus="[
      { label: 'File', items: [{ label: 'Open…', value: 'open' }] },
      { label: 'Edit', items: [{ label: 'Copy', value: 'copy' }] },
    ]"
    @select="onSelect"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Item icons

The `icon` field of a menu item draws a leading icon via `SIcon` (a registry name or a raw path).

<ClientOnly>
<Demo>
  <SMenubar
    aria-label="Main menu"
    :menus="[
      {
        label: 'File',
        items: [
          { label: 'New', value: 'new', icon: 'plus' },
          { label: 'Open…', value: 'open', icon: 'folder' },
          { type: 'separator' },
          {
            label: 'Quit',
            value: 'quit',
            icon: 'log-out',
            danger: true
          }
        ],
      },
      {
        label: 'Edit',
        items: [
          { label: 'Copy', value: 'copy', icon: 'copy' },
          { label: 'Delete', value: 'delete', icon: 'trash-2' }
        ],
      }
    ]"
  />

<template #code>

```vue
<template>
  <SMenubar
    aria-label="Main menu"
    :menus="[
      {
        label: 'File',
        items: [
          { label: 'New', value: 'new', icon: 'plus' },
          { label: 'Open…', value: 'open', icon: 'folder' },
        ],
      },
      {
        label: 'Edit',
        items: [{ label: 'Copy', value: 'copy', icon: 'copy' }],
      },
    ]"
    @select="onSelect"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Keyboard and accessibility

The bar gets `role="menubar"` and takes one <kbd>Tab</kbd> stop. Name it with the `aria-label`
prop.

- <kbd>←</kbd>/<kbd>→</kbd> move between menu labels.
- <kbd>Enter</kbd>, <kbd>Space</kbd> or <kbd>↓</kbd> open a menu and focus its first item.
- In an open menu <kbd>↑</kbd>/<kbd>↓</kbd> walk the items and <kbd>←</kbd>/<kbd>→</kbd> open the
  neighboring menu.
- <kbd>Escape</kbd> closes the menu and returns focus to its label.

While one menu is open, hovering a neighboring label opens its menu at once.

## API

<ApiTable name="SMenubar" />
