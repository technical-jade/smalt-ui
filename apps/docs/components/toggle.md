# Toggle

`SToggle` is a two-state toggle button (pressed/unpressed) built on Reka UI: it carries the
`button` role with `aria-pressed` and `data-state`. It is used on its own (for example, "bold" in
an editor) or inside `SToggleGroup` — then the group manages the state. The state is a `boolean` in
`v-model`, `false` by default.

<script setup>
import { ref } from 'vue'
const payer = ref('sender')
const payerTonal = ref('sender')
const payerOptions = [
  { value: 'sender', label: 'Sender' },
  { value: 'recipient', label: 'Recipient' },
  { value: 'third', label: 'Third party' },
]
</script>

## Single toggle

<ClientOnly>
<Demo>
  <SToggle>Bold</SToggle>
  <SToggle :modelValue="true">Italic</SToggle>
  <SToggle disabled>Underline</SToggle>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const bold = ref(false)
</script>

<template>
  <SToggle v-model="bold">Bold</SToggle>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Icon only

When the toggle holds a single icon, set an accessible name with `aria-label`; otherwise a screen
reader announces an unnamed button.

## Sizes

`size` is `sm` (32px), `md` (40px, the default) or `lg` (48px).

<ClientOnly>
<Demo>
  <SToggle size="sm">sm</SToggle>
  <SToggle size="md">md</SToggle>
  <SToggle size="lg">lg</SToggle>

<template #code>

```vue
<template>
  <SToggle size="sm">sm</SToggle>
  <SToggle size="lg">lg</SToggle>
</template>
```

  </template>
</Demo>
</ClientOnly>

The size height is the height of a single-line toggle and also its minimum. A long label in a
narrow container wraps onto the next line, and the toggle grows in height instead of letting the
text out of its frame. Next to a taller neighbor in a flex or grid row the toggle keeps its own
height. `SToggleGroup` items wrap the same way, and the other items of the group take the height
of the wrapped one.

<ClientOnly>
<Demo>
  <div style="display: grid; gap: 8px; width: 160px">
    <SToggle size="sm">Show delivered orders only</SToggle>
    <SToggle size="md">Show delivered orders only</SToggle>
    <SToggle size="lg">Show delivered orders only</SToggle>
  </div>

<template #code>

```vue
<template>
  <div style="display: grid; gap: 8px; width: 160px">
    <SToggle size="sm">Show delivered orders only</SToggle>
    <SToggle size="md">Show delivered orders only</SToggle>
    <SToggle size="lg">Show delivered orders only</SToggle>
  </div>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Group (`SToggleGroup`)

Groups related toggles. `type="single"` keeps one item active, `type="multiple"` allows any
subset; without `type` the mode follows `v-model`, so an array means `multiple`. Items are set
with the `options` prop or with `SToggle`s placed in the slot (each needs a `value`); `SToggle`s in
the slot take the group `size` unless they set their own. `type="single"` gives a string
`v-model` (or `undefined` when nothing is chosen), `type="multiple"` an array. Options are
`{ value, label?, disabled? }`; without `label` the `value` is shown. `disabled` on the group
turns off all items, and `aria-label` names the group.

<ClientOnly>
<Demo>
  <SToggleGroup
    aria-label="Alignment"
    :options="[
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ]"
  />

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const align = ref('')
</script>

<template>
  <SToggleGroup
    v-model="align"
    type="single"
    aria-label="Alignment"
    :options="[
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ]"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

### Multiple selection

<ClientOnly>
<Demo>
  <SToggleGroup
    type="multiple"
    aria-label="Formatting"
    :options="[
      { value: 'bold', label: 'B' },
      { value: 'italic', label: 'I' },
      { value: 'underline', label: 'U' },
    ]"
  />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const marks = ref<string[]>([])
</script>

<template>
  <SToggleGroup
    v-model="marks"
    type="multiple"
    aria-label="Formatting"
    :options="[
      { value: 'bold', label: 'B' },
      { value: 'italic', label: 'I' },
    ]"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

### Required selection

In `single` mode a click on the active item clears the value. `mandatory` keeps it selected, so
the group always has a value once one is picked. In `multiple` mode the prop has no effect.

### Toggles in the slot

Use the slot when the items hold icons or need props of their own: `aria-label`, `color`, `size`.
A toggle without a `value` does not join the group and works on its own.

<ClientOnly>
<Demo>
  <SToggleGroup
    mandatory
    model-value="list"
    aria-label="View"
    :options="[
      { value: 'list', label: 'List' },
      { value: 'grid', label: 'Grid' },
    ]"
  />

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const view = ref('')
</script>

<template>
  <SToggleGroup
    v-model="view"
    mandatory
    aria-label="View"
    :options="[
      { value: 'list', label: 'List' },
      { value: 'grid', label: 'Grid' },
    ]"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Color

The `color` prop sets the color of the on state from the [palette](/style/palette).

<ClientOnly>
<Demo>
  <SToggle :model-value="true" color="indigo">Indigo</SToggle>
  <SToggle :model-value="true" color="blue">Blue</SToggle>
  <SToggle :model-value="true" color="blue-grey">Blue-grey</SToggle>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const on = ref(false)
</script>

<template>
  <SToggle
    v-model="on"
    color="indigo"
  >
    Indigo
  </SToggle>
</template>
```

  </template>
