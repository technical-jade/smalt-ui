# Date Range Picker

`SDateRangePicker` picks a date range — a start and an end — with a single field and a pair of
months in the calendar. Days in between are highlighted, the range ends are filled with the accent
color. Like [`SDatePicker`](./date-picker), it is built on `SFormField` and opens the calendar in a
portal. The value is a `{ start, end }` object with `DateValue` dates from
`@internationalized/date`. Keep the value in a [`shallowRef`](./date-field#value-and-shallowref),
not a `ref`: a regular `ref` unwraps the date class, and type checking no longer recognizes it as a
`DateValue`.
Pasting into a segment fills the whole value: ISO 8601 (`2024-03-15`, a `2024-03-15/2024-03-20` interval), the
numeric date format of the locale (`03/15/2024` in en-US, `15/03/2024` in en-GB) and times like
`9:30 PM`. A typed value outside `min-value`/`max-value` marks the field invalid (red frame and
`aria-invalid`).

## Basic usage

<script setup>
import { shallowRef } from 'vue'
import { parseDate, today, getLocalTimeZone } from '@internationalized/date'
const range = shallowRef({ start: parseDate('2026-07-11'), end: parseDate('2026-07-20') })
const empty = shallowRef()
const min = today(getLocalTimeZone())
const max = parseDate('2026-07-31')
const noWeekends = (value) => {
  const day = value.toDate(getLocalTimeZone()).getDay()
  return day === 0 || day === 6
}
</script>

<Demo>
  <ClientOnly>
    <SDateRangePicker v-model="range" label="Booking period" />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { shallowRef } from 'vue'
import { parseDate } from '@internationalized/date'
const range = shallowRef({ start: parseDate('2026-07-11'), end: parseDate('2026-07-20') })
</script>

<template>
  <SDateRangePicker
    v-model="range"
    label="Booking period"
  />
</template>
```

  </template>
</Demo>

## Hint, error message, and date limits

<Demo>
  <ClientOnly>
    <SDateRangePicker v-model="empty" label="Trip dates" hint="Future dates only" :min-value="min" />
    <SDateRangePicker v-model="empty" label="Period" error="Select a range" />
  </ClientOnly>

<template #code>

```vue
<template>
  <SDateRangePicker
    label="Trip dates"
    hint="Future dates only"
    :min-value="min"
  />
  <SDateRangePicker
    label="Period"
    error="Select a range"
  />
</template>
```

  </template>
</Demo>

## Sizes

The `size` prop changes the field height: `sm` (28px), `md` (36px, the default), or `lg` (44px).

<Demo>
  <ClientOnly>
    <SDateRangePicker v-model="range" label="sm" size="sm" />
    <SDateRangePicker v-model="range" label="md" size="md" />
    <SDateRangePicker v-model="range" label="lg" size="lg" />
  </ClientOnly>

<template #code>

```vue
<template>
  <SDateRangePicker
    v-model="range"
    label="sm"
    size="sm"
  />
  <SDateRangePicker
    v-model="range"
    label="md"
    size="md"
  />
  <SDateRangePicker
    v-model="range"
    label="lg"
    size="lg"
  />
</template>
```

  </template>
</Demo>

## States

`disabled` locks the field and the calendar, `readonly` prevents changing the value, `required`
adds `*` to the label, `invalid` marks the field as invalid without an error text.

<Demo>
  <ClientOnly>
    <SDateRangePicker v-model="range" label="Disabled" disabled />
    <SDateRangePicker v-model="range" label="Read-only" readonly />
    <SDateRangePicker v-model="empty" label="Required" required />
    <SDateRangePicker v-model="empty" label="Invalid" invalid />
  </ClientOnly>

<template #code>

```vue
<template>
  <SDateRangePicker
    v-model="range"
    label="Disabled"
    disabled
  />
  <SDateRangePicker
    v-model="range"
    label="Read-only"
    readonly
  />
  <SDateRangePicker
    v-model="empty"
    label="Required"
    required
  />
  <SDateRangePicker
    v-model="empty"
    label="Invalid"
    invalid
  />
</template>
```

  </template>
</Demo>

## Date limits

`maxValue` sets the upper bound of the range, and the `isDateDisabled` predicate disables arbitrary
days (weekends in the example). Disabled days cannot be clicked in the calendar.

<Demo>
  <ClientOnly>
    <SDateRangePicker v-model="empty" label="No later than end of July" :max-value="max" />
    <SDateRangePicker v-model="empty" label="Weekdays only" :is-date-disabled="noWeekends" />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import { parseDate, getLocalTimeZone } from '@internationalized/date'

const empty = shallowRef()
const max = parseDate('2026-07-31')
const noWeekends = (value) => {
  const day = value.toDate(getLocalTimeZone()).getDay()
  return day === 0 || day === 6
}
</script>

<template>
  <SDateRangePicker
    v-model="empty"
    label="No later than end of July"
    :max-value="max"
  />
  <SDateRangePicker
    v-model="empty"
    label="Weekdays only"
    :is-date-disabled="noWeekends"
  />
</template>
```

  </template>
</Demo>

## Calendar settings

`numberOfMonths` sets how many months are shown at once (2 by default), `weekStartsOn` changes the
first day of the week (1 is Monday), and `fixedWeeks` set to `false` turns off the stable 6-week
grid height. The effect is visible with the calendar open.

<Demo>
  <ClientOnly>
    <SDateRangePicker v-model="empty" label="One month" :number-of-months="1" />
    <SDateRangePicker v-model="empty" label="Three months" :number-of-months="3" />
    <SDateRangePicker v-model="empty" label="Week starts on Monday" :week-starts-on="1" :fixed-weeks="false" />
  </ClientOnly>

<template #code>

```vue
<template>
  <SDateRangePicker
    v-model="empty"
    label="One month"
    :number-of-months="1"
  />
  <SDateRangePicker
    v-model="empty"
    label="Three months"
    :number-of-months="3"
  />
  <SDateRangePicker
    v-model="empty"
    label="Week starts on Monday"
    :week-starts-on="1"
    :fixed-weeks="false"
  />
</template>
```

  </template>
</Demo>

## `prepend` / `append` slots

The `prepend` and `append` slots add content inside the field frame, such as an icon or a button,
next to the standard calendar trigger.

<Demo>
  <ClientOnly>
    <SDateRangePicker v-model="empty" label="With an icon">
      <template #prepend><SIcon icon="calendar" :size="16" /></template>
    </SDateRangePicker>
    <SDateRangePicker v-model="empty" label="With a button">
      <template #append><SButton size="sm" variant="ghost" icon="info" aria-label="Help" /></template>
    </SDateRangePicker>
  </ClientOnly>

<template #code>

```vue
<template>
  <SDateRangePicker
    v-model="empty"
    label="With an icon"
  >
    <template #prepend>
      <SIcon
        icon="calendar"
        :size="16"
      />
    </template>
  </SDateRangePicker>

  <SDateRangePicker
    v-model="empty"
    label="With a button"
  >
    <template #append>
      <SButton
        size="sm"
        variant="ghost"
        icon="info"
        aria-label="Help"
      />
    </template>
  </SDateRangePicker>
</template>
```

  </template>
</Demo>

## Leaving the field

The field emits `focus` and `blur` events, like [`SInput`](/components/input). Moving between
segments and into the calendar does not count as leaving the field — see the details and a
validation example on the [`SDatePicker` page](/components/date-picker#leaving-the-field).

## API

<ApiTable name="SDateRangePicker" />
