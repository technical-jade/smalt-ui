# Back to Top

`SBackTop` is a floating button that shows up once the page has been scrolled and takes the
visitor back to the top. By default it watches the window; point `target` at a CSS selector to
follow a scrollable container instead.

The control is a real `<button>`, so it is reachable with the keyboard and announced as a button.
Its accessible name comes from the locale dictionary (`backToTop` — "Back to top"): set `label` to
override it on one instance, or replace the dictionary entry through `ConfigProvider` to change it
everywhere. Scrolling is animated unless the visitor has asked the system for reduced motion, in
which case the jump is instant.

The button is `position: fixed`. Every example below follows its own scrollable box and sits in a
wrapper with a `transform`, which makes that wrapper the containing block — otherwise the button
would float over the documentation instead of staying inside the example.

## Following a container

<Demo>
  <div style="position: relative; transform: translateZ(0); width: 100%">
    <div id="back-top-basic" style="height: 220px; overflow-y: auto; padding: 16px; border: 1px solid var(--s-color-border); border-radius: 8px">
      <div style="height: 900px">Scroll down inside this box — the button appears after 200px.</div>
    </div>
    <SBackTop target="#back-top-basic" />
  </div>

<template #code>

```vue
<template>
  <div id="page-body">…</div>
  <SBackTop target="#page-body" />
</template>
```

  </template>
</Demo>

Without `target` the component listens to the window, which is what a long article page needs:

```vue
<template>
  <SBackTop />
</template>
```

## Threshold and placement

`visibilityHeight` is the scroll distance in pixels after which the button appears. The offsets
from the corner are CSS custom properties — `--s-back-top-right` and `--s-back-top-bottom`, both
`1.5rem` by default — so the button can be moved without overriding any rule. The button itself
takes the `size`, `variant`, `color` and `round` props straight to [SButton](./button).

<Demo>
  <div style="position: relative; transform: translateZ(0); width: 100%">
    <div id="back-top-threshold" style="height: 220px; overflow-y: auto; padding: 16px; border: 1px solid var(--s-color-border); border-radius: 8px">
      <div style="height: 900px">The button appears after 50px and sits closer to the corner.</div>
    </div>
    <SBackTop target="#back-top-threshold" :visibility-height="50" size="sm" variant="secondary" :round="false" style="--s-back-top-right: 12px; --s-back-top-bottom: 12px" />
  </div>

<template #code>

```vue
<template>
  <SBackTop
    target="#page-body"
    :visibility-height="50"
    size="sm"
    variant="secondary"
    :round="false"
    style="--s-back-top-right: 12px; --s-back-top-bottom: 12px"
  />
</template>
```

  </template>
</Demo>

## Custom control

The default slot replaces the button and receives `visible` and `scrollToTop`, so any control can
drive the same behavior. It is still hidden and revealed by the component, and it still has to be
focusable and carry an accessible name of its own.

<Demo>
  <div style="position: relative; transform: translateZ(0); width: 100%">
    <div id="back-top-slot" style="height: 220px; overflow-y: auto; padding: 16px; border: 1px solid var(--s-color-border); border-radius: 8px">
      <div style="height: 900px">Scroll down for a labelled button.</div>
    </div>
    <SBackTop target="#back-top-slot" :visibility-height="50">
      <template #default="{ scrollToTop }">
        <SButton variant="secondary" icon="chevron-up" @click="scrollToTop">Back to top</SButton>
      </template>
    </SBackTop>
  </div>

<template #code>

```vue
<template>
  <SBackTop
    target="#page-body"
    :visibility-height="50"
  >
    <template #default="{ scrollToTop }">
      <SButton
        variant="secondary"
        icon="chevron-up"
        @click="scrollToTop"
      >
        Back to top
      </SButton>
    </template>
  </SBackTop>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SBackTop" />