</Demo>
</ClientOnly>

## On state look

`variant` sets how a pressed toggle looks. `tonal` (the default) is a tonal fill. `outline` is an
accent-colored border without a fill: the chosen option stands out by its outline, like a
selectable card. On `SToggleGroup` the `variant` prop applies to every item, including `SToggle`s
in the slot; an item's own `variant` wins. `color` sets the color of both the fill and the border.

<ClientOnly>
<Demo>
  <div style="display: flex; flex-wrap: wrap; gap: 24px 48px; width: 100%">
    <div style="display: grid; gap: 12px; align-content: start">
      <span style="font-size: var(--s-font-size-sm); color: var(--s-color-text-muted)">tonal (default)</span>
      <SToggleGroup v-model="payerTonal" :options="payerOptions" variant="tonal" mandatory aria-label="Payer, tonal" />
      <div style="display: flex; gap: 8px">
        <SToggle :model-value="true" variant="tonal">primary</SToggle>
        <SToggle :model-value="true" variant="tonal" color="teal">teal</SToggle>
      </div>
    </div>
    <div style="display: grid; gap: 12px; align-content: start">
      <span style="font-size: var(--s-font-size-sm); color: var(--s-color-text-muted)">outline</span>
      <SToggleGroup v-model="payer" :options="payerOptions" variant="outline" mandatory aria-label="Payer, outline" />
      <div style="display: flex; gap: 8px">
        <SToggle :model-value="true" variant="outline">primary</SToggle>
        <SToggle :model-value="true" variant="outline" color="teal">teal</SToggle>
      </div>
    </div>
  </div>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const payer = ref('sender')
const options = [
  { value: 'sender', label: 'Sender' },
  { value: 'recipient', label: 'Recipient' },
  { value: 'third', label: 'Third party' },
]
</script>

<template>
  <SToggleGroup
    v-model="payer"
    :options="options"
    variant="outline"
    mandatory
    aria-label="Payer"
  />
  <SToggle
    :model-value="true"
    variant="outline"
    color="teal"
  >
    teal
  </SToggle>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Keyboard and accessibility

A toggle is a native `<button>` with `aria-pressed` and `data-state="on" | "off"`; it is switched
with `Space` or `Enter`. A group has `role="group"` and is a single tab stop: `Tab` brings focus
into the group, the arrow keys move it between items (in both directions, wrapping from the last to
the first), and `Space`/`Enter` press the focused item. Unlike [radio buttons](./radio), the arrows
select nothing. A `value` on an `SToggle` outside a group is ignored, and the console warns about
it in dev mode.

## API

### SToggle

<ApiTable name="SToggle" />

### SToggleGroup

<ApiTable name="SToggleGroup" />
