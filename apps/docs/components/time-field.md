# Time Field

`STimeField` is a segmented time input: separate editable parts (hours, minutes, and seconds and
AM/PM when needed). It works from the keyboard (arrow keys increment), is localized and respects
the 12/24-hour format. The value is a `Time` (or `CalendarDateTime`/`ZonedDateTime`) from
`@internationalized/date`; it is built on `SFormField`. The time counterpart of
[`SDateField`](./date-field). Keep the value in a
[`shallowRef`](./date-field#value-and-shallowref), not a `ref`: a regular `ref` unwraps the date
class, and type checking no longer recognizes it as a `DateValue`.
Pasting into a segment fills the whole value, such as `09:30` or `9:30 PM`. A typed time outside
`min-value`/`max-value` marks the field invalid (red frame and `aria-invalid`).

## Basic usage

<script setup>
import { shallowRef } from 'vue'
import { Time, parseTime } from '@internationalized/date'
import { required } from '@smalt-ui/core'
const meeting = shallowRef()
const workingHours = (v) => !v || (v.hour >= 9 && v.hour < 18) || 'Pick a time between 9 AM and 6 PM'
const time = shallowRef(parseTime('14:30'))
const empty = shallowRef()
</script>

<Demo>
  <ClientOnly>
    <STimeField v-model="time" label="Appointment time" />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { shallowRef } from 'vue'
import { parseTime } from '@internationalized/date'
const time = shallowRef(parseTime('14:30'))
</script>

<template>
  <STimeField
    v-model="time"
    label="Appointment time"
  />
</template>
```

  </template>
</Demo>

## 12-hour format and seconds

<Demo>
  <ClientOnly>
    <STimeField v-model="empty" label="12-hour format" :hour-cycle="12" locale="en-US" />
    <STimeField v-model="empty" label="With seconds" granularity="second" />
  </ClientOnly>

<template #code>

```vue
<template>
  <STimeField
    label="12-hour format"
    :hour-cycle="12"
    locale="en-US"
  />
  <STimeField
    label="With seconds"
    granularity="second"
  />
</template>
```

  </template>
</Demo>

## Hint and error

`hint` shows helper text below the field, `error` shows an error message and marks the field
invalid.

<Demo>
  <ClientOnly>
    <STimeField v-model="time" label="Start" hint="24-hour format" :hour-cycle="24" />
    <STimeField v-model="empty" label="Start" error="Enter a time" />
  </ClientOnly>

<template #code>

```vue
<template>
  <STimeField
    v-model="time"
    label="Start"
    hint="24-hour format"
    :hour-cycle="24"
  />
  <STimeField
    label="Start"
    error="Enter a time"
  />
</template>
```

  </template>
</Demo>

## States

`disabled` blocks the field, `readonly` prevents changing the segments, `invalid` marks the field
invalid (red border), `required` adds `*` to the label.

<Demo>
  <ClientOnly>
    <STimeField v-model="time" label="Disabled" disabled />
    <STimeField v-model="time" label="Read-only" readonly />
    <STimeField v-model="time" label="Invalid" invalid />
    <STimeField v-model="empty" label="Required" required />
  </ClientOnly>

<template #code>

```vue
<template>
  <STimeField
    v-model="time"
    label="Disabled"
    disabled
  />
  <STimeField
    v-model="time"
    label="Read-only"
    readonly
  />
  <STimeField
    v-model="time"
    label="Invalid"
    invalid
  />
  <STimeField
    v-model="empty"
    label="Required"
    required
  />
</template>
```

  </template>
</Demo>

## Sizes

The `size` prop controls the field height: `sm` (28px), `md` (36px, default) and `lg` (44px).

<Demo>
  <ClientOnly>
    <STimeField v-model="time" label="sm" size="sm" />
    <STimeField v-model="time" label="md" size="md" />
    <STimeField v-model="time" label="lg" size="lg" />
  </ClientOnly>

<template #code>

```vue
<template>
  <STimeField
    v-model="time"
    label="sm"
    size="sm"
  />
  <STimeField
    v-model="time"
    label="md"
    size="md"
  />
  <STimeField
    v-model="time"
    label="lg"
    size="lg"
  />
</template>
```

  </template>
</Demo>

## `prepend` / `append` slots

The `prepend` and `append` slots put content inside the field border — for example, a clock icon.

<Demo>
  <ClientOnly>
    <STimeField v-model="time" label="Leading icon">
      <template #prepend><SIcon icon="clock" :size="16" /></template>
    </STimeField>
    <STimeField v-model="time" label="Trailing icon">
      <template #append><SIcon icon="clock" :size="16" /></template>
    </STimeField>
  </ClientOnly>

<template #code>

```vue
<template>
  <STimeField
    v-model="time"
    label="Leading icon"
  >
    <template #prepend>
      <SIcon
        icon="clock"
        :size="16"
      />
    </template>
  </STimeField>

  <STimeField
    v-model="time"
    label="Trailing icon"
  >
    <template #append>
      <SIcon
        icon="clock"
        :size="16"
      />
    </template>
  </STimeField>
</template>
```

  </template>
</Demo>

## Leaving the field

The field has `focus` and `blur` events, like [`SInput`](/components/input). Moving between
segments does not count as leaving — see the details on the
[`SDatePicker` page](/components/date-picker#leaving-the-field). To check the value when the user
leaves the field, pass `rules`: see [Validation](#validation) below.

## Validation

`rules` checks the time when focus leaves the field; moving between the segments does not count.
The rules receive the `v-model` value, a `Time` (or `CalendarDateTime`/`ZonedDateTime`, whatever
the model holds), or `undefined` while the time is not complete: `required()` fails on it, and your
own rules should let it pass (`!v || …`). See the [Validation](/guide/validation) guide for the
details.

Type 7:30 PM and leave the field.

<Demo>
  <ClientOnly>
    <STimeField
      v-model="meeting"
      label="Meeting time"
      :rules="[required(), workingHours]"
    />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import type { Time } from '@internationalized/date'
import { required, type SRule } from '@smalt-ui/core'

const meeting = shallowRef<Time>()
const workingHours: SRule<Time | undefined> = (v) =>
  !v || (v.hour >= 9 && v.hour < 18) || 'Pick a time between 9 AM and 6 PM'
</script>

<template>
  <STimeField
    v-model="meeting"
    label="Meeting time"
    :rules="[required(), workingHours]"
  />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="STimeField" />
