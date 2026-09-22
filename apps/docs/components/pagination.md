# Pagination

`SPagination` is page navigation for large lists. It is built on Reka UI
(page calculation from `total`/`itemsPerPage`, sibling pages, ellipsis,
keyboard control). The buttons are reused `SButton`s, the arrows are `SIcon`s.
The current page is bound with `v-model:page`.
The component is a `nav` landmark named from the locale dictionary (`pagination` key) or by
`aria-label`. When `total` shrinks, a page past the new end is moved to the last one.

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

`show-edges` always shows the first and last pages with an ellipsis between the
blocks — useful for long lists.

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
registry name or a raw SVG path. Here the chevrons are replaced with arrows.

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

`sibling-count` sets how many pages to show to the left and right of the current one.
A larger value shows more page numbers around the active page.

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

## API

<ApiTable name="SPagination" />
