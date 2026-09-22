# Image

`SImage` shows a picture with lazy loading, a placeholder while it loads and a fallback when it
fails. `alt` is required: without a text alternative the image is silent to a screen reader and
leaves nothing behind when the request fails — a purely decorative picture passes an empty string.

`ratio` wraps the picture in [`SAspectRatio`](./aspect-ratio), so the frame reserves its height
before the file arrives and the layout does not jump. Without `ratio` the frame is sized by your
own CSS. `fit` and `position` map to `object-fit`/`object-position`, and `square` removes the
border radius. Changing `src` starts over: the placeholder comes back for the new picture.

## Basic usage

<Demo>
  <div style="width: 420px; max-width: 100%">
    <SImage
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%2338bdf8'/%3E%3Cstop offset='1' stop-color='%23c7d2fe'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23sky)'/%3E%3Ccircle cx='508' cy='86' r='40' fill='%23fde68a'/%3E%3Cpath d='M0 300 L150 186 L268 300 Z' fill='%230f766e'/%3E%3Cpath d='M196 300 L380 150 L564 300 Z' fill='%23115e59'/%3E%3Crect y='300' width='640' height='60' fill='%23064e3b'/%3E%3C/svg%3E"
      alt="Sunlit hills under a clear sky"
      :ratio="16 / 9"
    />
  </div>

<template #code>

```vue
<template>
  <SImage
    src="/photos/hills.jpg"
    alt="Sunlit hills under a clear sky"
    :ratio="16 / 9"
  />
</template>
```

  </template>
</Demo>

## Fit and position

`fit` decides what happens when the picture and the frame have different proportions: `cover`
crops it, `contain` fits the whole picture inside, `fill` stretches it. `position` moves the
visible part of a cropped picture (`'top'`, `'50% 20%'`).

<Demo>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%">
    <SImage
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='400'%3E%3Crect width='200' height='400' fill='%23fbbf24'/%3E%3Ccircle cx='100' cy='120' r='58' fill='%23fff7ed'/%3E%3Crect x='36' y='214' width='128' height='150' rx='18' fill='%23c2410c'/%3E%3C/svg%3E"
      alt="Portrait cropped to a square"
      :ratio="1"
      fit="cover"
      position="top"
    />
    <SImage
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='400'%3E%3Crect width='200' height='400' fill='%23fbbf24'/%3E%3Ccircle cx='100' cy='120' r='58' fill='%23fff7ed'/%3E%3Crect x='36' y='214' width='128' height='150' rx='18' fill='%23c2410c'/%3E%3C/svg%3E"
      alt="Whole portrait inside a square"
      :ratio="1"
      fit="contain"
    />
    <SImage
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='400'%3E%3Crect width='200' height='400' fill='%23fbbf24'/%3E%3Ccircle cx='100' cy='120' r='58' fill='%23fff7ed'/%3E%3Crect x='36' y='214' width='128' height='150' rx='18' fill='%23c2410c'/%3E%3C/svg%3E"
      alt="Portrait stretched to a square"
      :ratio="1"
      fit="fill"
    />
  </div>

<template #code>

```vue
<template>
  <SImage
    src="/photos/portrait.jpg"
    alt="Portrait cropped to a square"
    :ratio="1"
    fit="cover"
    position="top"
  />
  <SImage
    src="/photos/portrait.jpg"
    alt="Whole portrait inside a square"
    :ratio="1"
    fit="contain"
  />
  <SImage
    src="/photos/portrait.jpg"
    alt="Portrait stretched to a square"
    :ratio="1"
    fit="fill"
  />
</template>
```

  </template>
</Demo>

## Loading placeholder

A skeleton fills the frame until the picture is decoded and disappears on load as well as on
error. Turn it off with `:placeholder="false"`, or put your own content in the `placeholder`
slot — a blurred thumbnail, a dominant colour, a logo. Images below the fold load lazily by
default; pass `:lazy="false"` for the one at the top of the page, so the browser requests it
straight away.

<Demo>
  <div style="width: 420px; max-width: 100%">
    <SImage
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='640' height='360' fill='%230ea5e9'/%3E%3Ccircle cx='320' cy='180' r='96' fill='%23e0f2fe'/%3E%3C/svg%3E"
      alt="Hero picture"
      :ratio="16 / 9"
      :lazy="false"
    >
      <template #placeholder>
        <div style="width: 100%; height: 100%; background: linear-gradient(120deg, var(--s-color-primary-subtle), var(--s-color-bg-muted))"></div>
      </template>
    </SImage>
  </div>

<template #code>

```vue
<template>
  <SImage
    src="/photos/hero.jpg"
    alt="Hero picture"
    :ratio="16 / 9"
    :lazy="false"
  >
    <template #placeholder>
      <div class="hero-blur" />
    </template>
  </SImage>
</template>
```

  </template>
</Demo>

## Error fallback

When `src` fails, `fallback` is requested instead. Without it the frame keeps a muted surface
that carries `alt` as its accessible name, and the `error` slot replaces that surface with your
own message. Both `load` and `error` are also emitted, so the page can react — log the miss, hide
the block, ask for another source.

<Demo>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; width: 100%">
    <SImage
      src="data:image/png;base64,broken"
      alt="Product photo"
      :ratio="4 / 3"
      fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e2e8f0'/%3E%3Ccircle cx='200' cy='150' r='54' fill='%2394a3b8'/%3E%3C/svg%3E"
    />
    <SImage
      src="data:image/png;base64,broken"
      alt="Product photo"
      :ratio="4 / 3"
    >
      <template #error>
        <span style="color: var(--s-color-text-muted); font-size: var(--s-font-size-sm)">Photo unavailable</span>
      </template>
    </SImage>
  </div>

<template #code>

```vue
<script setup lang="ts">
function reportMissingPhoto() {
  // send the miss to your analytics
}
</script>

<template>
  <SImage
    src="/photos/product.jpg"
    alt="Product photo"
    :ratio="4 / 3"
    fallback="/photos/placeholder.svg"
  />
  <SImage
    src="/photos/product.jpg"
    alt="Product photo"
    :ratio="4 / 3"
    @error="reportMissingPhoto"
  >
    <template #error>
      <span class="photo-missing">Photo unavailable</span>
    </template>
  </SImage>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SImage" />
