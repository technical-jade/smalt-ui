# Spacing

Utility classes for inner (`padding`) and outer (`margin`) spacing. The name follows the pattern
**`.s-{type}{direction}-{size}`**: type is `p` (padding) or `m` (margin); direction is `a` (all
sides), `t`/`r`/`b`/`l` (top/right/bottom/left), `x` (left+right), `y` (top+bottom); size is a
scale key. Values come from the `--s-space-*` tokens, so spacing stays consistent with the rest of
the system. The classes are available wherever `@smalt-ui/core/styles.css` is loaded.

## Size scale

Sizes are keys of the `$spacing` scale (the same `--s-space-*` that components use).

<SpacingShowcase />

| Key | Value     | Key  | Value    |
| --- | --------- | ---- | -------- |
| `0` | `0`       | `6`  | `1.5rem` |
| `1` | `0.25rem` | `8`  | `2rem`   |
| `2` | `0.5rem`  | `10` | `2.5rem` |
| `3` | `0.75rem` | `12` | `3rem`   |
| `4` | `1rem`    | `16` | `4rem`   |
| `5` | `1.25rem` |      |          |

## Padding

<Demo>
  <div style="display: flex; gap: 16px; align-items: flex-start">
    <div class="s-pa-2" style="background: var(--s-color-primary-subtle); border-radius: 4px">
      <div style="background: var(--s-color-primary); color: var(--s-color-primary-contrast); border-radius: 2px; padding: 4px 8px">s-pa-2</div>
    </div>
    <div class="s-pa-4" style="background: var(--s-color-primary-subtle); border-radius: 4px">
      <div style="background: var(--s-color-primary); color: var(--s-color-primary-contrast); border-radius: 2px; padding: 4px 8px">s-pa-4</div>
    </div>
    <div class="s-pa-6" style="background: var(--s-color-primary-subtle); border-radius: 4px">
      <div style="background: var(--s-color-primary); color: var(--s-color-primary-contrast); border-radius: 2px; padding: 4px 8px">s-pa-6</div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div class="s-pa-2">…</div>
  <div class="s-pa-4">…</div>
  <div class="s-pa-6">…</div>
</template>
```

  </template>
</Demo>

Directions work the same for `p` and `m`: for example, `.s-px-4` sets horizontal padding, and
`.s-pt-6` sets top padding only.

<Demo>
  <div style="display: flex; gap: 16px; align-items: flex-start">
    <div class="s-px-6 s-py-2" style="background: var(--s-color-primary-subtle); border-radius: 4px">
      <div style="background: var(--s-color-primary); color: var(--s-color-primary-contrast); border-radius: 2px; padding: 4px 8px">s-px-6 s-py-2</div>
    </div>
    <div class="s-pt-6" style="background: var(--s-color-primary-subtle); border-radius: 4px">
      <div style="background: var(--s-color-primary); color: var(--s-color-primary-contrast); border-radius: 2px; padding: 4px 8px">s-pt-6</div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div class="s-px-6 s-py-2">…</div>
  <div class="s-pt-6">…</div>
</template>
```

  </template>
</Demo>

## Margin

The same directions with the `m` type. There are also horizontal `auto` classes:
`.s-ml-auto`, `.s-mr-auto`, `.s-mx-auto` center a block or push it to one side.

<Demo>
  <div style="width: 100%">
    <div style="background: var(--s-color-bg-muted); border-radius: 4px; padding: 8px">
      <div class="s-mx-auto" style="width: 140px; background: var(--s-color-primary); color: var(--s-color-primary-contrast); border-radius: 2px; padding: 6px; text-align: center">s-mx-auto</div>
    </div>
    <div style="background: var(--s-color-bg-muted); border-radius: 4px; padding: 8px" class="s-mt-4">
      <div class="s-ml-auto" style="width: 140px; background: var(--s-color-primary); color: var(--s-color-primary-contrast); border-radius: 2px; padding: 6px; text-align: center">s-ml-auto</div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div class="s-mx-auto">Centered</div>
  <div class="s-ml-auto">Pushed right</div>
</template>
```

  </template>
</Demo>

## Directions

| Suffix | Sides        | CSS (for `p` / `m`)                           |
| ------ | ------------ | --------------------------------------------- |
| `a`    | all          | `padding` / `margin`                          |
| `t`    | top          | `padding-top` / `margin-top`                  |
| `r`    | right        | `padding-right` / `margin-right`              |
| `b`    | bottom       | `padding-bottom` / `margin-bottom`            |
| `l`    | left         | `padding-left` / `margin-left`                |
| `x`    | left + right | `padding-left` + `padding-right` (and margin) |
| `y`    | top + bottom | `padding-top` + `padding-bottom` (and margin) |

The directions are physical: `l` is always the left side and `r` always the right, `dir="rtl"`
included.

## Responsiveness

Every class has breakpoint variants `.s-{type}{dir}-{bp}-{size}` that apply from the given
breakpoint and up (mobile-first): `xs 0`, `sm 600px`, `md 1024px`, `lg 1440px`, `xl 1920px` (the
same system as the [grid](/style/grid#responsiveness)). For example, `.s-pa-2 .s-pa-md-6` gives
`0.5rem` padding on a narrow screen and `1.5rem` from `1024px`. It works for `auto` too:
`.s-mx-md-auto`. `xs` has no infix: those are the base classes without a breakpoint (`.s-pa-2`,
not `.s-pa-xs-2`).

## Class name

```
.s-{p|m}{a|t|r|b|l|x|y}-{size}             e.g. .s-pa-4, .s-mt-6, .s-px-2
.s-{p|m}{a|t|r|b|l|x|y}-{bp}-{size}        e.g. .s-pa-md-6 (from 1024px)
.s-{ml|mr|mx}-auto  /  -{bp}-auto          e.g. .s-mx-auto, .s-mx-md-auto
```

The full set is every combination of type × direction × size (`0…16`), base and per breakpoint,
plus the `auto` classes.

## Customization

The scale is the `$spacing` SASS map with `!default`: override it before `@use`, and the classes
(as well as the `--s-space-*` tokens and all components) pick up the new values. A single spacing
value can also be changed at runtime by overriding a specific `--s-space-*` variable. The spacing
classes live in the `smalt.utilities` layer, so any app rule without a layer overrides them.
