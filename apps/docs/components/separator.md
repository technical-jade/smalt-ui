# Separator

`SSeparator` is a visual divider between blocks of content or groups of elements. It is built on
Reka UI: by default it carries the `separator` role (`aria-orientation`), and in decorative mode
it is hidden from screen readers.
A separator with a label (the `label` prop or the slot) is named by it; `decorative` hides a
labeled separator too.

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

Stretches to the height of the container — handy between inline elements.

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

Centered text (the `label` prop or the default slot) — for example, to separate sign-in options.

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

## API

<ApiTable name="SSeparator" />
