# Popover

`SPopover` is a floating panel anchored to a trigger: it suits action menus, popover forms and
interactive hints. It is built on Reka UI (portal, positioning, closing on `Esc`/outside click,
focus management). The trigger goes into the `#trigger` slot (`as-child`), the content into the
default slot.
The panel fits the space left on screen: long content scrolls inside it instead of running off the
edge. `aria-label` names the panel; without it the panel is named by its trigger.

## Basic usage

<ClientOnly>
<Demo>
  <SPopover aria-label="Profile">
    <template #trigger>
      <SButton variant="outline">Open panel</SButton>
    </template>
    <div style="display: flex; flex-direction: column; gap: 8px; min-width: 200px">
      <strong>Alex Johnson</strong>
      <span style="color: var(--s-color-text-muted)">alex@example.com</span>
    </div>
  </SPopover>

<template #code>

```vue
<template>
  <SPopover
    v-model:open="open"
    aria-label="Profile"
  >
    <template #trigger>
      <SButton variant="outline">Open panel</SButton>
    </template>
    <strong>Alex Johnson</strong>
  </SPopover>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Side and alignment

<ClientOnly>
<Demo>
  <SPopover side="right" align="start" aria-label="Help">
    <template #trigger>
      <SButton variant="outline">Right</SButton>
    </template>
    <div style="max-width: 220px">The panel appears on the right, aligned to the start of the side.</div>
  </SPopover>

<template #code>

```vue
<template>
  <SPopover
    side="right"
    align="start"
  >
    <template #trigger>
      <SButton variant="outline">Right</SButton>
    </template>
    Panel on the right.
  </SPopover>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Modal mode

The `modal` prop blocks interaction with the background and enables a focus trap:
while the panel is open, focus cannot leave it and the background is dimmed.

<ClientOnly>
<Demo>
  <SPopover modal aria-label="Confirmation">
    <template #trigger>
      <SButton variant="primary">Open modal</SButton>
    </template>
    <div style="display: flex; flex-direction: column; gap: 8px; min-width: 220px">
      <strong>Delete the project?</strong>
      <span style="color: var(--s-color-text-muted)">The background is blocked, focus stays in the panel.</span>
    </div>
  </SPopover>

<template #code>

```vue
<template>
  <SPopover
    v-model:open="open"
    modal
    aria-label="Confirmation"
  >
    <template #trigger>
      <SButton variant="primary">Open modal</SButton>
    </template>
    <strong>Delete the project?</strong>
  </SPopover>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Elevation

The popover panel is raised to the third elevation level. `flat` removes the shadow, `elevation`
sets a custom level; the radius is not affected — `square` controls it, see
[Elevation](/style/elevation).

<Demo>
  <ClientOnly>
    <SPopover flat>
      <template #trigger><SButton variant="outline">flat</SButton></template>
      Panel without a shadow.
    </SPopover>
    <SPopover :elevation="5">
      <template #trigger><SButton variant="outline">elevation 5</SButton></template>
      A higher panel.
    </SPopover>
  </ClientOnly>

<template #code>

```vue
<template>
  <SPopover flat>
    <template #trigger>
      <SButton variant="outline">Filters</SButton>
    </template>
    Panel without a shadow.
  </SPopover>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SPopover" />
