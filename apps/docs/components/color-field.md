# Color Field

`SColorField` is a text input for a hex color with a preview swatch on the left. The value is
normalized (case, `#`) and can be changed with the arrow keys and the mouse wheel. It is built on
`SFormField` (label, hint, error message); the value is a hex string bound with `v-model`, and
erasing the text (then Enter or leaving the field) clears it to an empty string. For visual color
picking, use `SColorPicker`.

## Basic usage

<script setup>
import { ref } from 'vue'
import { pattern, required } from '@smalt-ui/core'
const color = ref('#3B82F6')
const accent = ref('#3B82F6')
</script>

<Demo>
  <ClientOnly>
    <SColorField v-model="color" label="Brand color" />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { ref } from 'vue'
const color = ref('#3B82F6')
</script>

<template>
  <SColorField
    v-model="color"
    label="Brand color"
  />
</template>
```

  </template>
</Demo>

## Hint and error message

<Demo>
  <ClientOnly>
      <SColorField v-model="color" label="Accent" hint="Primary brand color" />
      <SColorField v-model="color" label="Color" error="Enter a valid hex value" />
  </ClientOnly>

<template #code>

```vue
<template>
  <SColorField
    v-model="color"
    label="Accent"
    hint="Primary brand color"
  />
  <SColorField
    v-model="color"
    label="Color"
    error="Enter a valid hex value"
  />
</template>
```

  </template>
</Demo>

## Sizes

The `size` prop controls the field height: `sm` (28px), `md` (36px), or `lg` (44px).

<Demo>
  <ClientOnly>
      <SColorField v-model="color" label="sm" size="sm" />
      <SColorField v-model="color" label="md" size="md" />
      <SColorField v-model="color" label="lg" size="lg" />
  </ClientOnly>

<template #code>

```vue
<template>
  <SColorField
    v-model="color"
    label="sm"
    size="sm"
  />
  <SColorField
    v-model="color"
    label="md"
    size="md"
  />
  <SColorField
    v-model="color"
    label="lg"
    size="lg"
  />
</template>
```

  </template>
</Demo>

## States

`required` adds `*` to the label, `readonly` prevents editing, `disabled` dims the field, `invalid`
marks it as invalid, and `hint` shows a hint under the field.

<Demo>
  <ClientOnly>
      <SColorField v-model="color" label="Required" required hint="Brand color" />
      <SColorField v-model="color" label="Read-only" readonly />
      <SColorField v-model="color" label="Disabled" disabled />
      <SColorField v-model="color" label="Invalid" invalid />
  </ClientOnly>

<template #code>

```vue
<template>
  <SColorField
    v-model="color"
    label="Required"
    required
    hint="Brand color"
  />
  <SColorField
    v-model="color"
    label="Read-only"
    readonly
  />
  <SColorField
    v-model="color"
    label="Disabled"
    disabled
  />
  <SColorField
    v-model="color"
    label="Invalid"
    invalid
  />
</template>
```

  </template>
</Demo>

## `prepend` / `append` slots

The slots insert arbitrary content inside the field frame next to the swatch: an icon, text, or a
button.

<Demo>
  <ClientOnly>
      <SColorField v-model="color" aria-label="Primary color">
        <template #prepend><SIcon icon="star" :size="16" /></template>
      </SColorField>
      <SColorField v-model="color" aria-label="Color">
        <template #append>
          <SButton size="sm" variant="ghost" icon="copy" aria-label="Copy" />
        </template>
      </SColorField>
  </ClientOnly>

<template #code>

```vue
<template>
  <SColorField
    v-model="color"
    aria-label="Primary color"
  >
    <template #prepend>
      <SIcon
        icon="star"
        :size="16"
      />
    </template>
  </SColorField>

  <SColorField
    v-model="color"
    aria-label="Color"
  >
    <template #append>
      <SButton
        size="sm"
        variant="ghost"
        icon="copy"
        aria-label="Copy"
      />
    </template>
  </SColorField>
</template>
```

  </template>
</Demo>

## Validation

`rules` checks the color when focus leaves the field, and then on every change while the error is
shown. The rules receive the `v-model` value: a hex string, or `''` when the text is erased, which
`required()` treats as empty. Text that is not a color never reaches the rules: the field restores
the last valid color. A color with transparency (`#3B82F680`) is valid for the field, so a rule
can ask for the six-digit form. See the [Validation](/guide/validation) guide for the details.

Erase the text and leave the field, then type `#3B82F680`.

<Demo>
  <ClientOnly>
    <SColorField
      v-model="accent"
      label="Accent color"
      :rules="[required(), pattern(/^#[0-9a-f]{6}$/i, 'Use #RRGGBB, without transparency')]"
    />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { pattern, required } from '@smalt-ui/core'

const accent = ref('#3B82F6')
</script>

<template>
  <SColorField
    v-model="accent"
    label="Accent color"
    :rules="[required(), pattern(/^#[0-9a-f]{6}$/i, 'Use #RRGGBB, without transparency')]"
  />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SColorField" />
