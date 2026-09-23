<script setup>
import { ref } from 'vue'

const railCollapsed = ref(true)
const mobileOpen = ref(false)

const shell =
  'position: relative; transform: translateZ(0); overflow: hidden; width: 100%; min-block-size: 0'
</script>

# App shell

Three components frame a dashboard: `SAppBar` is the bar along the top, `SSidebar` is the
navigation column that collapses to a rail and turns into a drawer on narrow screens, and `SPage`
is the content area that sits below the bar and beside the column instead of underneath them.

They are a frame, not a layout engine. Rows, columns, gutters and breakpoint visibility stay with
the [grid utilities](/style/grid) and `.s-container`; the shell only decides what the page has to
reserve. The three are siblings inside the app container — the `.s-root--app` wrapper described in
[Isolation](/guide/isolation):

```vue
<template>
  <div class="s-root s-root--app">
    <SAppBar>
      <template #prepend>
        <SButton
          variant="ghost"
          icon-only
          icon="menu"
          aria-label="Open navigation"
          @click="open = true"
        />
      </template>
      Dashboard
    </SAppBar>

    <SSidebar
      v-model:open="open"
      v-model:collapsed="collapsed"
      aria-label="Main"
    >
      …
    </SSidebar>

    <SPage>…</SPage>
  </div>
</template>
```

Order matters: the page reserves space with CSS that reads the bar and the column as preceding
siblings. Nothing is measured in JavaScript — the bar publishes `--s-app-bar-height`, the sidebar
publishes `--s-sidebar-width` and `--s-sidebar-collapsed-width`, and the page turns them into
padding. A custom size is mirrored onto the wrapper element, so the neighbours inherit it.

## Landmarks

The bar renders `role="banner"`, the sidebar wraps its navigation in `role="navigation"` and the
page renders `role="main"`, all on plain `div` elements rather than `header`/`nav`/`main`: host
stylesheets target those tags, and library markup stays out of their reach. Assistive technology
sees the same regions either way.

A document has one banner and one main, so a second bar or a second page area sets
`:landmark="false"`. Give every sidebar an `aria-label` — a page with more than one navigation
region needs the names to tell them apart.

## A full shell

The bar sticks to the top and keeps its place in the flow, so the page needs no offset for it. The
column is pinned beside the page. Every example below lives in a wrapper with a `transform`, which
makes that wrapper the containing block for the pinned elements — otherwise they would escape into
the documentation page.

<Demo>
  <div class="s-root s-root--app" :style="shell + '; block-size: 320px'">
    <SAppBar>
      <span class="s-text-h6">Analytics</span>
      <template #append>
        <SButton variant="ghost" size="sm" icon-only icon="bell" aria-label="Notifications" />
        <SAvatar fallback="AM" size="sm" />
      </template>
    </SAppBar>
    <SSidebar breakpoint="sm" aria-label="Sections">
      <template #header>
        <SIcon icon="package" :size="20" />
        <span class="s-sidebar__label">Acme</span>
      </template>
      <SList>
        <SListItem clickable icon="home" title="Overview" />
        <SListItem clickable icon="file-text" title="Reports" active />
        <SListItem clickable icon="users" title="Customers" />
      </SList>
    </SSidebar>
    <SPage>
      <SCard>Pick a report on the left.</SCard>
    </SPage>
  </div>

<template #code>

```vue
<template>
  <div class="s-root s-root--app">
    <SAppBar>
      <span class="s-text-h6">Analytics</span>
      <template #append>
        <SButton
          variant="ghost"
          size="sm"
          icon-only
          icon="bell"
          aria-label="Notifications"
        />
        <SAvatar
          fallback="AM"
          size="sm"
        />
      </template>
    </SAppBar>

    <SSidebar aria-label="Sections">
      <template #header>
        <SIcon
          icon="package"
          :size="20"
        />
        <span class="s-sidebar__label">Acme</span>
      </template>
      <SList>
        <SListItem
          clickable
          icon="home"
          title="Overview"
        />
        <SListItem
          clickable
          icon="file-text"
          title="Reports"
          active
        />
      </SList>
    </SSidebar>

    <SPage>
      <SCard>Pick a report on the left.</SCard>
    </SPage>
  </div>
</template>
```

  </template>
</Demo>

## The collapsed rail

`v-model:collapsed` narrows the column to `collapsedWidth`, and the page follows. Labels go away
with the `.s-sidebar__label` class; anything that needs more than a hidden label reads the
`collapsed` slot prop. The toggle's accessible name comes from the locale dictionary
(`expandSidebar` / `collapseSidebar`); replace it per instance with `expandLabel` and
`collapseLabel`, or everywhere through [i18n](/guide/i18n).

