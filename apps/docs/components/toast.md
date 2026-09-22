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
A `negative` toast is announced to screen readers at once (assertive), the other variants
politely, without interrupting.

## Setup

Mount `ToastProvider` once at the root of the app (for example, in `App.vue`):

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

## `useToast()`

The composable returns:

- `toast(options)` — shows a notification and returns its `id`. Options: `title`
  (required), `description`, `variant` (`info` · `positive` · `warning` · `negative`),
  `color`, `duration` (ms). An option left out comes from the `ToastProvider` `duration` and then
  from the `SToast` [defaults](/guide/defaults).
- `dismiss(id)` — removes a notification manually.
- `toasts` — the reactive (read-only) queue of current notifications.

## API

### SToast

<ApiTable name="SToast" />

### ToastProvider

<ApiTable name="ToastProvider" />
