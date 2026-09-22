# Scroll Area

`SScrollArea` is a region that scrolls its content behind thin overlay scrollbars. Native
scrollbars differ between platforms — wide and always present on Windows, hidden until you scroll
on macOS — and a sidebar or a dialog body that changes width with the operating system is hard to
lay out. The component hides the native bars and draws its own on top of the content, so the area
keeps the same width everywhere and the bar follows the design tokens.

Scrolling itself stays native: the region is focusable, so the arrow keys, Page Up/Page Down,
Home/End, the mouse wheel and touch gestures all work as usual, and screen readers announce the
region as scrollable.

Give the area a height (`height` or `max-height`, or your own layout) — without one it is as tall
as its content and never scrolls.

## Vertical list

<Demo>
  <ClientOnly>
    <SScrollArea :height="200" style="max-width: 320px">
      <div style="padding: 0 12px">
        <div v-for="i in 20" :key="i" style="padding: 8px 0; border-bottom: 1px solid var(--s-color-border)">
          Release 1.{{ i }}.0
        </div>
      </div>
    </SScrollArea>
  </ClientOnly>

<template #code>

```vue
<template>
  <SScrollArea :height="200">
    <div
      v-for="i in 20"
      :key="i"
    >
      Release 1.{{ i }}.0
    </div>
  </SScrollArea>
</template>
```

  </template>
</Demo>

## Horizontal

Set `orientation` to `horizontal` to scroll a row instead. Only the named axis gets a scrollbar,
so the content has to be allowed to overflow on it.

<Demo>
  <ClientOnly>
    <SScrollArea orientation="horizontal" style="max-width: 320px">
      <div style="display: flex; gap: 8px; padding-bottom: 12px">
        <div v-for="i in 12" :key="i" style="flex: 0 0 auto; width: 96px; height: 64px; display: flex; align-items: center; justify-content: center; background: var(--s-color-surface-variant); border-radius: 8px">
          Tile {{ i }}
        </div>
      </div>
    </SScrollArea>
  </ClientOnly>

<template #code>

```vue
<template>
  <SScrollArea orientation="horizontal">
    <div style="display: flex; gap: 8px">
      <div
        v-for="i in 12"
        :key="i"
      >
        Tile {{ i }}
      </div>
    </div>
  </SScrollArea>
</template>
```

  </template>
</Demo>

## Both axes

`orientation="both"` renders both scrollbars and the corner between them — for a table or a
diagram that is larger than its container in every direction.

<Demo>
  <ClientOnly>
    <SScrollArea orientation="both" :height="200" style="max-width: 320px">
      <div style="width: 640px; padding: 0 12px">
        <div v-for="i in 16" :key="i" style="padding: 8px 0; white-space: nowrap; border-bottom: 1px solid var(--s-color-border)">
          Row {{ i }} — a line long enough to run past the right edge of the area
        </div>
      </div>
    </SScrollArea>
  </ClientOnly>

<template #code>

```vue
<template>
  <SScrollArea
    orientation="both"
    :height="200"
  >
    <div style="width: 640px">…</div>
  </SScrollArea>
</template>
```

  </template>
</Demo>

## Visibility and thickness

`type` decides when the scrollbars are on screen: `hover` (the default) shows them while you
scroll or point at the area, `scroll` only while scrolling, `auto` whenever the content overflows,
and `always` at all times. With `hover` and `scroll`, `scroll-hide-delay` sets how long they
linger afterwards. `size` picks the thickness of the bar.

<Demo>
  <ClientOnly>
    <div style="display: flex; gap: 16px; flex-wrap: wrap">
      <SScrollArea type="always" size="sm" :height="160" style="width: 180px">
        <div style="padding: 0 12px">
          <div v-for="i in 20" :key="i" style="padding: 8px 0">Item {{ i }}</div>
        </div>
      </SScrollArea>
      <SScrollArea type="always" size="lg" :height="160" style="width: 180px">
        <div style="padding: 0 12px">
          <div v-for="i in 20" :key="i" style="padding: 8px 0">Item {{ i }}</div>
        </div>
      </SScrollArea>
    </div>
  </ClientOnly>

<template #code>

```vue
<template>
  <SScrollArea
    type="always"
    size="sm"
    :height="160"
  >
    …
  </SScrollArea>

  <SScrollArea
    type="always"
    size="lg"
    :height="160"
  >
    …
  </SScrollArea>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SScrollArea" />
