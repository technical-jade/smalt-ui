# Pagination

`SPagination` is page navigation for a long list. The number of pages is computed from `total`
(the number of items) and `items-per-page` (10 by default), and the current page (counted from 1)
is bound with `v-model:page`. A long row of numbers is shortened with an ellipsis. On the first
page the "previous" button is disabled, on the last one "next". It is built on Reka UI; the
buttons are reused `SButton`s and the arrows are `SIcon`s.

When `total` shrinks (after filtering, say) and the current page falls past the end of the list,
it moves to the last page and `update:page` is emitted. With a `total` of zero one page is shown.

## Basic usage

<ClientOnly>
<Demo>
  <SPagination :total="97" :items-per-page="10" :page="1" />

<template #code>

```vue
<template>
  <SPagination
    v-model:page="page"
    :total="97"
    :items-per-page="10"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Edge pages

`show-edges` always shows the first and the last page, with an ellipsis between them and the
numbers around the current one. From any place in a long list one click returns to the start or
jumps to the end.

<ClientOnly>
<Demo>
  <SPagination :total="300" :items-per-page="10" :page="8" show-edges />

<template #code>

```vue
<template>
  <SPagination
    v-model:page="page"
    :total="300"
    :items-per-page="10"
    show-edges
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Custom arrows

`prev-icon` and `next-icon` replace the icons of the "previous"/"next" buttons — they take a
registry name or a raw SVG path (`chevron-left` and `chevron-right` by default). Here the chevrons
are replaced with arrows.

<ClientOnly>
<Demo>
  <SPagination
    :total="97"
    :items-per-page="10"
    :page="3"
    prev-icon="m12 19-7-7 7-7M19 12H5"
    next-icon="M5 12h14m-7-7 7 7-7 7"
  />

<template #code>

```vue
<template>
  <SPagination
    v-model:page="page"
    :total="97"
    :items-per-page="10"
    prev-icon="m12 19-7-7 7-7M19 12H5"
    next-icon="M5 12h14m-7-7 7 7-7 7"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Sibling pages

`sibling-count` sets how many numbers to show to the left and right of the current page (1 by
default). A larger value shows more page numbers around the active page.

<ClientOnly>
<Demo>
  <SPagination :total="300" :items-per-page="10" :page="15" :sibling-count="2" show-edges />

<template #code>

```vue
<template>
  <SPagination
    v-model:page="page"
    :total="300"
    :items-per-page="10"
    :sibling-count="2"
    show-edges
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Disabled

`disabled` blocks the pagination and all its buttons.

<ClientOnly>
<Demo>
  <SPagination :total="97" :items-per-page="10" :page="3" disabled />

<template #code>

```vue
<template>
  <SPagination
    v-model:page="page"
    :total="97"
    :items-per-page="10"
    disabled
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Accessibility

The root is a `<nav>`. Its accessible name comes from the locale dictionary ("Pagination") and the
`aria-label` prop replaces it. Page buttons are announced as "Page 5" and the current one gets
`aria-current="page"`. The arrow buttons are named "Previous page" and "Next page"; change them
individually with the `prev-page-label` and `next-page-label` props. All buttons are ordinary
<kbd>Tab</kbd> stops, and <kbd>Enter</kbd> or <kbd>Space</kbd> picks a page.

## API

<ApiTable name="SPagination" />
