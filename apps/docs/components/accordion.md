<script setup>
import { ref } from 'vue'
const accMulti1 = ref(['a'])
const accMulti2 = ref(['a'])
const accMulti3 = ref(['a'])
</script>

# Accordion

`SAccordion` is a set of collapsible sections. It is built on Reka UI (roles, keyboard navigation,
`aria-expanded`). The `single` mode keeps one section open, `multiple` allows any number. Sections
come from the `items` prop or from a slot with hand-written `SAccordionItem` elements (each section
is a reusable item, the chevron is an `SIcon`). Expansion is controlled with `v-model`; without
`type` the mode follows it, so an array means `multiple`. Section headers are headings for screen
readers, level 3 by default: set `heading-level` on the accordion (or on one item) to fit the page
outline.

## Single mode

<ClientOnly>
<Demo>
    <SAccordion
      :items="[
        {
          value: 'delivery',
          title: 'Shipping',
          content: 'We ship nationwide within 2–5 days.'
        },
        {
          value: 'payment',
          title: 'Payment',
          content: 'Card, PayPal, or invoice for businesses.'
        },
        {
          value: 'returns',
          title: 'Returns',
          content: 'No-questions-asked returns within 14 days.'
        }
      ]"
    />

<template #code>

```vue
<template>
  <SAccordion
    v-model="open"
    type="single"
    :items="[
      {
        value: 'delivery',
        title: 'Shipping',
        content: 'We ship within 2–5 days.',
      },
      {
        value: 'payment',
        title: 'Payment',
        content: 'Card, PayPal, or invoice.',
      },
    ]"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Multiple mode

Use the slot and `SAccordionItem` for sections with arbitrary content.

<ClientOnly>
<Demo>
    <SAccordion type="multiple" v-model="accMulti1">
      <SAccordionItem value="a" title="First section">
        Content of the first section with arbitrary markup.
      </SAccordionItem>
      <SAccordionItem value="b" title="Second section">
        Content of the second section.
      </SAccordionItem>
    </SAccordion>

<template #code>

```vue
<template>
  <SAccordion
    v-model="open"
    type="multiple"
  >
    <SAccordionItem
      value="a"
      title="First section"
    >
      Content of the first section.
    </SAccordionItem>
    <SAccordionItem
      value="b"
      title="Second section"
    >
      Content of the second section.
    </SAccordionItem>
  </SAccordion>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Icons

The `expand-icon` prop of `SAccordionItem` sets the expand indicator icon (a registry name, `plus`
here).

<ClientOnly>
<Demo>
    <SAccordion type="multiple" v-model="accMulti2">
      <SAccordionItem value="a" title="First section" expand-icon="plus">
        Content of the first section.
      </SAccordionItem>
      <SAccordionItem value="b" title="Second section" expand-icon="plus">
        Content of the second section.
      </SAccordionItem>
    </SAccordion>

<template #code>

```vue
<template>
  <SAccordion type="multiple">
    <SAccordionItem
      value="a"
      title="First section"
      expand-icon="plus"
    >
      Content of the first section.
    </SAccordionItem>
    <SAccordionItem
      value="b"
      title="Second section"
      expand-icon="plus"
    >
      Content of the second section.
    </SAccordionItem>
  </SAccordion>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Disabled item

The `disabled` prop of `SAccordionItem` locks the section so it cannot be expanded.

<ClientOnly>
<Demo>
    <SAccordion type="multiple">
      <SAccordionItem value="a" title="Available section">
        This section can be expanded.
      </SAccordionItem>
      <SAccordionItem value="b" title="Disabled section" disabled>
        This content is unavailable.
      </SAccordionItem>
    </SAccordion>

<template #code>

```vue
<template>
  <SAccordion type="multiple">
    <SAccordionItem
      value="a"
      title="Available section"
    >
      This section can be expanded.
    </SAccordionItem>
    <SAccordionItem
      value="b"
      title="Disabled section"
      disabled
    >
      This content is unavailable.
    </SAccordionItem>
  </SAccordion>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Custom title

The `#title` slot replaces the `title` prop, so the header can hold an icon or any markup.

<ClientOnly>
<Demo>
    <SAccordion type="multiple" v-model="accMulti3">
      <SAccordionItem value="a">
        <template #title>
          <SIcon icon="info" :size="16" /> Section with an icon in the title
        </template>
        The title is built from an icon and text through the slot.
      </SAccordionItem>
      <SAccordionItem value="b" title="Regular title">
        This title comes from the title prop.
      </SAccordionItem>
    </SAccordion>

<template #code>

```vue
<template>
  <SAccordion type="multiple">
    <SAccordionItem value="a">
      <template #title>
        <SIcon
          icon="info"
          :size="16"
        />
        Section with an icon in the title
      </template>
      The title is built from an icon and text through the slot.
    </SAccordionItem>
  </SAccordion>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Collapsible single mode

In `single` mode the `collapsible` prop lets the user close the open section. With
`:collapsible="false"` one section always stays expanded, and its header is marked
`aria-disabled` while open.

<ClientOnly>
<Demo>
    <SAccordion
      type="single"
      collapsible
      :items="[
        {
          value: 'a',
          title: 'This section can be closed',
          content: 'Clicking the open header collapses it completely.'
        },
        {
          value: 'b',
          title: 'Second section',
          content: 'Opening any section closes the previous one.'
        }
      ]"
    />

<template #code>

```vue
<template>
  <SAccordion
    type="single"
    collapsible
    :items="items"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Keeping collapsed content

Collapsed sections are unmounted. `:unmount-on-hide="false"` on the accordion keeps them mounted
and hidden, so nested fields keep their state and the browser page search finds collapsed text. A
section can override it with its own `unmount-on-hide`.

## API

### SAccordion

<ApiTable name="SAccordion" />

### SAccordionItem

<ApiTable name="SAccordionItem" />
