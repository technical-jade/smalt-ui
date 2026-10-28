# Grid

A 12-column flexbox grid with responsive breakpoints. The `.s-row` (or `.s-column`) container sets
the flex context, and child `.s-col-*` elements take fractions of the width. Everything is built on
`.s-`-prefixed utility classes and is available wherever `@smalt-ui/core/styles.css` is loaded.

<GridShowcase />

## Container

`.s-container` centers the page content and keeps it within a readable width: the maximum grows
with the breakpoints, and padding stays on the sides. Without it the grid stretches across the whole
window.

```vue
<template>
  <div class="s-container">
    <div class="s-row s-col-gutter-4">…</div>
  </div>
</template>
```

The maximum width and side padding are overridden with variables, no need to know about the SASS
map. Set them on the `.s-container` element itself, not on an ancestor: the breakpoint steps are
written on the container and would override an inherited value.

```css
.page.s-container {
  --s-container-max-width: 1200px;
  --s-container-padding-x: var(--s-space-6);
}
```

By default the maximum equals the threshold of the current breakpoint: `600px` from `sm`, `1024px`
from `md`, `1440px` from `lg`, `1920px` from `xl`; on `xs` it is the full width. The side padding is
`--s-space-4`.

The `.s-container--fluid` modifier removes the maximum on every breakpoint and keeps the side
padding.

<Demo>
  <div style="width: 100%; display: grid; gap: 12px">
    <div style="background: var(--s-color-bg-muted); border-radius: 4px">
      <div class="s-container" style="--s-container-max-width: 420px">
        <div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px; text-align: center">
          .s-container: centered, limited width
        </div>
      </div>
    </div>
    <div style="background: var(--s-color-bg-muted); border-radius: 4px">
      <div class="s-container s-container--fluid">
        <div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px; text-align: center">
          .s-container--fluid: full width, side padding stays
        </div>
      </div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div class="s-container">
    <div class="s-row s-col-gutter-4">…</div>
  </div>
  <div class="s-container s-container--fluid">…</div>
</template>
```

  </template>
</Demo>

## Columns

Inside `.s-row`, the `.s-col-{N}` class (N = 1…12) sets a width of `N/12`, inside `.s-column` it
sets a height of `N/12` (the container must have a height). Columns wrap on overflow (the container
has `flex-wrap: wrap`).

::: warning Direct children only
The width is set by the `.s-row > .s-col-{N}` selector: percentages must be relative to the row,
otherwise nested layouts break the arithmetic. A wrapper between `.s-row` and a column resets the
width, and the element spans the whole row: if you need a wrapper, put the column class on it.
:::

<Demo>
  <div style="width: 100%; display: grid; gap: 8px">
    <div class="s-row">
      <div class="s-col-6"><div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px; text-align: center">s-col-6</div></div>
      <div class="s-col-6"><div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px; text-align: center">s-col-6</div></div>
    </div>
    <div class="s-row">
      <div class="s-col-4"><div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px; text-align: center">s-col-4</div></div>
      <div class="s-col-8"><div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px; text-align: center">s-col-8</div></div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div class="s-row">
    <div class="s-col-6">…</div>
    <div class="s-col-6">…</div>
  </div>
  <div class="s-row">
    <div class="s-col-4">…</div>
    <div class="s-col-8">…</div>
  </div>
</template>
```

  </template>
</Demo>

