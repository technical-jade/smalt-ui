# List

`SList` is a presentational list of rows: settings, files, contacts, search results. Rows are
`SListItem` — a title, an optional second line, and free slots at both ends for an icon, an avatar
or a trailing action. The list keeps no state of its own: it frames the rows and sets their
density.

It is neither a menu nor a picker. [`SDropdownMenu`](./dropdown-menu) is a menu of commands that
opens from a trigger and closes on choice. [`SListbox`](./listbox) is a selection control: it owns a
value, a `v-model` and keyboard navigation. `SList` does none of that — a row is interactive only
when you make it a link (`href`) or an action (`clickable`).

Markup is `div role="list"` with `div role="listitem"` rows rather than `ul`/`li`: library markup
stays neutral, so host styles cannot reach into it through tag selectors. A link or an action row
keeps its own `link`/`button` role and is nested inside the `listitem` wrapper, so assistive
technology announces both the position in the list and the control.

## Basic usage

Plain rows with a title and a description. `label` gives the list an accessible name.

<Demo>
  <SList label="Notifications">
    <SListItem title="Storage almost full" description="94% of 50 GB used" />
    <SListItem title="New device signed in" description="Chrome on macOS" />
    <SListItem title="Backup finished" description="2 minutes ago" />
  </SList>

<template #code>

```vue
<template>
  <SList label="Notifications">
    <SListItem
      title="Storage almost full"
      description="94% of 50 GB used"
    />
    <SListItem
      title="New device signed in"
      description="Chrome on macOS"
    />
  </SList>
</template>
```

  </template>
</Demo>

## Dividers, icons and meta

`variant="divided"` separates the rows with a hairline; `variant="bordered"` frames the whole list
instead. The `icon` prop puts an `SIcon` in front of the title, and the `append` slot holds trailing
meta text or an action.

<Demo>
  <SList variant="divided" label="Files">
    <SListItem icon="file-text" title="Quarterly report.pdf" description="Shared with 3 people">
      <template #append>2.4 MB</template>
    </SListItem>
    <SListItem icon="file-text" title="Meeting notes.txt" description="Only you">
      <template #append>860 KB</template>
    </SListItem>
    <SListItem icon="folder" title="Drafts" description="12 items">
      <template #append>—</template>
    </SListItem>
  </SList>

<template #code>

```vue
<template>
  <SList
    variant="divided"
    label="Files"
  >
    <SListItem
      icon="file-text"
      title="Quarterly report.pdf"
      description="Shared with 3 people"
    >
      <template #append>2.4 MB</template>
    </SListItem>
    <SListItem
      icon="file-text"
      title="Meeting notes.txt"
      description="Only you"
    >
      <template #append>860 KB</template>
    </SListItem>
  </SList>
</template>
```

  </template>
</Demo>

## Links and actions

`href` renders the row as an `<a>`, `clickable` as a `<button type="button">`; both get the state
layer, the pointer cursor and a focus ring. `active` marks the current row — on a link it also sets
`aria-current`. `disabled` dims the row and takes it out of the tab order.

The `as` prop overrides the tag when the shorthands do not fit — `as="label"` for a row that wraps
a checkbox, for instance. Anything else you pass (`target`, `rel`, `@click`) lands on the row, not
on the `listitem` wrapper.

<Demo>
  <SList variant="bordered" label="Account">
    <SListItem href="#profile" icon="user" title="Profile" />
    <SListItem href="#billing" icon="credit-card" title="Billing" active />
    <SListItem clickable icon="download" title="Export data" description="Sent by email" />
    <SListItem clickable disabled icon="trash-2" title="Delete account" description="Unavailable on a team plan" />
  </SList>

<template #code>

```vue
<template>
  <SList
    variant="bordered"
    label="Account"
  >
    <SListItem
      href="/profile"
      icon="user"
      title="Profile"
    />
    <SListItem
      href="/billing"
      icon="credit-card"
      title="Billing"
      active
    />
    <SListItem
      clickable
      icon="download"
      title="Export data"
      @click="exportData"
    />
    <SListItem
      clickable
      disabled
      icon="trash-2"
      title="Delete account"
    />
  </SList>
</template>
```

  </template>
</Demo>

## Avatars and actions in the slots

`prepend` and `append` take any markup, so a row can carry an avatar, a badge or a button. The
`default` slot replaces the title and the description entirely when a row needs its own layout.

<Demo>
  <SList variant="divided" label="Team">
    <SListItem>
      <template #prepend><SAvatar fallback="AM" size="sm" /></template>
      <template #title>Alice Moreau</template>
      <template #description>alice@example.com</template>
      <template #append><SBadge color="positive">Owner</SBadge></template>
    </SListItem>
    <SListItem>
      <template #prepend><SAvatar fallback="JD" size="sm" /></template>
      <template #title>Jonas Dietrich</template>
      <template #description>jonas@example.com</template>
      <template #append><SButton variant="ghost" size="sm">Manage</SButton></template>
    </SListItem>
  </SList>

<template #code>

```vue
<template>
  <SList
    variant="divided"
    label="Team"
  >
    <SListItem
      title="Alice Moreau"
      description="alice@example.com"
    >
      <template #prepend>
        <SAvatar
          fallback="AM"
          size="sm"
        />
      </template>
      <template #append>
        <SBadge color="positive">Owner</SBadge>
      </template>
    </SListItem>
  </SList>
</template>
```

  </template>
</Demo>

## Sizes

`size` on the list sets the density of every row: `sm`, `md` (default) or `lg`.

<Demo>
  <div style="display: flex; flex-direction: column; gap: 1.5rem">
    <SList size="sm" variant="bordered" label="Small">
      <SListItem icon="check" title="Small row" />
      <SListItem icon="check" title="Another small row" />
    </SList>
    <SList size="md" variant="bordered" label="Medium">
      <SListItem icon="check" title="Medium row" />
      <SListItem icon="check" title="Another medium row" />
    </SList>
    <SList size="lg" variant="bordered" label="Large">
      <SListItem icon="check" title="Large row" />
      <SListItem icon="check" title="Another large row" />
    </SList>
  </div>

<template #code>

```vue
<template>
  <SList
    size="sm"
    variant="bordered"
  >
    <SListItem
      icon="check"
      title="Small row"
    />
  </SList>
</template>
```

  </template>
</Demo>

## API

### SList

<ApiTable name="SList" />

### SListItem

<ApiTable name="SListItem" />
