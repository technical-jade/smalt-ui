# Aspect Ratio

`SAspectRatio` keeps its content (an image, video, map, or embed) at a fixed aspect ratio
regardless of the container width, so the layout does not jump while media loads. The `ratio` prop
is the width divided by the height (`1` by default). The width comes from the parent. `class` and
`style` apply to the outer box, so a `max-width` on the component itself limits all of it.
`square` removes the rounding of the corners.

## Basic usage

<Demo>
  <ClientOnly>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%">
      <SAspectRatio :ratio="1">
        <div style="width:100%;height:100%;display:grid;place-items:center;background:var(--s-color-surface-variant);color:var(--s-color-text-muted)">1:1</div>
      </SAspectRatio>
      <SAspectRatio :ratio="4 / 3">
        <div style="width:100%;height:100%;display:grid;place-items:center;background:var(--s-color-surface-variant);color:var(--s-color-text-muted)">4:3</div>
      </SAspectRatio>
      <SAspectRatio :ratio="16 / 9">
        <div style="width:100%;height:100%;display:grid;place-items:center;background:var(--s-color-surface-variant);color:var(--s-color-text-muted)">16:9</div>
      </SAspectRatio>
    </div>
  </ClientOnly>

<template #code>

```vue
<template>
  <SAspectRatio :ratio="1">…</SAspectRatio>
  <SAspectRatio :ratio="4 / 3">…</SAspectRatio>
  <SAspectRatio :ratio="16 / 9">…</SAspectRatio>
</template>
```

  </template>
</Demo>

## With media

The content is usually an `<img>`, `<video>` or `<iframe>`. When such an element is a direct
child, it stretches to the whole frame and is cropped to it (`object-fit: cover`), keeping the
proportions.

<Demo>
  <div style="max-width: 320px">
    <SAspectRatio :ratio="16 / 9">
      <img
        src="https://picsum.photos/seed/smalt/640/360"
        alt="16:9 example"
        style="width: 100%; height: 100%; object-fit: cover"
      />
    </SAspectRatio>
  </div>

<template #code>

```vue
<template>
  <SAspectRatio :ratio="16 / 9">
    <img
      src="/cover.jpg"
      alt="Cover"
    />
  </SAspectRatio>
</template>
```

  </template>
</Demo>

## Invalid ratio

Zero, a negative number or `NaN` in `ratio` is replaced with `1`, and in development a warning is
logged. A typical case is `video.videoWidth / video.videoHeight` before the metadata has loaded:
without this safeguard the block would collapse to zero height.

## API

<ApiTable name="SAspectRatio" />
