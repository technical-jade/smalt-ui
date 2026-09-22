# Empty State

`SEmptyState` is the placeholder shown where content would be: an empty table, a search with no
matches, a list before the first record. It centers a media block, a title, a description and
action buttons. Without a `title` the text comes from the locale dictionary (`noData`), so an
untranslated placeholder never shows up.

The block is static content, not a live region: it carries no `role="status"` and is not announced
on its own. The icon and the image are decorative — the meaning is carried by the title.

## Basic usage

<Demo>
  <SEmptyState icon="folder" title="No invoices yet" description="New invoices will appear here as soon as the first order is paid." />

<template #code>

```vue
<template>
  <SEmptyState
    icon="folder"
    title="No invoices yet"
    description="New invoices will appear here as soon as the first order is paid."
  />
</template>
```

  </template>
</Demo>

## Actions

The `actions` slot holds the buttons that resolve the empty state. The default slot adds anything
extra under the description.

<Demo>
  <SEmptyState icon="search" title="Nothing found" description="No orders match the current filters.">
    <template #actions>
      <SButton variant="outline">Reset filters</SButton>
      <SButton>New order</SButton>
    </template>
  </SEmptyState>

<template #code>

```vue
<template>
  <SEmptyState
    icon="search"
    title="Nothing found"
    description="No orders match the current filters."
  >
    <template #actions>
      <SButton variant="outline"> Reset filters </SButton>
      <SButton> New order </SButton>
    </template>
  </SEmptyState>
</template>
```

  </template>
</Demo>

## Sizes and accent

`size` scales the icon, the spacing and the type scale. `color` accents the media block with a name
from the [palette](/style/palette).

<Demo>
  <div style="display: flex; flex-direction: column; gap: 8px; width: 100%">
    <SEmptyState size="sm" icon="bell" title="No notifications" />
    <SEmptyState size="lg" icon="package" color="teal" title="The warehouse is empty" description="Receive a shipment to start tracking stock." />
  </div>

<template #code>

```vue
<template>
  <SEmptyState
    size="sm"
    icon="bell"
    title="No notifications"
  />
  <SEmptyState
    size="lg"
    icon="package"
    color="teal"
    title="The warehouse is empty"
    description="Receive a shipment to start tracking stock."
  />
</template>
```

  </template>
</Demo>

## Illustration

`image` replaces the icon with a picture; the `icon` slot replaces both with any markup.

<Demo>
  <SEmptyState title="Inbox zero" description="Every message has been handled.">
    <template #icon>
      <SIcon icon="mail" :size="40" color="positive" />
    </template>
  </SEmptyState>

<template #code>

```vue
<template>
  <SEmptyState
    image="/illustrations/inbox.svg"
    title="Inbox zero"
    description="Every message has been handled."
  />

  <SEmptyState
    title="Inbox zero"
    description="Every message has been handled."
  >
    <template #icon>
      <SIcon
        icon="mail"
        :size="40"
        color="positive"
      />
    </template>
  </SEmptyState>
</template>
```

  </template>
</Demo>

## Inside other components

The `empty` slot of [`SAutocomplete`](./autocomplete) takes arbitrary markup, so the same
placeholder can stand in for the bare line of text. Use the `sm` size there: the block has to fit
inside the suggestion panel.

```vue
<template>
  <SAutocomplete
    v-model="city"
    v-model:search="query"
    :options="options"
    label="City"
  >
    <template #empty>
      <SEmptyState
        size="sm"
        icon="search"
        title="Nothing found"
      />
    </template>
  </SAutocomplete>
</template>
```

## API

<ApiTable name="SEmptyState" />
