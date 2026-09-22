<script setup>
import { ref } from 'vue'
import { required } from '@smalt-ui/core'

const darkMode = ref(true)
const backups = ref(false)
</script>

# Switch

`SSwitch` is a toggle switch built on Reka UI (`role="switch"`, keyboard support, `data-state`).
The label renders through the reused `SLabel`. It works with `v-model` (boolean).
Without a visible label, name the switch with `aria-label`.

## Basic usage

<ClientOnly>
<Demo>
  <SSwitch label="Notifications" />
  <SSwitch label="Dark theme" v-model="darkMode" />
  <SSwitch label="Unavailable" disabled />

<template #code>

```vue
<template>
  <SSwitch
    v-model="enabled"
    label="Notifications"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Required

`required` marks the switch as required for form submission (passed through to the control's
native semantics).

<ClientOnly>
<Demo>
  <SSwitch label="Accept the terms" required />

<template #code>

```vue
<template>
  <SSwitch
    v-model="accepted"
    label="Accept the terms"
    required
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
  <SSwitch color="indigo" :model-value="true" label="Indigo" />
  <SSwitch color="blue" :model-value="true" label="Blue" />
  <SSwitch color="blue-grey" :model-value="true" label="Blue-grey" />

<template #code>

```vue
<template>
  <SSwitch
    v-model="on"
    color="indigo"
    label="Indigo"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Hint and error

The `hint` and `error` props render text under the switch and link it to the control through
`aria-describedby`; `error` also sets `aria-invalid` and turns the track border red. `invalid`
paints the switch red without a text. The switch is wrapped in an inline
[`SFormField`](/components/form-field) for this, so no wrapper of your own is needed. The
consumer's `class` and `style` go to that outer wrapper, as on [`SCheckbox`](/components/checkbox);
other attributes (`data-*`, `title`, listeners) reach the switch control itself. Without the
`id` prop the control gets a generated `s-field-…` id, as the other fields do.

Because `class` lands on the wrapper, a selector that expects it on the `.s-switch` element itself,
such as `.my-switch.s-switch` or `.parent > .s-switch`, no longer matches. Select the inner block
through the wrapper instead: `.my-switch .s-switch`.

<ClientOnly>
<Demo>
  <SSwitch label="Weekly digest" hint="Sent on Mondays" />
  <SSwitch label="Share usage data" error="Required by your organization" />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const digest = ref(false)
const sharing = ref(false)
</script>

<template>
  <SSwitch
    v-model="digest"
    label="Weekly digest"
    hint="Sent on Mondays"
  />
  <SSwitch
    v-model="sharing"
    label="Share usage data"
    error="Required by your organization"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## Validation

`rules` checks the switch when focus leaves it, and then on every change while the error is
shown, so turning the switch on clears the error at once. The rules receive the `v-model` value,
a `boolean`; `false` (off) is empty for `required()`. See the [Validation](/guide/validation) guide
for the details.

Move focus to the switch and away without turning it on, then turn it on.

<ClientOnly>
<Demo>
  <SSwitch
    v-model="backups"
    label="Enable backups"
    required
    :rules="[required('Required to continue')]"
  />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { required } from '@smalt-ui/core'

const backups = ref(false)
</script>

<template>
  <SSwitch
    v-model="backups"
    label="Enable backups"
    required
    :rules="[required('Required to continue')]"
  />
</template>
```

  </template>
</Demo>
</ClientOnly>

## API

<ApiTable name="SSwitch" />
