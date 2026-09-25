<script setup>
import { ref } from 'vue'

const otp = ref([])
const fullCode = (v) => v.join('').length === 4 || 'Enter all 4 digits'
</script>

# Pin Input

`SPinInput` is a code input split into cells (OTP, PIN, a code from a text message). It is built
on Reka UI (auto-advance between cells, pasting the whole code, keyboard control) and reuses
`SFormField` for the label, hint, error message and a11y wiring. The value is an array of
characters bound with `v-model`, strings also with `type="number"`.
`complete` fires once every cell is filled; `size` matches the height of the other fields. Focus
moving between the cells does not emit `blur`. Each cell is named "Character 1 of 4" and so on;
the `cell-label` prop overrides the template, where `{index}` and `{length}` are replaced with the
cell number and the cell count.

## Basic usage

<ClientOnly>
<Demo>
  <SPinInput :length="4" label="Verification code" hint="Enter 4 digits" type="number" />

<template #code>

```vue
<template>
  <SPinInput
    v-model="code"
    :length="4"
    label="Verification code"
    type="number"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Masked input

`mask` hides the characters — for secret PIN codes.

<ClientOnly>
<Demo>
  <SPinInput :length="6" label="PIN" mask type="number" />

<template #code>

```vue
<template>
  <SPinInput
    v-model="pin"
    :length="6"
    label="PIN"
    mask
    type="number"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## States

`required` marks the field as required, `error` shows an error message and makes the field
invalid (explicit `invalid` does the same), `disabled` blocks input.

<ClientOnly>
<Demo>
  <div style="display: grid; gap: 16px">
    <SPinInput :length="4" label="Code" required type="number" />
    <SPinInput :length="4" label="Code" error="Invalid code" type="number" />
    <SPinInput :length="4" label="Code" invalid type="number" />
    <SPinInput :length="4" label="Code" disabled type="number" />
  </div>

<template #code>

```vue
<template>
  <SPinInput
    v-model="code"
    :length="4"
    label="Code"
    required
    type="number"
  />
  <SPinInput
    v-model="code"
    :length="4"
    label="Code"
    error="Invalid code"
    type="number"
  />
  <SPinInput
    v-model="code"
    :length="4"
    label="Code"
    invalid
    type="number"
  />
  <SPinInput
    v-model="code"
    :length="4"
    label="Code"
    disabled
    type="number"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## OTP and placeholder

`otp` enables autofill of a code from a text message on mobile devices, and `placeholder` sets
the filler character for empty cells.

<ClientOnly>
<Demo>
  <SPinInput :length="6" label="Verification code" otp placeholder="•" type="number" />

<template #code>

```vue
<template>
  <SPinInput
    v-model="code"
    :length="6"
    label="Verification code"
    otp
    placeholder="•"
    type="number"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## `prepend` / `append` slots

The slots put arbitrary content next to the code cells — an icon or a caption.

<ClientOnly>
<Demo>
  <div style="display: grid; gap: 12px">
    <SPinInput :length="4" aria-label="Code" type="number">
      <template #prepend><SIcon icon="lock" :size="16" /></template>
    </SPinInput>
    <SPinInput :length="4" aria-label="Code" type="number">
      <template #append><SIcon icon="check" :size="16" /></template>
    </SPinInput>
  </div>

<template #code>

```vue
<template>
  <SPinInput
    v-model="code"
    :length="4"
    aria-label="Code"
    type="number"
  >
    <template #prepend>
      <SIcon
        icon="lock"
        :size="16"
      />
    </template>
  </SPinInput>

  <SPinInput
    v-model="code"
    :length="4"
    aria-label="Code"
    type="number"
  >
    <template #append>
      <SIcon
        icon="check"
        :size="16"
      />
    </template>
  </SPinInput>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Validation

`rules` checks the code when focus leaves the field; moving between the cells does not count. The
rules receive the `v-model` value, a `string[]` with one character per cell. `required()` only
checks that the array is not empty, and erased cells leave empty strings in it, so check the
joined length to require every cell. See the [Validation](/guide/validation) guide for the
details.

Type two digits and leave the field.

<ClientOnly>
<Demo>
  <SPinInput
    v-model="otp"
    :length="4"
    label="Verification code"
    type="number"
    :rules="[fullCode]"
  />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { SRule } from '@smalt-ui/core'

const code = ref<string[]>([])
const fullCode: SRule<string[]> = (v) => v.join('').length === 4 || 'Enter all 4 digits'
</script>

<template>
  <SPinInput
    v-model="code"
    :length="4"
    label="Verification code"
    type="number"
    :rules="[fullCode]"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## API

<ApiTable name="SPinInput" />
