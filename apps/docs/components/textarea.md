<script setup>
import { ref } from 'vue'
import { maxLength, required } from '@smalt-ui/core'

const feedback = ref('')
</script>

# Textarea

`STextarea` is a multi-line text field. It is built on `SFormField` (the same composition as
`SInput`): the label, hint/error message and a11y wiring are reused. It works with `v-model`.

The label **floats** by default (at rest it sits on the first line, on focus or once filled it
moves up onto the top border); turn it off with `:floating-label="false"`.

## Basic usage

<Demo>
  <STextarea label="Comment" placeholder="Your feedback…" :rows="4" />

<template #code>

```vue
<template>
  <STextarea
    v-model="comment"
    label="Comment"
    :rows="4"
  />
</template>
```

  </template>
</Demo>

## Hint and error

<Demo>
  <STextarea label="Bio" hint="A few words about yourself" :rows="3" />
  <STextarea label="Bio" error="Fill in the field" :rows="3" />

<template #code>

```vue
<template>
  <STextarea
    label="Bio"
    hint="A few words about yourself"
  />
  <STextarea
    label="Bio"
    error="Fill in the field"
  />
</template>
```

  </template>
</Demo>

## States

`required` marks the field as required (`*` next to the label), `invalid` marks the field as
invalid, `disabled` dims the field and blocks input.

<Demo>
  <STextarea label="Required" required :rows="3" />
  <STextarea label="Invalid" invalid :rows="3" />
  <STextarea label="Disabled" disabled placeholder="Unavailable" :rows="3" />

<template #code>

```vue
<template>
  <STextarea
    label="Required"
    required
    :rows="3"
  />
  <STextarea
    label="Invalid"
    invalid
    :rows="3"
  />
  <STextarea
    label="Disabled"
    disabled
    placeholder="Unavailable"
    :rows="3"
  />
</template>
```

  </template>
</Demo>

## `prepend` / `append` slots

The slots put arbitrary content inside the field border — an icon or a button.

<Demo>
  <STextarea label="Note" placeholder="Text…" :rows="3">
    <template #prepend><SIcon icon="pencil" :size="16" /></template>
  </STextarea>
  <STextarea label="Message" placeholder="Text…" :rows="3">
    <template #append>
      <SButton size="sm" variant="ghost" icon="mail" aria-label="Send" />
    </template>
  </STextarea>

<template #code>

```vue
<template>
  <STextarea
    v-model="note"
    label="Note"
    :rows="3"
  >
    <template #prepend>
      <SIcon
        icon="pencil"
        :size="16"
      />
    </template>
  </STextarea>

  <STextarea
    v-model="message"
    label="Message"
    :rows="3"
  >
    <template #append>
      <SButton
        size="sm"
        variant="ghost"
        icon="mail"
        aria-label="Send"
      />
    </template>
  </STextarea>
</template>
```

  </template>
</Demo>

## Read-only

`readonly` shows the text and lets the user select and copy it but not change it: unlike
`disabled`, the field is not dimmed and stays in the tab order.

<Demo>
  <STextarea
    label="Terms"
    model-value="Shipments are accepted in the sender's packaging."
    readonly
    :rows="3"
    :floating-label="false"
  />

<template #code>

```vue
<template>
  <STextarea
    v-model="terms"
    label="Terms"
    readonly
    :rows="3"
  />
</template>
```

  </template>
</Demo>

## Validation

`rules` checks the text when focus leaves the field, and then on every change while the error is
shown. The rules receive the `v-model` string. `maxLength()` reports a text that is too long
instead of cutting it, unlike the native `maxlength` attribute, so pasted text is not lost. See
the [Validation](/guide/validation) guide for the details.

Leave the field empty and move focus away, then write a few words. Paste more than 200 characters
and leave the field again: now the second rule fails.

<Demo>
  <STextarea
    v-model="feedback"
    label="Feedback"
    hint="Up to 200 characters"
    :rows="3"
    :rules="[required(), maxLength(200)]"
  />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { maxLength, required } from '@smalt-ui/core'

const feedback = ref('')
</script>

<template>
  <STextarea
    v-model="feedback"
    label="Feedback"
    hint="Up to 200 characters"
    :rows="3"
    :rules="[required(), maxLength(200)]"
  />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="STextarea" />
