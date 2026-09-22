<script setup>
import { ref } from 'vue'

const darkMode = ref(true)
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

## API

<ApiTable name="SSwitch" />
