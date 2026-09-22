# Aspect Ratio

`SAspectRatio` keeps its content (an image, video, map, or embed) at a fixed aspect ratio
regardless of the container width, so the layout does not jump while media loads. The `ratio` prop
is the width divided by the height.
`class` and `style` apply to the outer box, so they size the whole component. A `ratio` that is
not a positive finite number falls back to 1:1 with a warning in development. `square` removes
the border radius.

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

The content is usually an `<img>`/`<video>`/`<iframe>`: the component crops it to the frame
(`object-fit: cover`) while keeping the proportions.

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

## API

<ApiTable name="SAspectRatio" />
