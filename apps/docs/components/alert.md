# Alert

`SAlert` is a notification block with a semantic variant, a title and optional dismissal. The
status icon is rendered with the reusable `SIcon` (composition instead of duplicated SVG).

## Variants

<Demo>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 100%">
    <SAlert variant="info" title="Information">A regular informational message.</SAlert>
    <SAlert variant="positive" title="Done">Your changes have been saved.</SAlert>
    <SAlert variant="warning" title="Warning">Please check the data you entered.</SAlert>
    <SAlert variant="negative" title="Error">The operation could not be completed.</SAlert>
  </div>

<template #code>

```vue
<template>
  <SAlert
    variant="positive"
    title="Done"
  >
    Your changes have been saved.
  </SAlert>
  <SAlert
    variant="negative"
    title="Error"
  >
    The operation could not be completed.
  </SAlert>
</template>
```

  </template>
</Demo>

## Closable

The close button hides the alert and emits `close`. To show it again, bind `v-model:visible`.

<Demo>
  <SAlert variant="info" title="Tip" closable style="width: 100%">
    This notification can be closed.
  </SAlert>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)
</script>

<template>
  <SAlert
    v-model:visible="visible"
    variant="info"
    title="Tip"
    closable
  >
    This notification can be closed.
  </SAlert>
</template>
```

  </template>
</Demo>

## Custom icon

The `icon` prop overrides the icon assigned by the status variant — pass a registry name.

<Demo>
  <SAlert variant="positive" icon="info" title="Note" style="width: 100%">
    The status icon is replaced with a custom one.
  </SAlert>

<template #code>

```vue
<template>
  <SAlert
    variant="positive"
    icon="info"
    title="Note"
  >
    The status icon is replaced with a custom one.
  </SAlert>
</template>
```

  </template>
</Demo>

## Title and icon slots

The `icon` and `title` slots replace the status icon and the title with your own markup (the
`icon` slot takes precedence over the `icon` prop).

<Demo>
  <SAlert variant="info" style="width: 100%">
    <template #icon>
      <SIcon icon="bell" :size="18" style="color: var(--s-color-primary)" />
    </template>
    <template #title>New notification <SBadge>N</SBadge></template>
    The icon and title slots replace the icon and the title with your own markup.
  </SAlert>

<template #code>

```vue
<template>
  <SAlert variant="info">
    <template #icon>
      <SIcon
        icon="bell"
        :size="18"
      />
    </template>
    <template #title>New notification <SBadge>N</SBadge></template>
    The icon and title slots replace the icon and the title with your own markup.
  </SAlert>
</template>
```

  </template>
</Demo>

## Color

The `color` prop sets a color from the [palette](/style/palette) and overrides the variant color.

<Demo>
  <div style="display: grid; gap: 12px; width: 100%">
    <SAlert variant="info" color="indigo" title="Indigo">A calm accent from the palette.</SAlert>
    <SAlert variant="info" color="blue-grey" title="Blue-grey">A neutral bluish-gray accent.</SAlert>
  </div>

<template #code>

```vue
<template>
  <SAlert
    variant="info"
    color="indigo"
    title="Indigo"
  >
    A calm accent.
  </SAlert>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SAlert" />
