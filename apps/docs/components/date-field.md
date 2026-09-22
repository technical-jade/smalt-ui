# Date Field

`SDateField` is a segmented date input: separate editable parts (month, day, year) instead of free
text. This rules out ambiguous formats and parsing errors, works from the keyboard (arrows
increment, typing digits fills the segment), and is localized. The value is a `DateValue` from
`@internationalized/date`; the field is built on `SFormField` (label, hint, error message).
Pasting into a segment fills the whole value: ISO 8601 (`2024-03-15`, `2024-03-15T09:30`), the
numeric date format of the locale (`03/15/2024` in en-US, `15/03/2024` in en-GB) and times like
`9:30 PM`. A typed value outside `min-value`/`max-value` marks the field invalid (red frame and
`aria-invalid`).

## Value and shallowRef

Keep the date in a `shallowRef`, not a `ref`. A regular `ref` unwraps the value through
`UnwrapRef`: the `CalendarDate` class is turned into a structural type, the private field is lost,
and `vue-tsc` no longer recognizes it as a `DateValue` —
`TS2322: Type '{ readonly calendar: … }' is not assignable to type 'DateValue'`. Narrowing the ref
itself (`ref<CalendarDate>`) does not help: it is unwrapped anyway. `shallowRef` stores the value
as is, and a date does not need deep reactivity anyway, since it is replaced as a whole.

## Basic usage

<script setup>
import { shallowRef } from 'vue'
import { CalendarDate, parseDate, parseDateTime } from '@internationalized/date'
const date = shallowRef(parseDate('2026-07-11'))
const empty = shallowRef()
const dateTime = shallowRef(parseDateTime('2026-07-11T14:30'))
</script>

<Demo>
  <ClientOnly>
    <SDateField v-model="date" label="Delivery date" />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { shallowRef } from 'vue'
import { parseDate } from '@internationalized/date'
const date = shallowRef(parseDate('2026-07-11'))
</script>

<template>
  <SDateField
    v-model="date"
    label="Delivery date"
  />
</template>
```

  </template>
</Demo>

## Empty field, hint, and error message

<Demo>
  <ClientOnly>
    <SDateField v-model="empty" label="Date of birth" hint="Format MM/DD/YYYY" />
    <SDateField v-model="empty" label="Date" error="Enter a valid date" />
  </ClientOnly>

<template #code>

```vue
<template>
  <SDateField
    label="Date of birth"
    hint="Format MM/DD/YYYY"
  />
  <SDateField
    label="Date"
    error="Enter a valid date"
  />
</template>
```

  </template>
</Demo>

## States

`disabled` locks the field, `readonly` prevents changing the segments, `invalid` marks the field as
invalid (red border), `required` adds `*` to the label.

<Demo>
  <ClientOnly>
    <SDateField v-model="date" label="Disabled" disabled />
    <SDateField v-model="date" label="Read-only" readonly />
    <SDateField v-model="date" label="Invalid" invalid />
    <SDateField v-model="empty" label="Required" required />
  </ClientOnly>

<template #code>

```vue
<template>
  <SDateField
    v-model="date"
    label="Disabled"
    disabled
  />
  <SDateField
    v-model="date"
    label="Read-only"
    readonly
  />
  <SDateField
    v-model="date"
    label="Invalid"
    invalid
  />
  <SDateField
    v-model="empty"
    label="Required"
    required
  />
</template>
```

  </template>
</Demo>

## Sizes

The `size` prop controls the field height: `sm` (28px), `md` (36px, the default), and `lg` (44px).

<Demo>
  <ClientOnly>
    <SDateField v-model="date" label="sm" size="sm" />
    <SDateField v-model="date" label="md" size="md" />
    <SDateField v-model="date" label="lg" size="lg" />
  </ClientOnly>

<template #code>

```vue
<template>
  <SDateField
    v-model="date"
    label="sm"
    size="sm"
  />
  <SDateField
    v-model="date"
    label="md"
    size="md"
  />
  <SDateField
    v-model="date"
    label="lg"
    size="lg"
  />
</template>
```

  </template>
</Demo>

## Granularity

`granularity` sets the smallest editable segment. The default is `day` for a date; for a value with
time (`CalendarDateTime`) you can go down to `minute` or `second`.

<Demo>
  <ClientOnly>
    <SDateField v-model="dateTime" label="To the minute" granularity="minute" />
    <SDateField v-model="dateTime" label="To the second" granularity="second" />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import { parseDateTime } from '@internationalized/date'
const dateTime = shallowRef(parseDateTime('2026-07-11T14:30'))
</script>

<template>
  <SDateField
    v-model="dateTime"
    label="To the minute"
    granularity="minute"
  />
  <SDateField
    v-model="dateTime"
    label="To the second"
    granularity="second"
  />
</template>
```

  </template>
</Demo>

## `prepend` / `append` slots

The `prepend` and `append` slots insert content inside the field frame, for example a calendar
icon.

<Demo>
  <ClientOnly>
    <SDateField v-model="date" label="Leading icon">
      <template #prepend><SIcon icon="calendar" :size="16" /></template>
    </SDateField>
    <SDateField v-model="date" label="Trailing icon">
      <template #append><SIcon icon="calendar" :size="16" /></template>
    </SDateField>
  </ClientOnly>

<template #code>

```vue
<template>
  <SDateField
    v-model="date"
    label="Leading icon"
  >
    <template #prepend>
      <SIcon
        icon="calendar"
        :size="16"
      />
    </template>
  </SDateField>

  <SDateField
    v-model="date"
    label="Trailing icon"
  >
    <template #append>
      <SIcon
        icon="calendar"
        :size="16"
      />
    </template>
  </SDateField>
</template>
```

  </template>
</Demo>

## Leaving the field

The field emits `focus` and `blur` events, like [`SInput`](/components/input). Moving between
segments does not count as leaving the field — see the details and a validation example on the
[`SDatePicker` page](/components/date-picker#leaving-the-field).

## API

<ApiTable name="SDateField" />
