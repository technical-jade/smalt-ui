# Fab

`SFab` is the floating action button: the one action a screen is there for, kept within reach above
the content. It comes in two shapes — a circle with an icon, and, once `label` is set, an extended
pill with an icon and text. Give it a `position` and it pins itself to a corner of the viewport;
`position="static"` leaves it in the flow, wherever the page puts it.

With `actions` the button turns into a speed dial: it opens a fan of secondary actions instead of
acting on its own. That is a shortcut, not a navigation pattern — keep it at three to five entries
of the same rank. A longer list, entries with checkmarks, groups or destructive items belong in a
[dropdown menu](./dropdown-menu); a permanent set of editing controls belongs in a
[toolbar](./toolbar), which stays visible and does not cover the content.

Accessible naming is the part that is easy to get wrong. A circular button shows no text, so it
needs `ariaLabel`; without one the component warns in development. An extended button is named by
its visible `label` and takes no `ariaLabel` — a label that differs from the visible text would hide
the words the visitor reads. A button with `actions` no longer performs the action itself, so it is
named after what it opens: the `showActions` entry of the locale dictionary ("Show actions"),
overridden per instance with `actionsLabel`. Each action is named by its own `label`, which is shown
as a chip beside the button and given to the button as its accessible name.

The fan is a `menu`: <kbd>Enter</kbd> or <kbd>Space</kbd> opens it and moves focus to the first
action, the arrow keys walk along the fan, <kbd>Home</kbd> and <kbd>End</kbd> jump to its ends, and
<kbd>Escape</kbd> closes it and returns focus to the button. Picking an action emits `select` with
the action and closes the fan. The open state is available as `v-model:open`.

## Circular and extended

<Demo>
  <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap">
    <SFab position="static" icon="plus" aria-label="New item" />
    <SFab position="static" icon="pencil" label="Compose" />
    <SFab position="static" icon="plus" aria-label="New item" size="sm" variant="secondary" />
    <SFab position="static" icon="plus" aria-label="New item" size="lg" color="teal" />
  </div>

<template #code>

```vue
<template>
  <SFab
    position="static"
    icon="plus"
    aria-label="New item"
  />
  <SFab
    position="static"
    icon="pencil"
    label="Compose"
  />
  <SFab
    position="static"
    icon="plus"
    aria-label="New item"
    size="sm"
    variant="secondary"
  />
  <SFab
    position="static"
    icon="plus"
    aria-label="New item"
    size="lg"
    color="teal"
  />
</template>
```

  </template>
</Demo>

The sizes follow the Material scale — `sm` 40px, `md` 56px and `lg` 72px — so the button stands out
from the regular controls around it. `variant` and `color` are the same knobs as on
[SButton](./button), and the actions of the fan follow them.

## A fan of actions

<Demo>
  <div style="width: 100%; min-height: 200px; display: flex; align-items: flex-end; justify-content: flex-end">
    <SFab
      position="static"
      icon="plus"
      :actions="[
        { id: 'note', label: 'New note', icon: 'file-text' },
        { id: 'mail', label: 'New message', icon: 'mail' },
        { id: 'event', label: 'New event', icon: 'calendar' },
      ]"
    />
  </div>

<template #code>

```vue
<script setup lang="ts">
import type { SFabAction } from '@smalt-ui/core'

const actions: SFabAction[] = [
  { id: 'note', label: 'New note', icon: 'file-text' },
  { id: 'mail', label: 'New message', icon: 'mail' },
  { id: 'event', label: 'New event', icon: 'calendar' },
]

function create(action: SFabAction) {
  console.log(action.id)
}
</script>

<template>
  <SFab
    icon="plus"
    :actions="actions"
    @select="create"
  />
</template>
```

  </template>
</Demo>

An action with `disabled` stays in the fan but is skipped by clicks and by the arrow keys. Set
`openOn="hover"` to unfold the fan as soon as the pointer reaches the button; the click keeps
working, because a touch screen has no hover.

## Direction

<Demo>
  <div style="width: 100%; min-height: 220px; display: flex; gap: 96px; align-items: center; justify-content: center; flex-wrap: wrap">
    <SFab
      position="static"
      icon="plus"
      aria-label="Share up"
      direction="up"
      :actions="[
        { id: 'copy', label: 'Copy link', icon: 'copy' },
        { id: 'mail', label: 'Send by mail', icon: 'mail' },
      ]"
    />
    <SFab
      position="static"
      icon="plus"
      aria-label="Share sideways"
      direction="end"
      variant="secondary"
      :actions="[
        { id: 'copy', label: 'Copy link', icon: 'copy' },
        { id: 'mail', label: 'Send by mail', icon: 'mail' },
      ]"
    />
  </div>

<template #code>

```vue
<template>
  <SFab
    icon="plus"
    direction="up"
    :actions="actions"
  />
  <SFab
    icon="plus"
    direction="end"
    variant="secondary"
    :actions="actions"
  />
</template>
```

  </template>
</Demo>

`direction` unfolds the fan `up` (the default), `down`, `start` or `end`. `start` and `end` are
logical: they follow the writing direction of the page. In a vertical fan the chips sit beside the
buttons, in a horizontal one underneath them, and they always point away from the edge the button
is pinned to.

## Pinned to a corner

A pinned button is `position: fixed`. The example below sits in a wrapper with a `transform`, which
makes that wrapper the containing block — otherwise the button would float over the documentation
instead of staying inside the example. The distance from the corner is set by the `--s-fab-top`,
`--s-fab-right`, `--s-fab-bottom` and `--s-fab-left` custom properties (`1.5rem` by default), so the
button can be moved without overriding a single rule.

<Demo>
  <div style="position: relative; transform: translateZ(0); width: 100%; height: 240px; border: 1px solid var(--s-color-border); border-radius: 8px; overflow: hidden">
    <div style="padding: 96px 16px 16px; color: var(--s-color-text-muted)">A page that scrolls under the buttons.</div>
    <SFab
      icon="plus"
      position="bottom-end"
      style="--s-fab-right: 16px; --s-fab-bottom: 16px"
      :actions="[
        { id: 'note', label: 'New note', icon: 'file-text' },
        { id: 'mail', label: 'New message', icon: 'mail' },
      ]"
    />
    <SFab
      icon="pencil"
      label="Compose"
      position="top-start"
      style="--s-fab-left: 16px; --s-fab-top: 16px"
    />
  </div>

<template #code>

```vue
<template>
  <SFab
    icon="plus"
    position="bottom-end"
    :actions="actions"
    style="--s-fab-right: 16px; --s-fab-bottom: 16px"
  />
  <SFab
    icon="pencil"
    label="Compose"
    position="top-start"
  />
</template>
```

  </template>
</Demo>

A pinned button sits at `z-index: var(--s-z-sticky)`, under dialogs and toasts. Only one floating
action button belongs on a screen: a second one competes with the first for the same "the" action.

## API

<ApiTable name="SFab" />
