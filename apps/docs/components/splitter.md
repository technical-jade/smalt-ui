# Splitter

`SSplitter` divides an area into panels with draggable dividers — the user sets the width/height
of the sections (sidebar + content, editor + preview). The handles are keyboard accessible
(arrow keys resize), and Reka keeps the ARIA attributes. Panels are described with the `panels`
array, content goes into the `panel-0`, `panel-1`, … slots (or by `name`). Give panels a `name`
when the list changes at runtime: panels are tracked by it, so removing one keeps the sizes of the
rest.
Each handle is named from the locale dictionary (`resize` key) or by `handle-label`. Enter on a
handle collapses the `collapsible` panel before it and restores its size.

## Basic usage

<script setup>
const panels = [
  { defaultSize: 30, minSize: 15 },
  { defaultSize: 70, minSize: 30 },
]
</script>

<Demo>
  <ClientOnly>
    <div style="height: 200px">
      <SSplitter :panels="panels">
        <template #panel-0>
          <div style="padding: 16px; height: 100%; background: var(--s-color-surface-variant)">Sidebar</div>
        </template>
        <template #panel-1>
          <div style="padding: 16px; height: 100%">Main area — drag the divider.</div>
        </template>
      </SSplitter>
    </div>
  </ClientOnly>

<template #code>

```vue
<script setup>
const panels = [
  { defaultSize: 30, minSize: 15 },
  { defaultSize: 70, minSize: 30 },
]
</script>

<template>
  <SSplitter :panels="panels">
    <template #panel-0>Sidebar</template>
    <template #panel-1>Main area</template>
  </SSplitter>
</template>
```

  </template>
</Demo>

## Vertical split

<Demo>
  <ClientOnly>
    <div style="height: 240px">
      <SSplitter :panels="panels" direction="vertical">
        <template #panel-0>
          <div style="padding: 16px; height: 100%; background: var(--s-color-surface-variant)">Top panel</div>
        </template>
        <template #panel-1>
          <div style="padding: 16px; height: 100%">Bottom panel</div>
        </template>
      </SSplitter>
    </div>
  </ClientOnly>

<template #code>

```vue
<template>
  <SSplitter
    :panels="panels"
    direction="vertical"
  >
    <template #panel-0>Top panel</template>
    <template #panel-1>Bottom panel</template>
  </SSplitter>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SSplitter" />
