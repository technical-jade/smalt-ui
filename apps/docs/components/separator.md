# Separator

`SSeparator` is a visual divider between blocks of content or groups of elements. It is built on
Reka UI: by default it carries the `separator` role (`aria-orientation`), and in decorative mode
it has no role and screen readers skip the line.
A separator with a label (the `label` prop or the slot) is named by it; with `decorative` the
role goes away and the label is read as plain text.

## Horizontal

<Demo>
  <div style="width: 100%">
    <p style="margin: 0 0 12px">Block above</p>
    <SSeparator />
    <p style="margin: 12px 0 0">Block below</p>
  </div>

<template #code>

```vue
<template>
  <SSeparator />
</template>
```

  </template>
</Demo>

## Vertical

A vertical separator stretches to the height of the row of its flex or grid parent — handy between
inline elements. In a vertical separator `aria-orientation="vertical"` is set.

<Demo>
  <div style="display: flex; align-items: center; gap: 12px; height: 24px">
    <span>Profile</span>
    <SSeparator orientation="vertical" />
    <span>Settings</span>
    <SSeparator orientation="vertical" />
    <span>Sign out</span>
  </div>

<template #code>

```vue
<template>
  <div style="display: flex; align-items: center; gap: 12px; height: 24px">
    <span>Profile</span>
    <SSeparator orientation="vertical" />
    <span>Settings</span>
  </div>
</template>
```

  </template>
</Demo>

## With a label

Centered text (the `label` prop or the default slot) — for example, to separate sign-in options. The
label is drawn only on a horizontal separator.

<Demo>
  <div style="width: 100%">
    <SSeparator label="or" />
  </div>

<template #code>

```vue
<template>
  <SSeparator label="or" />

  <!-- or via the slot -->
  <SSeparator>or</SSeparator>
</template>
```

  </template>
</Demo>

## Line style

`line-style` sets the look of the line: `solid` (the default), `dashed` or `dotted`. The
thickness stays at 1px. The style applies to horizontal, vertical and labeled separators.

<Demo>
  <div style="display: grid; gap: 16px; width: 100%">
    <SSeparator line-style="dashed" />
    <SSeparator line-style="dotted" />
    <SSeparator line-style="dashed" label="total" />
    <div style="display: flex; align-items: center; gap: 12px; height: 24px">
      <span>Weight</span>
      <SSeparator orientation="vertical" line-style="dashed" />
      <span>Volume</span>
    </div>
  </div>

<template #code>

```vue
<template>
  <SSeparator line-style="dashed" />
  <SSeparator line-style="dotted" />
  <SSeparator
    line-style="dashed"
    label="total"
  />
  <SSeparator
    orientation="vertical"
    line-style="dashed"
  />
</template>
```

  </template>
</Demo>

## Color

`color` sets the line color from the [palette](/style/palette): a family name (`teal`), a shade
(`teal-10`) or a role (`primary`). By default the line takes the theme border color. The color
works with any `line-style` and orientation; the label stays muted.

<Demo>
  <div style="display: grid; gap: 16px; width: 100%">
    <SSeparator color="primary" />
    <SSeparator color="teal" line-style="dashed" />
    <SSeparator color="indigo" line-style="dotted" />
    <SSeparator color="primary" label="total" />
    <div style="display: flex; align-items: center; gap: 12px; height: 24px">
      <span>Weight</span>
      <SSeparator orientation="vertical" color="teal" />
      <span>Volume</span>
      <SSeparator orientation="vertical" color="teal" line-style="dashed" />
      <span>Parcels</span>
    </div>
  </div>

<template #code>

```vue
<template>
  <SSeparator color="primary" />
  <SSeparator
    color="teal"
    line-style="dashed"
  />
  <SSeparator
    color="indigo"
    line-style="dotted"
  />
  <SSeparator
    color="primary"
    label="total"
  />
  <SSeparator
    orientation="vertical"
    color="teal"
  />
</template>
```

  </template>
</Demo>

## Decorative

`decorative` removes the `separator` role (`role="none"`), and a screen reader skips the line. Use
it when the separator does not divide meaningful sections and only shapes the layout. The label of
a decorative separator is read as ordinary text.

## API

<ApiTable name="SSeparator" />
