# Context Menu

`SContextMenu` is an action menu opened by a right click (or a long press on touch devices) on the
trigger area. It is built on Reka UI (portal, keyboard navigation, `menu`/`menuitem` roles). The
entries come from the `items` prop (items, separators, group labels), leading icons are rendered
with `SIcon`. Picking an item emits the `select` event.
Tab in a non-modal menu closes it and returns focus to the page after the trigger area.

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

The `menu` slot fully replaces the menu content (instead of the `items` prop), for example to add a
group label and custom actions with arbitrary markup.

<ClientOnly>
<Demo>
  <SContextMenu aria-label="Quick actions">
    <div style="display: grid; place-items: center; height: 120px; border: 1px dashed var(--s-color-outline); border-radius: var(--s-radius-md); color: var(--s-color-text-muted)">
      Right-click here
    </div>
    <template #menu>
      <div style="display: flex; flex-direction: column; gap: 4px; min-width: 180px">
        <span style="display: inline-flex; align-items: center; gap: 8px; padding: 4px 8px; color: var(--s-color-text-muted); font-size: 12px">
          <SIcon icon="star" :size="14" />
          Quick actions
        </span>
        <SButton variant="ghost" size="sm">Add to favorites</SButton>
        <SButton variant="ghost" size="sm">Share</SButton>
      </div>
    </template>
  </SContextMenu>

<template #code>

```vue
<template>
  <SContextMenu aria-label="Quick actions">
    <div>Right-click here</div>
    <template #menu>
      <span>Quick actions</span>
      <SButton
        variant="ghost"
        size="sm"
      >
        Add to favorites
      </SButton>
      <SButton
        variant="ghost"
        size="sm"
      >
        Share
      </SButton>
    </template>
  </SContextMenu>
</template>
```

  </template>
</Demo>
</ClientOnly>

## API

<ApiTable name="SContextMenu" />
