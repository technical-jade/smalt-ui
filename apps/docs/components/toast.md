<script setup>
import { ref } from 'vue'
import { useToast } from '@smalt-ui/core'
const { toast } = useToast()

const positions = ['bottom-right', 'bottom-left', 'top-right', 'top-left'].map((value) => ({
  label: value,
  value,
}))
const position = ref('bottom-right')
</script>

# Toast

`SToast` is a pop-up notification about the result of an action. It is built on Reka UI
(a portal into the `ToastViewport` region, auto-dismiss, swipe, screen reader roles) and reuses
`SIcon` for the status icon. Toasts are shown imperatively with the `useToast` composable, and
`ToastProvider` renders the queue.
You rarely use `SToast` directly in a template. A notification that has to stay on screen until the
user has read it belongs in [SAlert](./alert) or [SBanner](./banner).

## Setup

Mount `ToastProvider` once at the root of the app (for example, in `App.vue`). The queue is shared,
so a second mounted provider would duplicate every notification — in development it warns about
that. The `label` prop names the notification region for screen readers (defaults to the locale
dictionary). When the last provider unmounts, the queue is cleared.

```vue
<template>
  <ToastProvider />
  <RouterView />
</template>
```

Then show notifications from any component:

```vue
<script setup lang="ts">
import { useToast } from '@smalt-ui/core'

const { toast } = useToast()

function onSave() {
  toast({
    title: 'Saved',
    description: 'Your changes have been applied',
    variant: 'positive',
  })
}
</script>
```

`toast()` works only in the browser. During server rendering the call is ignored (the queue is
shared by all requests and would otherwise leak into another user's markup), so show
notifications from event handlers or `onMounted`.

## Accessibility and keyboard

- A `negative` toast is announced by a screen reader at once, interrupting the current reading.
  The other variants are announced politely, in a pause.
- The notification area is a separate region named "Notifications (F8)". <kbd>F8</kbd> moves
  focus into it, and then <kbd>Tab</kbd> walks through the toasts. The `label` prop of
  `ToastProvider` changes the region name.
- While the pointer is over the area, focus is inside it or the browser window is inactive, the
  auto-dismiss timer is paused.
- <kbd>Escape</kbd> closes the toast that has focus. Every toast has a close button; its default
  accessible name is "Close".
- A toast can be swiped toward the nearest screen edge (see "Position").

## Duration

A toast hides after 5 seconds. The `duration` option of `toast()` sets the time for one
notification, the `duration` prop of `ToastProvider` or the `SToast` [defaults](/guide/defaults)
set it for all of them. The call option beats the provider prop, and the prop beats the defaults.

## Variants

<ClientOnly>
<Demo>
  <ToastProvider :position="position" />
  <div style="display: flex; flex-wrap: wrap; gap: 8px">
    <SButton variant="outline" @click="toast({ title: 'Message', description: 'An informational notification', variant: 'info' })">Info</SButton>
    <SButton variant="outline" @click="toast({ title: 'Saved', description: 'Your changes have been applied', variant: 'positive' })">Success</SButton>
    <SButton variant="outline" @click="toast({ title: 'Attention', description: 'Check your data', variant: 'warning' })">Warning</SButton>
    <SButton variant="outline" @click="toast({ title: 'Error', description: 'Could not save', variant: 'negative' })">Danger</SButton>
  </div>

<template #code>

```vue
<script setup lang="ts">
import { useToast } from '@smalt-ui/core'
const { toast } = useToast()
</script>

<template>
  <ToastProvider />
  <SButton @click="toast({ title: 'Saved', variant: 'positive' })"> Show </SButton>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Color

The `color` option of `toast()` sets the icon color from the [palette](/style/palette) and
overrides the variant color.

<ClientOnly>
<Demo>
  <SButton variant="outline" @click="toast({ title: 'Indigo', description: 'Indigo accent', color: 'indigo' })">indigo</SButton>
  <SButton variant="outline" @click="toast({ title: 'Blue-grey', description: 'Blue-grey accent', color: 'blue-grey' })">blue-grey</SButton>

<template #code>

```ts
toast({ title: 'Done', color: 'indigo' })
```

  </template>
</Demo>
</ClientOnly>

## Position

The `position` prop of `ToastProvider` sets the corner where notifications appear: `bottom-right`
(default), `bottom-left`, `top-right` and `top-left`. There is one corner for the whole app — the
provider is mounted as a single instance. A new notification always appears at its edge, and older
ones move further into the screen.

Swiping follows the position: in the right corners a notification is swiped to the right, in the
left ones to the left.

The notification region is teleported to `body`, so it is not covered by a header, a sidebar or
any other ancestor with its own stacking context — the provider can be mounted anywhere inside the
app.

<ClientOnly>
<Demo>
  <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px">
    <SRadioGroup v-model="position" :options="positions" orientation="horizontal" label="Corner" />
    <SButton @click="toast({ title: 'File uploaded', description: `Corner: ${position}` })">Show</SButton>
  </div>

<template #code>

```vue
<template>
  <ToastProvider position="top-right" />
</template>
```

  </template>
</Demo>
</ClientOnly>

The corner can also be set globally — through [prop defaults](/guide/defaults), including the
`defaults` option of the Nuxt module:

```ts
createSUI({ defaults: { ToastProvider: { position: 'top-right' } } })
```

## Shape and shadow

`toast()` takes only content and behavior. The look of all toasts (`square` for no rounding,
`flat` or `elevation` for the shadow, and `closeLabel` for the close button name) is set through
the `SToast` [defaults](/guide/defaults):

```ts
createSUI({ defaults: { SToast: { square: true, elevation: 3 } } })
```

## `useToast()`

The composable returns:

- `toast(options)` — shows a notification and returns its `id`. Options: `title`
  (required), `description`, `variant` (`info` · `positive` · `warning` · `negative`),
  `color`, `duration` (ms). An option left out comes from the `ToastProvider` `duration` and then
  from the `SToast` [defaults](/guide/defaults).
- `dismiss(id)` — removes a notification manually.
- `clear()` — empties the whole queue.
- `toasts` — the reactive (read-only) queue of current notifications.

## API

### SToast

<ApiTable name="SToast" />

### ToastProvider

<ApiTable name="ToastProvider" />
