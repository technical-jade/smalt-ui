# Skeleton

`SSkeleton` is a loading placeholder: it fills the space of upcoming content with a shimmering
gray block, which makes the delay feel shorter. Pure CSS with no dependencies; the element is
decorative (`aria-hidden`), so duplicate the loading status as text nearby for screen readers.

## Accessibility

The skeleton is hidden from screen readers (`aria-hidden="true"`): the gray blocks say nothing.
Report the loading itself separately, for example with `aria-busy="true"` on the container and
visually hidden "Loading" text:

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <section :aria-busy="loading">
    <template v-if="loading">
      <span class="s-sr-only">Loading</span>
      <SSkeleton width="60%" />
      <SSkeleton width="90%" />
    </template>
    <ArticleBody v-else />
  </section>
</template>
```

## Shapes

`variant` sets the shape: `text` (the default) is a line `1em` high across the full width, `rect`
is a rectangle and `circle` is a 2.5rem circle, for example under an avatar. `width` and `height`
take a number of pixels or any CSS value. The default height of `rect` is `100%` of the parent, so
set it explicitly in a container without a height.

<Demo>
  <div style="display: flex; align-items: center; gap: 16px; width: 100%">
    <SSkeleton variant="circle" :width="48" :height="48" />
    <div style="flex: 1; display: flex; flex-direction: column; gap: 8px">
      <SSkeleton variant="text" width="40%" />
      <SSkeleton variant="text" width="80%" />
    </div>
  </div>

<template #code>

```vue
<template>
  <SSkeleton
    variant="circle"
    :width="48"
    :height="48"
  />
  <SSkeleton
    variant="text"
    width="40%"
  />
  <SSkeleton
    variant="rect"
    width="100%"
    :height="120"
  />
</template>
```

  </template>
</Demo>

## Placeholder card

<Demo>
  <div style="width: 260px; display: flex; flex-direction: column; gap: 12px">
    <SSkeleton variant="rect" width="100%" :height="140" />
    <SSkeleton variant="text" width="70%" />
    <SSkeleton variant="text" width="90%" />
    <SSkeleton variant="text" width="50%" />
  </div>

<template #code>

```vue
<template>
  <SSkeleton
    variant="rect"
    width="100%"
    :height="140"
  />
  <SSkeleton
    variant="text"
    width="70%"
  />
  <SSkeleton
    variant="text"
    width="90%"
  />
</template>
```

  </template>
</Demo>

## Without animation

`:animated="false"` removes the shimmer. Under `prefers-reduced-motion: reduce` it goes away on
its own.

<Demo>
  <SSkeleton variant="rect" width="200px" :height="32" :animated="false" />

<template #code>

```vue
<template>
  <SSkeleton
    variant="rect"
    width="200px"
    :height="32"
    :animated="false"
  />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SSkeleton" />
