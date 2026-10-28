# Context Menu

`SContextMenu` is an action menu opened by a right click (or a long press on touch devices) on the
trigger area. It is built on Reka UI (portal, keyboard navigation, `menu`/`menuitem` roles). The
entries come from the `items` prop (items, separators, group labels), leading icons are rendered
with `SIcon`. Picking an item emits the `select` event.
Attributes passed to the component (`class`, `data-*`) land on the menu panel. The trigger area is
the default slot and must be a single root element: the component attaches its handlers to it
directly, without a wrapper. Picking an item closes the menu and emits `select` with its `value`;
an item without a `value` emits nothing. `disabled` blocks an item and `danger` marks a
destructive action.

## Basic usage

<ClientOnly>
<Demo>
  <SContextMenu
    aria-label="Actions"
    :items="[
      { type: 'label', label: 'Edit' },
      { label: 'Copy', value: 'copy' },
      { label: 'Paste', value: 'paste' },
      { type: 'separator' },
      {
        label: 'Delete',
        value: 'delete',
        danger: true
      }
    ]"
  >
    <div style="display: grid; place-items: center; height: 120px; border: 1px dashed var(--s-color-outline); border-radius: var(--s-radius-md); color: var(--s-color-text-muted)">
      Right-click here
    </div>
  </SContextMenu>

<template #code>

```vue
<script setup>
function onSelect(value) {
  console.log(value)
}
</script>

<template>
  <SContextMenu
    aria-label="Actions"
    :items="[
      { label: 'Copy', value: 'copy' },
      { type: 'separator' },
      {
        label: 'Delete',
        value: 'delete',
        danger: true,
      },
    ]"
    @select="onSelect"
  >
    <div>Right-click here</div>
  </SContextMenu>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Item icons

The item's `icon` field renders a leading icon with `SIcon` (a registry name or a raw path).

<ClientOnly>
<Demo>
  <SContextMenu
    aria-label="Actions"
    :items="[
      { type: 'label', label: 'Edit' },
      { label: 'Copy', value: 'copy', icon: 'copy' },
      { label: 'Rename', value: 'rename', icon: 'pencil' },
      { type: 'separator' },
      {
        label: 'Delete',
        value: 'remove',
        icon: 'trash-2',
        danger: true
      }
    ]"
  >
    <div style="display: grid; place-items: center; height: 120px; border: 1px dashed var(--s-color-outline); border-radius: var(--s-radius-md); color: var(--s-color-text-muted)">
      Right-click here
    </div>
  </SContextMenu>

<template #code>

```vue
<script setup>
function onSelect(value) {
  console.log(value)
}
</script>

<template>
  <SContextMenu
    aria-label="Actions"
    :items="[
      { label: 'Copy', value: 'copy', icon: 'copy' },
      { label: 'Rename', value: 'rename', icon: 'pencil' },
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
    <div>Right-click here</div>
  </SContextMenu>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Custom menu

The `menu` slot replaces the list from `items` when the entries need markup or handlers of their
own. Only Reka UI primitives become menu items: `ContextMenuItem`, `ContextMenuSeparator` and
`ContextMenuLabel` from `reka-ui`, which is already installed as a peer dependency of
`@smalt-ui/core`. They get `role="menuitem"`, arrow-key and typeahead navigation, and picking one
closes the menu. The classes `s-context-menu__item`, `__separator`, `__label` and `__icon` give them
the look of the built-in entries, and `s-context-menu__item--danger` the accent of a destructive
action. The component's `select` event does not fire for these items: listen to `@select` on the
item itself.

Do not put plain buttons or links in this slot. They end up inside `role="menu"` without an item
role: a screen reader announces an empty menu, and the arrow keys skip them. The area itself opens
the menu from the keyboard (Shift+F10, the menu key) only when it is focusable, hence the
`tabindex` below.

```vue
<script setup lang="ts">
import { ContextMenuItem, ContextMenuLabel } from 'reka-ui'

function addToFavorites() {}
function share() {}
</script>

<template>
  <SContextMenu aria-label="Quick actions">
    <div tabindex="0">Right-click here</div>
    <template #menu>
      <ContextMenuLabel class="s-context-menu__label">Quick actions</ContextMenuLabel>
      <ContextMenuItem
        class="s-context-menu__item"
        @select="addToFavorites"
      >
        <SIcon
          icon="star"
          class="s-context-menu__icon"
          :size="16"
        />
        Add to favorites
      </ContextMenuItem>
      <ContextMenuItem
        class="s-context-menu__item"
        @select="share"
      >
        Share
      </ContextMenuItem>
    </template>
  </SContextMenu>
</template>
```

## Keyboard and accessibility

The panel gets `role="menu"` and the items `role="menuitem"`. <kbd>↑</kbd>/<kbd>↓</kbd> move
between items, <kbd>Home</kbd>/<kbd>End</kbd> go to the first and the last, and typing letters
moves to the item that starts with them. <kbd>Enter</kbd> or <kbd>Space</kbd> pick an item and
<kbd>Escape</kbd> closes the menu. <kbd>Tab</kbd> also closes a non-modal menu and returns focus
to where it was before opening, and the browser moves it to the next element.

From the keyboard the menu opens with the context-menu key or <kbd>Shift</kbd>+<kbd>F10</kbd>,
but only when the trigger area can take focus. A plain `div` does not, so either give it
`tabindex="0"` or duplicate the menu actions with visible buttons. The menu has no visible title,
so name it with the `aria-label` prop.

By default the menu is non-modal: the page behind it scrolls and a click outside closes it.
`modal` blocks interaction with the background and keeps focus inside the menu, but it removes the
page scroll bar while open, so the layout may shift.

## API

<ApiTable name="SContextMenu" />
