<script setup>
import { ref } from 'vue'

const fullscreen = ref(false)

function showFullscreen() {
  fullscreen.value = true
  setTimeout(() => (fullscreen.value = false), 2000)
}
</script>

# Loading Overlay

`SLoadingOverlay` covers a region — a card, a table, a form — or the whole viewport while
something loads, and keeps the pointer from reaching what is underneath. It draws a backdrop, a
spinner and a label; the default slot replaces the spinner and the label with anything else, for
example a circular [SProgress](./progress) with a percentage.

The overlay is positioned, not portaled: it fills the nearest positioned ancestor, so the covered
element needs `position: relative`. Add the `s-loading-overlay-host` class to it instead of
writing that rule yourself. With `fullscreen` the overlay becomes `position: fixed` and covers the
viewport, while still rendering where it stands in the markup — no teleport, so the server output
matches the client. It never locks page scroll: loading is not a modal state, and an overlay that
silently froze the page would be harder to predict than one that leaves scrolling alone.

`open` is a plain prop, not a `v-model`. The component never closes itself — the flag belongs to
the request being waited on.

## Accessibility

The overlay carries `aria-busy="true"`, and the label is a `role="status"` live region, so the
busy state is announced rather than only seen. `hide-label` keeps that text for screen readers
while leaving only the spinner visible.

What the overlay cannot do is stop the keyboard: the controls it covers stay in the tab order
even though nobody can see them. Mark the covered content `inert` yourself — it is one attribute
on the same flag:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <div class="s-loading-overlay-host">
    <div :inert="loading">
      <!-- the content being covered -->
    </div>
    <SLoadingOverlay :open="loading" />
  </div>
</template>
```

The component does not apply `inert` itself. It would have to guess which of its siblings counts
as "the content", and putting `inert` on the shared parent would take the overlay's own live
region out of the accessibility tree together with the content — the busy state would stop being
announced. Keep `inert` on the content wrapper, never on the element that holds the overlay.

## Over a card

The host is the card: `s-loading-overlay-host` gives it the positioning context, and the overlay
fills it edge to edge.

<Demo>
  <SCard class="s-loading-overlay-host" style="max-width: 360px">
    <template #header>Monthly report</template>
    <div inert>
      <div>Revenue — $128,400</div>
      <div>Orders — 312</div>
      <div>Refunds — 4</div>
    </div>
    <SLoadingOverlay open />
  </SCard>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <SCard class="s-loading-overlay-host">
    <template #header>Monthly report</template>
    <div :inert="loading">
      <div>Revenue — $128,400</div>
      <div>Orders — 312</div>
    </div>
    <SLoadingOverlay :open="loading" />
  </SCard>
</template>
```

  </template>
</Demo>

Set `spinner` to `false` to keep only the text, `hide-label` to keep only the spinner, and `size`
to scale both together.

<Demo>
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <div class="s-loading-overlay-host" style="width: 150px; height: 110px; border: 1px solid var(--s-color-border); border-radius: 8px">
      <SLoadingOverlay open size="sm" hide-label />
    </div>
    <div class="s-loading-overlay-host" style="width: 150px; height: 110px; border: 1px solid var(--s-color-border); border-radius: 8px">
      <SLoadingOverlay open label="Saving" />
    </div>
    <div class="s-loading-overlay-host" style="width: 150px; height: 110px; border: 1px solid var(--s-color-border); border-radius: 8px">
      <SLoadingOverlay open size="lg" :spinner="false" label="Almost there" />
    </div>
  </div>

<template #code>

```vue
<template>
  <SLoadingOverlay
    open
    size="sm"
    hide-label
  />
  <SLoadingOverlay
    open
    label="Saving"
  />
  <SLoadingOverlay
    open
    size="lg"
    :spinner="false"
    label="Almost there"
  />
</template>
```

  </template>
</Demo>

Without `label` the text comes from the locale dictionary (`loading` — "Loading"): override it on
one instance with the prop, or everywhere through `ConfigProvider`.

## Determinate progress in the slot

The default slot replaces the spinner and the label. A circular `SProgress` names itself through
`aria-valuetext`, so the percentage is announced as it moves.

<Demo>
  <div class="s-loading-overlay-host" style="width: 100%; height: 160px; border: 1px solid var(--s-color-border); border-radius: 8px">
    <SLoadingOverlay open>
      <SProgress circular show-value :value="68" size="lg" />
    </SLoadingOverlay>
  </div>

<template #code>

```vue
<template>
  <div class="s-loading-overlay-host">
    <SLoadingOverlay :open="uploading">
      <SProgress
        circular
        show-value
        :value="uploaded"
        size="lg"
      />
    </SLoadingOverlay>
  </div>
</template>
```

  </template>
</Demo>

## Fullscreen

`fullscreen` covers the viewport. The overlay below closes itself after two seconds, so the page
never stays covered — a real one closes when the request settles. It does not trap focus and does
not lock scrolling; when the whole page has to be blocked for the keyboard too, set `inert` on the
application root along with the flag.

<Demo>
  <SButton @click="showFullscreen">Block the page for 2s</SButton>
  <SLoadingOverlay :open="fullscreen" fullscreen label="Publishing" />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const publishing = ref(false)

async function publish() {
  publishing.value = true
  try {
    await api.publish()
  } finally {
    publishing.value = false
  }
}
</script>

<template>
  <SButton @click="publish"> Publish </SButton>
  <SLoadingOverlay
    :open="publishing"
    fullscreen
    label="Publishing"
  />
</template>
```

  </template>
</Demo>

## Backdrop

`blur` frosts the covered content with `backdrop-filter` and lowers the dimming to `0.4`, since
blurred text is already unreadable. `opacity` sets the dimming explicitly, from `0` to `1`; it
wins over both defaults. The same value can be set from CSS through the
`--s-loading-overlay-opacity` variable, and the blur radius through `--s-loading-overlay-blur`.

<Demo>
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <div class="s-loading-overlay-host" style="width: 200px; padding: 12px; border: 1px solid var(--s-color-border); border-radius: 8px">
      <div inert>Invoice #4021 — 8 items, paid on 12 May.</div>
      <SLoadingOverlay open blur label="Blurred" />
    </div>
    <div class="s-loading-overlay-host" style="width: 200px; padding: 12px; border: 1px solid var(--s-color-border); border-radius: 8px">
      <div inert>Invoice #4021 — 8 items, paid on 12 May.</div>
      <SLoadingOverlay open :opacity="0.35" label="Dimmed" />
    </div>
  </div>

<template #code>

```vue
<template>
  <SLoadingOverlay
    :open="loading"
    blur
  />
  <SLoadingOverlay
    :open="loading"
    :opacity="0.35"
  />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SLoadingOverlay" />
