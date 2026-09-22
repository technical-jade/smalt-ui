# Progress

`SProgress` is a progress indicator built on Reka UI (`role="progressbar"`, correct
`aria-valuenow`/`aria-valuemax`). It supports variants, sizes and an indeterminate mode
(without `value`). `label` names the bar for screen readers; without it the bar is named by its
percentage, or by the `loading` message while indeterminate.
`value` is clamped to `0…max`, so the announced value matches the bar. With
`prefers-reduced-motion` the indeterminate stripe moves slower.

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

Without `value` the bar is animated (for example, while the upload size is still unknown).

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

## API

<ApiTable name="SProgress" />
