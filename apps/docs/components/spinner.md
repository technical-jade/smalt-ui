# Spinner

`SSpinner` is a spinning ring: it shows that work of unknown duration is under way. When the
percentage is known, use [SProgress](./progress); when the shape of the future content is known,
use [SSkeleton](./skeleton).

## Accessibility

Without `label` the spinner is decorative (`aria-hidden="true"`): a screen reader does not see it,
so announce the loading some other way, for example with text nearby. With `label` the spinner gets
`role="status"` and an accessible name, and a screen reader reads it as a status message.

Under `prefers-reduced-motion` the ring spins slower but does not stop: a frozen spinner would look
like a hang.

## Sizes and variants

`size` is `sm`, `md` (the default) or `lg`. `variant` sets the color: `primary` (the default) is the
accent, `neutral` is the muted text color and `current` takes the color of the parent's text.

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

A button that waits for a response does not need a hand-placed spinner: [SButton](./button) has a
`loading` prop that draws one, blocks presses and keeps the button width. `SSpinner` in the
`leading` slot is for a custom look of the state; `variant="current"` takes the button's text
color.

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