`side="end"` puts the column on the trailing edge — the right side in a left-to-right document and
the left one in RTL.

<Demo>
  <div class="s-root s-root--app" :style="shell + '; block-size: 300px'">
    <SAppBar color="primary" :bordered="false">
      <span class="s-text-h6">Billing</span>
    </SAppBar>
    <SSidebar v-model:collapsed="railCollapsed" breakpoint="sm" side="end" aria-label="Billing sections">
      <SList>
        <SListItem clickable icon="file-text">
          <template #title><span class="s-sidebar__label">Invoices</span></template>
        </SListItem>
        <SListItem clickable icon="credit-card">
          <template #title><span class="s-sidebar__label">Payment methods</span></template>
        </SListItem>
      </SList>
    </SSidebar>
    <SPage>
      <SCard>The rail keeps the icons and hands the width back to the page.</SCard>
    </SPage>
  </div>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const collapsed = ref(true)
</script>

<template>
  <SSidebar
    v-model:collapsed="collapsed"
    side="end"
    aria-label="Billing sections"
  >
    <SList>
      <SListItem
        clickable
        icon="file-text"
      >
        <template #title>
          <span class="s-sidebar__label">Invoices</span>
        </template>
      </SListItem>
    </SList>
  </SSidebar>
</template>
```

  </template>
</Demo>

## The drawer breakpoint

Below `breakpoint` the column becomes a drawer opened with `v-model:open` — the same content, a
[Drawer](./drawer) around it, focus trapped inside. The breakpoint is a name from the grid scale:
`sm`, `md` (the default), `lg` or `xl`. The server renders the column and swaps to the drawer once
the media query has been read in the browser, so nothing branches on a measured window width.

The example below asks for `breakpoint="xl"`, so the narrow rendering shows on a wide screen too.

<ClientOnly>
<Demo>
  <div class="s-root s-root--app" :style="shell + '; block-size: 220px'">
    <SAppBar>
      <template #prepend>
        <SButton variant="ghost" size="sm" icon-only icon="menu" aria-label="Open navigation" @click="mobileOpen = true" />
      </template>
      <span class="s-text-h6">Mobile</span>
    </SAppBar>
    <SSidebar v-model:open="mobileOpen" breakpoint="xl" aria-label="Mobile sections">
      <SList>
        <SListItem clickable icon="home" title="Overview" />
        <SListItem clickable icon="settings" title="Settings" />
      </SList>
    </SSidebar>
    <SPage>
      <SCard>Open the menu — the sidebar arrives as a drawer.</SCard>
    </SPage>
  </div>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <SAppBar>
    <template #prepend>
      <SButton
        variant="ghost"
        icon-only
        icon="menu"
        aria-label="Open navigation"
        @click="open = true"
      />
    </template>
    Mobile
  </SAppBar>

  <SSidebar
    v-model:open="open"
    breakpoint="md"
    aria-label="Mobile sections"
  >
    <SList>
      <SListItem
        clickable
        icon="home"
        title="Overview"
      />
    </SList>
  </SSidebar>
</template>
```

  </template>
</Demo>
</ClientOnly>

## A page with a container

`container` wraps the content in the `.s-container` utility — centred, with the readable maximum of
the current breakpoint and the container's own side padding. `maxWidth` caps it further, with or
without the container, and `:padded="false"` hands the padding back to the content.

`position="fixed"` takes the bar out of the flow; the page then reserves its height, so a scrolling
page passes under a bar that stays put. `elevate-on-scroll` gives that bar a shadow as soon as the
window moves.

<Demo>
  <div class="s-root s-root--app" :style="shell + '; block-size: 260px'">
    <SAppBar position="fixed" elevate-on-scroll>
      <span class="s-text-h6">Documentation</span>
    </SAppBar>
    <SPage container max-width="34rem">
      <SCard>
        A container keeps long-form content within a readable measure while the page itself still
        spans the shell.
      </SCard>
    </SPage>
  </div>

<template #code>

```vue
<template>
  <SAppBar
    position="fixed"
    elevate-on-scroll
  >
    Documentation
  </SAppBar>

  <SPage
    container
    max-width="34rem"
  >
    <SCard>A readable measure inside a full-width shell.</SCard>
  </SPage>
</template>
```

  </template>
</Demo>

## API

### SAppBar

<ApiTable name="SAppBar" />

### SSidebar

<ApiTable name="SSidebar" />

### SPage

<ApiTable name="SPage" />
