# Spinner

`SSpinner` is a loading indicator (a spinning ring). Pure CSS. It is decorative by default
(`aria-hidden`); set `label` to announce the loading state to screen readers
(`role="status"`).

## Sizes and variants

<Demo>
  <div style="display: flex; align-items: center; gap: 20px">
    <SSpinner size="sm" />
    <SSpinner size="md" />
    <SSpinner size="lg" />
    <SSpinner variant="neutral" />
  </div>

<template #code>

```vue
<template>
  <SSpinner size="sm" />
  <SSpinner size="lg" />
  <SSpinner variant="neutral" />
  <SSpinner label="Loading" />
</template>
```

  </template>
</Demo>

## In a button

<Demo>
  <SButton disabled>
    <template #leading><SSpinner size="sm" variant="current" /></template>
    Loading…
  </SButton>

<template #code>

```vue
<template>
  <SButton disabled>
    <template #leading
      ><SSpinner
        size="sm"
        variant="current"
    /></template>
    Loading…
  </SButton>
</template>
```

  </template>
</Demo>

## Color

The `color` prop sets a color from the [palette](/style/palette) and overrides the color of any
`variant`, `neutral` and `current` included.

<Demo>
  <SSpinner color="indigo" />
  <SSpinner color="blue" />
  <SSpinner color="blue-grey" />
  <SSpinner color="deep-purple" />

<template #code>

```vue
<template>
  <SSpinner color="indigo" />
  <SSpinner color="blue-grey" />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SSpinner" />
