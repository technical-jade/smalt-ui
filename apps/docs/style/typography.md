# Typography

A set of global utility classes for text: standard roles (headings, body, captions), weight,
alignment, transformation and truncation. All classes use the `.s-text-*` prefix, are built on
design tokens (`--s-font-size-*`, `--s-font-weight-*`, `--s-line-height-*`) and are available
wherever `@smalt-ui/core/styles.css` is loaded, without wrapping anything in a component.

## Families

The library ships the Inter font. Headings have their own token but use the same font as body
text by default:

| Token              | Font                    | Used for                                                     |
| ------------------ | ----------------------- | ------------------------------------------------------------ |
| `--s-font-sans`    | Inter                   | everything except headings                                   |
| `--s-font-heading` | `var(--s-font-sans)`    | `.s-text-h1…h6` and component titles (dialogs, cards, steps) |
| `--s-font-mono`    | JetBrains Mono + system | monospaced values                                            |

Font files are loaded through a separate entry, `@smalt-ui/core/fonts.css`; how to replace them or
serve them yourself is described in [Theming](/theming#fonts). JetBrains Mono is not bundled: if it
is not installed, the system monospaced font is used.

## Scale

The roles follow the Material typography set (`h1…h6`, `subtitle`, `body`, `caption`,
`overline`), but the values are adapted to Smalt UI tokens. Each class sets `font-size`,
`font-weight`, `line-height` and `letter-spacing` at once.

<TypographyShowcase />

<Demo>
  <div style="display: grid; gap: 8px; width: 100%">
    <div class="s-text-h1">Heading 1</div>
    <div class="s-text-h3">Heading 3</div>
    <div class="s-text-h5">Heading 5</div>
    <div class="s-text-subtitle1">Subtitle 1</div>
    <div class="s-text-body1">Body 1: paragraph body text.</div>
    <div class="s-text-caption">Caption: element caption</div>
    <div class="s-text-overline">Overline</div>
  </div>

<template #code>

```vue
<template>
  <h1 class="s-text-h1">Heading 1</h1>
  <p class="s-text-body1">Body 1: paragraph body text.</p>
  <span class="s-text-caption">Caption: element caption</span>
  <span class="s-text-overline">Overline</span>
</template>
```

  </template>
</Demo>

| Class               | Size     | Weight          | Line height |
| ------------------- | -------- | --------------- | ----------- |
| `.s-text-h1`        | 3.75rem  | 300             | 1.25        |
| `.s-text-h2`        | 3rem     | 300             | 1.25        |
| `.s-text-h3`        | 2.25rem  | 400             | 1.25        |
| `.s-text-h4`        | 1.875rem | 400             | 1.25        |
| `.s-text-h5`        | 1.5rem   | 400             | 1.25        |
| `.s-text-h6`        | 1.25rem  | 500             | 1.25        |
| `.s-text-subtitle1` | 1rem     | 400             | 1.5         |
| `.s-text-subtitle2` | 0.875rem | 500             | 1.5         |
| `.s-text-body1`     | 1rem     | 400             | 1.5         |
| `.s-text-body2`     | 0.875rem | 400             | 1.5         |
| `.s-text-caption`   | 0.75rem  | 400             | 1.5         |
| `.s-text-overline`  | 0.75rem  | 500 (uppercase) | 1.75        |

## Weight

The `.s-text-weight-*` classes change only `font-weight` and combine with any role.

<Demo>
  <div style="display: grid; gap: 4px; width: 100%">
    <span class="s-text-body1 s-text-weight-thin">Thin (100)</span>
    <span class="s-text-body1 s-text-weight-light">Light (300)</span>
    <span class="s-text-body1 s-text-weight-normal">Normal (400)</span>
    <span class="s-text-body1 s-text-weight-medium">Medium (500)</span>
    <span class="s-text-body1 s-text-weight-semibold">Semibold (600)</span>
    <span class="s-text-body1 s-text-weight-bold">Bold (700)</span>
    <span class="s-text-body1 s-text-weight-black">Black (900)</span>
  </div>

<template #code>

```vue
<template>
  <span class="s-text-weight-light">Light</span>
  <span class="s-text-weight-medium">Medium</span>
  <span class="s-text-weight-bold">Bold</span>
</template>
```

  </template>
</Demo>

| Class                     | `font-weight` |
| ------------------------- | ------------- |
| `.s-text-weight-thin`     | 100           |
| `.s-text-weight-light`    | 300           |
| `.s-text-weight-normal`   | 400           |
| `.s-text-weight-medium`   | 500           |
| `.s-text-weight-semibold` | 600           |
| `.s-text-weight-bold`     | 700           |
| `.s-text-weight-black`    | 900           |

## Alignment

<Demo>
  <div style="display: grid; gap: 6px; width: 100%">
    <div class="s-text-body1 s-text-left">Left</div>
    <div class="s-text-body1 s-text-center">Center</div>
    <div class="s-text-body1 s-text-right">Right</div>
    <div class="s-text-body2 s-text-justify">Justified: the line stretches to both edges of the block, with hyphenation (hyphens).</div>
  </div>

<template #code>

```vue
<template>
  <p class="s-text-left">Left</p>
  <p class="s-text-center">Center</p>
  <p class="s-text-right">Right</p>
  <p class="s-text-justify">Justified</p>
</template>
```

  </template>
</Demo>

| Class             | Effect                                  |
| ----------------- | --------------------------------------- |
| `.s-text-left`    | `text-align: left`                      |
| `.s-text-center`  | `text-align: center`                    |
| `.s-text-right`   | `text-align: right`                     |
| `.s-text-justify` | `text-align: justify` + `hyphens: auto` |

## Transformation and decoration

<Demo>
  <div style="display: grid; gap: 4px; width: 100%">
    <span class="s-text-body1 s-text-uppercase">uppercase</span>
    <span class="s-text-body1 s-text-lowercase">LOWERCASE</span>
    <span class="s-text-body1 s-text-capitalize">every word capitalized</span>
    <span class="s-text-body1 s-text-italic">italic</span>
    <span class="s-text-body1 s-text-strike">strikethrough</span>
  </div>

<template #code>

```vue
<template>
  <span class="s-text-uppercase">uppercase</span>
  <span class="s-text-capitalize">every word capitalized</span>
  <span class="s-text-italic">italic</span>
  <span class="s-text-strike">strikethrough</span>
</template>
```

  </template>
</Demo>

| Class                | Effect                          |
| -------------------- | ------------------------------- |
| `.s-text-uppercase`  | `text-transform: uppercase`     |
| `.s-text-lowercase`  | `text-transform: lowercase`     |
| `.s-text-capitalize` | `text-transform: capitalize`    |
| `.s-text-italic`     | `font-style: italic`            |
| `.s-text-no-wrap`    | `white-space: nowrap`           |
| `.s-text-strike`     | `text-decoration: line-through` |

## Truncation

`.s-text-truncate` cuts a single line with an ellipsis; `.s-text-truncate-2` / `-3` cut at 2 and 3
lines respectively.

<Demo>
  <div style="display: grid; gap: 10px; width: 100%; max-width: 280px">
    <div class="s-text-body2 s-text-truncate">A single line that will not fit into a narrow container and gets cut with an ellipsis.</div>
    <div class="s-text-body2 s-text-truncate-2">Two lines: long text wraps, and whatever does not fit into the two allotted lines is hidden behind an ellipsis at the end.</div>
  </div>

<template #code>

```vue
<template>
  <div class="s-text-truncate">A single line…</div>
  <div class="s-text-truncate-2">Two lines at most…</div>
</template>
```

  </template>
</Demo>

| Class                | Effect                             |
| -------------------- | ---------------------------------- |
| `.s-text-truncate`   | single-line ellipsis truncation    |
| `.s-text-truncate-2` | truncation to 2 lines (line-clamp) |
| `.s-text-truncate-3` | truncation to 3 lines (line-clamp) |

## Customization

Scale values are build-time SASS maps with `!default`, which can be overridden before `@use`:

- `$typography`: roles (`h1…overline`), as `(size, weight, leading, tracking)` objects;
- `$font-size`: font sizes (`xs…6xl`), `$font-weight`: weights (`thin…black`), `$line-height`:
  leading (`tight`, `normal`, `relaxed`);
- `$font-sans` / `$font-heading` / `$font-mono`: families.

The size, weight and leading of the roles refer to the `--s-font-size-*`, `--s-font-weight-*` and
`--s-line-height-*` CSS variables, so individual scale values can also be changed at runtime by
overriding the relevant variable. Tracking (`letter-spacing`) is built into the classes and changes
only through `$typography`.