Special columns without a number: `.s-col` takes all the remaining space (split evenly between
several `.s-col`); `.s-col-auto` sizes to content; `.s-col-grow` / `.s-col-shrink` only grow / only
shrink. All of them have breakpoint variants, so the combination `s-col-12 s-col-md-auto` ("full
row on mobile, sized to content on desktop") works as expected.

<Demo>
  <div style="width: 100%">
    <div class="s-row s-col-gutter-2">
      <div class="s-col-12 s-col-md">
        <div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px">The input takes the rest</div>
      </div>
      <div class="s-col-12 s-col-md-auto">
        <div style="background: var(--s-color-bg-muted); border: 1px solid var(--s-color-border); border-radius: 4px; padding: 8px; text-align: center">s-col-12 s-col-md-auto</div>
      </div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div class="s-row s-col-gutter-2">
    <div class="s-col-12 s-col-md">…</div>
    <div class="s-col-12 s-col-md-auto">Button sized to content</div>
  </div>
</template>
```

  </template>
</Demo>

## Responsiveness

Breakpoint variants `.s-col-{bp}-{N}` apply from the given breakpoint and up (mobile-first). The
example below shows one per row on a narrow screen, two on `sm`, four on `md`: **resize the
window** to see it switch.

<Demo>
  <div style="width: 100%">
    <div class="s-row">
      <div class="s-col-12 s-col-sm-6 s-col-md-3" v-for="n in 4" :key="n"><div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px; text-align: center; margin: 2px">#{{ n }}</div></div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div class="s-row">
    <div class="s-col-12 s-col-sm-6 s-col-md-3">#1</div>
    <div class="s-col-12 s-col-sm-6 s-col-md-3">#2</div>
    <div class="s-col-12 s-col-sm-6 s-col-md-3">#3</div>
    <div class="s-col-12 s-col-sm-6 s-col-md-3">#4</div>
  </div>
</template>
```

  </template>
</Demo>

| Breakpoint | min-width | Class infix     |
| ---------- | --------- | --------------- |
| `xs`       | 0         | base (no infix) |
| `sm`       | 600px     | `.s-col-sm-*`   |
| `md`       | 1024px    | `.s-col-md-*`   |
| `lg`       | 1440px    | `.s-col-lg-*`   |
| `xl`       | 1920px    | `.s-col-xl-*`   |

## Offsets

`.s-offset-{N}` shifts a column right by `N/12` (via `margin-left`); responsive
`.s-offset-{bp}-{N}` variants exist too.

<Demo>
  <div style="width: 100%">
    <div class="s-row">
      <div class="s-col-4"><div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px; text-align: center">s-col-4</div></div>
      <div class="s-col-4 s-offset-4"><div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px; text-align: center">s-col-4 s-offset-4</div></div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div class="s-row">
    <div class="s-col-4">…</div>
    <div class="s-col-4 s-offset-4">…</div>
  </div>
</template>
```

  </template>
</Demo>

## Gutters

Spacing between cells. `.s-gutter-{k}` is for regular children (spacing via `margin`);
`.s-col-gutter-{k}` is for columns with `.s-col-*` (spacing via `padding`, so the widths still add
up to 100%). Directional variants: `.s-gutter-x/y-{k}`, `.s-col-gutter-x/y-{k}`. The size `{k}` is
a key of the [spacing scale](/style/spacing) (`0…16`).

::: warning These are two different mechanisms, not synonyms
`.s-gutter-{k}` spaces children with margins. On columns with percentage widths the sum of widths
and margins exceeds 100%, and the last column wraps to a new line. Inside an `.s-row` with numbered
columns use only `.s-col-gutter-{k}`.
:::

::: warning Caveat
An element with a gutter class has negative `margin`, so do not give it a background, a border
or its own `margin`. Wrap it in an outer container (as in the example below).
:::

::: warning The gap is part of the column size
`.s-col-gutter-{k}` gives columns `padding`, so a height or `min-height` set on a column covers the
content together with that padding, and the content shifts down by the gap. Set sizes and
alignment on an element nested in the column, not on the column itself.
:::

<Demo>
  <div style="width: 100%">
    <div class="s-row s-col-gutter-4">
      <div class="s-col-6"><div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px; text-align: center">s-col-6</div></div>
      <div class="s-col-6"><div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px; text-align: center">s-col-6</div></div>
      <div class="s-col-6"><div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px; text-align: center">s-col-6</div></div>
      <div class="s-col-6"><div style="background: var(--s-color-primary-subtle); border: 1px solid var(--s-color-primary); color: var(--s-color-primary); border-radius: 4px; padding: 8px; text-align: center">s-col-6</div></div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div class="s-row s-col-gutter-4">
    <div class="s-col-6">…</div>
    <div class="s-col-6">…</div>
    <div class="s-col-6">…</div>
    <div class="s-col-6">…</div>
  </div>
</template>
```

  </template>
</Demo>

## Visibility

The classes hide an element from the given breakpoint and up (`-up`) or on screens narrower than
it (`-down`); `.s-hidden` always hides. There is deliberately no "show" class: there is no way to
restore `display`, because `display: revert` rolls the element back to the browser value and erases
its own (for `SButton` that is `inline-flex`, and icon centering breaks). So "wide screens only" is
`.s-hidden-md-down`, not a "hide/show" pair.

| Class                                     | Hides                             |
| ----------------------------------------- | --------------------------------- |
| `.s-hidden`                               | always                            |
| `.s-hidden-sm-up` … `.s-hidden-xl-up`     | from the breakpoint and up        |
| `.s-hidden-sm-down` … `.s-hidden-xl-down` | below the breakpoint              |
| `.s-sr-only`                              | visually, not from screen readers |

The example below is a typical case: a labeled button on mobile, a single icon on desktop.
**Resize the window** to see it switch.

<Demo>
  <SButton class="s-hidden-md-up" icon="trash-2" variant="outline">Remove seat</SButton>
  <SButton class="s-hidden-md-down" icon="trash-2" variant="outline" aria-label="Remove seat" />
  <span class="s-hidden-sm-down" style="color: var(--s-color-text-muted)">
    And this text is hidden on screens narrower than 600px
  </span>

<template #code>

```vue
<template>
  <!-- a labeled button on mobile, a single icon on desktop -->
  <SButton
    class="s-hidden-md-up"
    icon="trash-2"
  >
    Remove seat
  </SButton>
  <SButton
    class="s-hidden-md-down"
    icon="trash-2"
    aria-label="Remove seat"
  />
</template>
```

  </template>
</Demo>

`.s-sr-only` removes an element from the screen but keeps it in the DOM and the accessibility tree:
focus, keyboard and screen reader output keep working. This is how a native control is hidden under
custom markup, see [the selectable card](/components/card).

## Alignment (flex helpers)

The `justify`/`items`/`content`/`self` classes control the flex layout; they are responsive too
(`.s-justify-{bp}-*` and so on). `.s-flex-center` centers on both axes.

<Demo>
  <div style="width: 100%; display: grid; gap: 8px">
    <div class="s-row s-justify-between" style="background: var(--s-color-bg-muted); border-radius: 4px; padding: 6px">
      <div style="background: var(--s-color-primary); color: var(--s-color-primary-contrast); border-radius: 4px; padding: 6px 12px">A</div>
      <div style="background: var(--s-color-primary); color: var(--s-color-primary-contrast); border-radius: 4px; padding: 6px 12px">B</div>
      <div style="background: var(--s-color-primary); color: var(--s-color-primary-contrast); border-radius: 4px; padding: 6px 12px">C</div>
    </div>
    <div class="s-row s-justify-center" style="background: var(--s-color-bg-muted); border-radius: 4px; padding: 6px">
      <div style="background: var(--s-color-primary); color: var(--s-color-primary-contrast); border-radius: 4px; padding: 6px 12px">Centered</div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div class="s-row s-justify-between">…</div>
  <div class="s-row s-justify-center">…</div>
</template>
```

  </template>
</Demo>

| Group             | Classes                                                       |
| ----------------- | ------------------------------------------------------------- |
| `justify-content` | `.s-justify-start/-end/-center/-between/-around/-evenly`      |
| `align-items`     | `.s-items-start/-end/-center/-baseline/-stretch`              |
| `align-content`   | `.s-content-start/-end/-center/-between/-around/-stretch`     |
| `align-self`      | `.s-self-start/-end/-center/-baseline/-stretch`               |
| order             | `.s-order-first/-last/-none`                                  |
| other             | `.s-flex-center`, `.s-fit`, `.s-full-width`, `.s-full-height` |

## Flex containers

`.s-row` is a horizontal flex container, `.s-column` a vertical one. Modifiers: `.s-inline`
(→ `inline-flex`), `.s-reverse` (reverse order), `.s-wrap` / `.s-no-wrap` / `.s-reverse-wrap`.
Everything is responsive: `.s-row-{bp}`, `.s-column-{bp}`, `.s-wrap-{bp}` and so on.

## Column widths

| N   | Width    | N   | Width    |
| --- | -------- | --- | -------- |
| 1   | 8.3333%  | 7   | 58.3333% |
| 2   | 16.6667% | 8   | 66.6667% |
| 3   | 25%      | 9   | 75%      |
| 4   | 33.3333% | 10  | 83.3333% |
| 5   | 41.6667% | 11  | 91.6667% |
| 6   | 50%      | 12  | 100%     |

## Custom media queries at the same breakpoints

The SCSS sources are published under the `@smalt-ui/core/scss/*` subpath, so the app has both the
`$breakpoints` map and the `respond-to` mixin and does not need to duplicate the breakpoint
numbers:

```scss
@use '@smalt-ui/core/scss/tools' as tools;

.sidebar {
  padding: var(--s-space-2);

  @include tools.respond-to(md) {
    padding: var(--s-space-4);
  }
}
```

The breakpoints are also exposed as CSS variables (`--s-breakpoint-md` and so on) for reading from
JS via `matchMedia`. They are useless inside `@media` itself: a media query cannot read CSS
variables.

## Customization

Breakpoints are the `$breakpoints` SASS map (`!default`); the number of columns is `$grid-columns`.
Breakpoint values are set at build time (media queries cannot read CSS variables), so they can only
be changed by overriding the map before `@use`. Gutter values come from `--s-space-*`, which can
also be changed at runtime.
