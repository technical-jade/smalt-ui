# Collapsible

`SCollapsible` is an expandable block: a trigger header controls the visibility of the content. It
is built on Reka UI (`aria-expanded`, `aria-controls`, keyboard control). The chevron is a reusable
`SIcon` that rotates in the open state. Two-way binding of the open state uses `v-model:open`.

## Basic usage

<ClientOnly>
<Demo>
    <SCollapsible title="What does the plan include?">
      Unlimited projects, priority support, and one-click report export.
    </SCollapsible>

<template #code>

```vue
<template>
  <SCollapsible
    v-model:open="open"
    title="What does the plan include?"
  >
    Unlimited projects, priority support, and report export.
  </SCollapsible>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Open by default

<ClientOnly>
<Demo>
    <SCollapsible title="Refund policy" :open="true">
      We refund your money within 14 days, no questions asked.
    </SCollapsible>

<template #code>

```vue
<template>
  <SCollapsible
    title="Refund policy"
    :open="true"
  >
    We refund your money within 14 days, no questions asked.
  </SCollapsible>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Indicator icon

The `expand-icon` prop sets the expand indicator icon (a registry name, `chevron-right` here).

<ClientOnly>
<Demo>
    <SCollapsible title="What does the plan include?" expand-icon="chevron-right">
      Unlimited projects, priority support, and one-click report export.
    </SCollapsible>

<template #code>

```vue
<template>
  <SCollapsible
    v-model:open="open"
    title="What does the plan include?"
    expand-icon="chevron-right"
  >
    Unlimited projects, priority support, and report export.
  </SCollapsible>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Disabled

The `disabled` prop locks the trigger, so the block can be neither expanded nor collapsed.

<ClientOnly>
<Demo>
    <SCollapsible title="Section temporarily unavailable" disabled>
      This content cannot be expanded right now.
    </SCollapsible>

<template #code>

```vue
<template>
  <SCollapsible
    title="Section temporarily unavailable"
    disabled
  >
    This content cannot be expanded right now.
  </SCollapsible>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Trigger slot

The `#trigger` slot replaces the `title` prop, so the header can hold an icon or custom markup.

<ClientOnly>
<Demo>
    <SCollapsible>
      <template #trigger>
        <SIcon icon="settings" :size="16" /> Advanced settings
      </template>
      Fine-grained options hidden by default.
    </SCollapsible>

<template #code>

```vue
<template>
  <SCollapsible v-model:open="open">
    <template #trigger>
      <SIcon
        icon="settings"
        :size="16"
      />
      Advanced settings
    </template>
    Fine-grained options hidden by default.
  </SCollapsible>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Header colors

The header color and background come from the `--s-collapsible-trigger-bg` and
`--s-collapsible-trigger-color` tokens (the latter also sets the chevron color). Dark or accent
headers are common in mockups, so they do not need a rule with higher specificity:

<Demo>
  <div style="width: 100%; max-width: 420px; --s-collapsible-trigger-bg: var(--s-gray-600); --s-collapsible-trigger-color: var(--s-white)">
    <SCollapsible title="Dimensions and weight">
      Length, width, height, and weight of each package.
    </SCollapsible>
  </div>

<template #code>

```vue
<template>
  <SCollapsible
    class="panel"
    title="Dimensions and weight"
  >
    Length, width, height, and weight of each package.
  </SCollapsible>
</template>

<style>
.panel {
  --s-collapsible-trigger-bg: var(--s-gray-600);
  --s-collapsible-trigger-color: var(--s-white);
}
</style>
```

  </template>
</Demo>

## Keeping collapsed content

The collapsed content is unmounted. `:unmount-on-hide="false"` keeps it mounted and hidden, so
nested fields keep their state and the browser page search finds its text.

## API

<ApiTable name="SCollapsible" />
