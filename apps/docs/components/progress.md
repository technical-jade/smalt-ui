# Progress

`SProgress` shows how far an operation has got: a file upload, the steps of a wizard, a quota. It is
a bar or a ring, with a known value or without one (indeterminate mode).

## Accessibility

The component is an element with `role="progressbar"`, `aria-valuenow` and `aria-valuemax`.
`label` sets the accessible name; without it the bar is named by its percentage ("60%"), and in
the indeterminate mode by the "Loading" message from the locale dictionary. When a visible caption
sits nearby, repeat it in `label` so a screen reader names the bar the way the user sees it.

`value` is clamped to `0…max`, so the announced value always matches the drawing. A `max` that is
not a positive number is replaced with 100.

## Value and variants

<Demo>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 100%">
    <SProgress :value="30" label="Primary" />
    <SProgress :value="60" variant="positive" label="Success" />
    <SProgress :value="80" variant="warning" label="Warning" />
    <SProgress :value="45" variant="negative" label="Danger" />
  </div>

<template #code>

```vue
<template>
  <SProgress
    :value="60"
    variant="positive"
    label="Uploading"
  />
</template>
```

  </template>
</Demo>

## Sizes

`size` is `sm`, `md` (the default) or `lg` and sets the thickness of the bar.

<Demo>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 100%">
    <SProgress :value="50" size="sm" label="sm" />
    <SProgress :value="50" size="md" label="md" />
    <SProgress :value="50" size="lg" label="lg" />
  </div>

<template #code>

```vue
<template>
  <SProgress
    :value="50"
    size="sm"
  />
  <SProgress
    :value="50"
    size="lg"
  />
</template>
```

  </template>
</Demo>

## Indeterminate progress

Without `value` (or with `:value="null"`) the stripe runs along the track, which shows work of
unknown size. Under `prefers-reduced-motion` the animation is slowed down rather than switched
off, so the bar still reads as work in progress.

<Demo>
  <SProgress label="Uploading" style="width: 100%" />

<template #code>

```vue
<template>
  <SProgress label="Uploading" />
</template>
```

  </template>
</Demo>

## Custom maximum

The `max` prop sets the value that corresponds to 100% of the bar. Here `120` out of `200` is
60% filled.

<Demo>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 100%">
    <SProgress :value="120" :max="200" label="120 of 200" />
    <SProgress :value="6" :max="8" variant="positive" label="Step 6 of 8" />
  </div>

<template #code>

```vue
<template>
  <SProgress
    :value="120"
    :max="200"
    label="120 of 200"
  />
</template>
```

  </template>
</Demo>

## Color

The `color` prop sets the fill color from the [palette](/style/palette) and overrides the variant
color.

<Demo>
  <div style="display: grid; gap: 12px; width: 100%; max-width: 320px">
    <SProgress :value="65" color="indigo" />
    <SProgress :value="45" color="blue" />
    <SProgress :value="80" color="blue-grey" />
  </div>

<template #code>

```vue
<template>
  <SProgress
    :value="65"
    color="indigo"
  />
</template>
```

  </template>
</Demo>

## Circular form

The `circular` prop draws a ring instead of a bar. It is the same component: `value`, `max`,
`size`, `variant`, `color` and the indeterminate mode work exactly as they do for the bar, and so
do the ARIA attributes (`role="progressbar"`, `aria-valuenow`/`aria-valuemax`, the name from
`label` or the percentage). `size` sets the ring diameter (32/48/64&nbsp;px) and the stroke width;
`thickness` overrides that width in pixels.

<Demo>
  <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap">
    <SProgress circular :value="25" size="sm" label="Small" />
    <SProgress circular :value="60" label="Medium" />
    <SProgress circular :value="80" size="lg" variant="positive" label="Large" />
    <SProgress circular :value="45" :thickness="10" color="indigo" label="Thick" />
  </div>

<template #code>

```vue
<template>
  <SProgress
    circular
    :value="60"
  />
  <SProgress
    circular
    :value="45"
    :thickness="10"
    color="indigo"
  />
</template>
```

  </template>
</Demo>

## Value in the middle

`show-value` prints the rounded percentage inside the ring. A bar has no center, so the slot and
`show-value` do not apply to it. For anything else — a fraction, an
icon, a caption — use the default slot: it receives `{ value, percentage }` and replaces
`show-value` when filled. The middle of a ring stays empty by default.

<Demo>
  <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap">
    <SProgress circular show-value :value="72" size="lg" />
    <SProgress circular :value="3" :max="5" size="lg" variant="positive" label="Step 3 of 5">
      <template #default="{ value }">{{ value }}/5</template>
    </SProgress>
  </div>

<template #code>

```vue
<template>
  <SProgress
    circular
    show-value
    :value="72"
    size="lg"
  />

  <SProgress
    circular
    :value="3"
    :max="5"
    size="lg"
    label="Step 3 of 5"
  >
    <template #default="{ value }">{{ value }}/5</template>
  </SProgress>
</template>
```

  </template>
</Demo>

## Indeterminate ring

Without `value` the ring shows a spinning arc and is named by the `loading` message, just like the
bar. `show-value` prints nothing in this mode. With `prefers-reduced-motion` it spins slower instead
of stopping, so it still reads as work in progress.

<Demo>
  <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap">
    <SProgress circular label="Loading" />
    <SProgress circular size="lg" variant="warning" label="Loading" />
  </div>

<template #code>

```vue
<template>
  <SProgress
    circular
    label="Loading"
  />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SProgress" />
