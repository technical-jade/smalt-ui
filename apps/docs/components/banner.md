# Banner

`SBanner` is a full-width strip that speaks for the whole application — "you are offline", "a new
version is available", "your trial ends in 3 days" — and usually carries actions and a dismiss
control. That is what separates it from [SAlert](./alert): an alert sits in the content flow and
describes the thing next to it, while a banner spans the app width, normally above or below the app
bar, and belongs to the page as a whole. Both share the same status vocabulary
(`info`/`positive`/`warning`/`negative`) and the same announcement rule: `negative` interrupts the
screen reader (`role="alert"`), every other variant is announced politely (`role="status"`).

## Variants

The default variant is `neutral` — an announcement that reports no status and therefore carries no
icon. The status variants add the icon of the matching [SAlert](./alert) status.

<Demo>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 100%">
    <SBanner>We use cookies to keep you signed in.</SBanner>
    <SBanner variant="info">A new version of the app is available.</SBanner>
    <SBanner variant="positive">All changes have been published.</SBanner>
    <SBanner variant="warning">Your trial ends in 3 days.</SBanner>
    <SBanner variant="negative">You are offline — changes are saved locally.</SBanner>
  </div>

<template #code>

```vue
<template>
  <SBanner>We use cookies to keep you signed in.</SBanner>
  <SBanner variant="warning">Your trial ends in 3 days.</SBanner>
  <SBanner variant="negative">You are offline — changes are saved locally.</SBanner>
</template>
```

  </template>
</Demo>

A banner is square by default: it runs from edge to edge of the application, where rounded corners
look like a mistake. Pass `:square="false"` for a banner inset into the content, `bordered` to
outline it in the variant color, and `color` to take the accent from the
[palette](/style/palette).

<Demo>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 100%">
    <SBanner variant="info" bordered>Outlined in the variant color.</SBanner>
    <SBanner variant="info" :square="false" color="indigo">Inset into the content, with a palette accent.</SBanner>
  </div>

<template #code>

```vue
<template>
  <SBanner
    variant="info"
    bordered
  >
    Outlined in the variant color.
  </SBanner>
  <SBanner
    variant="info"
    :square="false"
    color="indigo"
  >
    Inset into the content, with a palette accent.
  </SBanner>
</template>
```

  </template>
</Demo>

## Title and actions

The `title` prop (or the `title` slot) sits above the message, and the `actions` slot holds the
buttons. They stay at the end of the row on a wide screen and move under the message below the
`sm` breakpoint, where a squeezed row of buttons would be hard to hit.

<Demo>
  <SBanner variant="info" title="A new version is available" style="width: 100%">
    Reload the page to get the latest build.
    <template #actions>
      <SButton variant="ghost" size="sm">Later</SButton>
      <SButton size="sm">Reload</SButton>
    </template>
  </SBanner>

<template #code>

```vue
<template>
  <SBanner
    variant="info"
    title="A new version is available"
  >
    Reload the page to get the latest build.
    <template #actions>
      <SButton
        variant="ghost"
        size="sm"
      >
        Later
      </SButton>
      <SButton size="sm">Reload</SButton>
    </template>
  </SBanner>
</template>
```

  </template>
</Demo>

## Dismissing

`closable` adds a close button: it hides the banner and emits `close`. Bind `v-model:visible` to
keep the decision — an application that stores it can restore the banner on the next visit. The
button's accessible name comes from the locale dictionary (`close`); override it on one instance
with `closeLabel`, or replace the dictionary entry through `ConfigProvider`. The `close` slot
replaces the button entirely and receives the `close` handler.

<Demo>
  <SBanner variant="warning" title="Your trial ends in 3 days" closable style="width: 100%">
    Upgrade to keep the workspace after the trial.
    <template #actions>
      <SButton size="sm">Upgrade</SButton>
    </template>
  </SBanner>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)
</script>

<template>
  <SBanner
    v-model:visible="visible"
    variant="warning"
    title="Your trial ends in 3 days"
    closable
    close-label="Dismiss the trial notice"
    @close="rememberDismissal()"
  >
    Upgrade to keep the workspace after the trial.
    <template #actions>
      <SButton size="sm">Upgrade</SButton>
    </template>
  </SBanner>
</template>
```

  </template>
</Demo>

## Sticky

`sticky` pins the banner to the top of its scroll container, so an app-wide message stays in view
while the page scrolls under it. The example below scrolls inside its own box; in an application
the banner is usually the first child of the page scroller.

<Demo>
  <div style="width: 100%; transform: translateZ(0)">
    <div style="height: 220px; overflow-y: auto; border: 1px solid var(--s-color-border); border-radius: 8px">
      <SBanner variant="info" sticky>
        You are viewing an archived project.
        <template #actions>
          <SButton variant="ghost" size="sm">Leave archive</SButton>
        </template>
      </SBanner>
      <div style="padding: 16px; height: 700px">Scroll inside this box — the banner stays on top.</div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div class="page-scroller">
    <SBanner
      variant="info"
      sticky
    >
      You are viewing an archived project.
      <template #actions>
        <SButton
          variant="ghost"
          size="sm"
        >
          Leave archive
        </SButton>
      </template>
    </SBanner>
    <main>…</main>
  </div>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SBanner" />
