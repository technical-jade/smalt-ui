# Date Picker

`SDatePicker` combines a segmented date input ([`SDateField`](./date-field)) with a popover calendar
([`SCalendar`](./calendar)): the date can be typed on the keyboard or picked with the mouse. It is
built on `SFormField` (label, hint, error message), the navigation uses `SIcon`. The value is a
`DateValue` from `@internationalized/date`. The calendar opens in a portal, so the demos are
wrapped in `<ClientOnly>`. Keep the value in a
[`shallowRef`](./date-field#value-and-shallowref), not a `ref`: a regular `ref` unwraps the date
class, and type checking no longer recognizes it as a `DateValue`.
Pasting into a segment fills the whole value: ISO 8601 (`2024-03-15`, `2024-03-15T09:30`), the
numeric date format of the locale (`03/15/2024` in en-US, `15/03/2024` in en-GB) and times like
`9:30 PM`. A typed value outside `min-value`/`max-value` marks the field invalid (red frame and
`aria-invalid`).
The calendar closes once a day is picked; `:close-on-select="false"` keeps it open.

## Basic usage

<script setup>
import { ref, shallowRef } from 'vue'
import { parseDate, today, getLocalTimeZone } from '@internationalized/date'
import { required } from '@smalt-ui/core'
const date = shallowRef(parseDate('2026-07-11'))
const empty = shallowRef()
const pickup = shallowRef()
const pickupEvents = ref([])
const visit = shallowRef()
const notPast = (v) => !v || v.compare(today(getLocalTimeZone())) >= 0 || 'Pick today or a later date'
const min = today(getLocalTimeZone())
const max = parseDate('2026-07-31')
const noWeekends = (value) => {
  const day = value.toDate(getLocalTimeZone()).getDay()
  return day === 0 || day === 6
}
</script>

<Demo>
  <ClientOnly>
    <SDatePicker v-model="date" label="Delivery date" />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { shallowRef } from 'vue'
import { parseDate } from '@internationalized/date'
const date = shallowRef(parseDate('2026-07-11'))
</script>

<template>
  <SDatePicker
    v-model="date"
    label="Delivery date"
  />
</template>
```

  </template>
</Demo>

## Hint, error message, and date limits

<Demo>
  <ClientOnly>
    <SDatePicker v-model="empty" label="Visit date" hint="Today or later" :min-value="min" />
    <SDatePicker v-model="empty" label="Date" error="This field is required" />
  </ClientOnly>

<template #code>

```vue
<template>
  <SDatePicker
    label="Visit date"
    hint="Today or later"
    :min-value="min"
  />
  <SDatePicker
    label="Date"
    error="This field is required"
  />
</template>
```

  </template>
</Demo>

## Sizes

The `size` prop changes the field height: `sm` (28px), `md` (36px, the default), or `lg` (44px).

<Demo>
  <ClientOnly>
    <SDatePicker v-model="date" label="sm" size="sm" />
    <SDatePicker v-model="date" label="md" size="md" />
    <SDatePicker v-model="date" label="lg" size="lg" />
  </ClientOnly>

<template #code>

```vue
<template>
  <SDatePicker
    v-model="date"
    label="sm"
    size="sm"
  />
  <SDatePicker
    v-model="date"
    label="md"
    size="md"
  />
  <SDatePicker
    v-model="date"
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
    <SDatePicker v-model="date" label="Disabled" disabled />
    <SDatePicker v-model="date" label="Read-only" readonly />
    <SDatePicker v-model="empty" label="Required" required />
    <SDatePicker v-model="empty" label="Invalid" invalid />
  </ClientOnly>

<template #code>

```vue
<template>
  <SDatePicker
    v-model="date"
    label="Disabled"
    disabled
  />
  <SDatePicker
    v-model="date"
    label="Read-only"
    readonly
  />
  <SDatePicker
    v-model="empty"
    label="Required"
    required
  />
  <SDatePicker
    v-model="empty"
    label="Invalid"
    invalid
  />
</template>
```

  </template>
</Demo>

## Date limits

`maxValue` sets the upper bound of the selection, and the `isDateDisabled` predicate disables
arbitrary days (weekends in the example). Disabled days cannot be clicked in the calendar.

<Demo>
  <ClientOnly>
    <SDatePicker v-model="empty" label="No later than end of July" :max-value="max" />
    <SDatePicker v-model="empty" label="Weekdays only" :is-date-disabled="noWeekends" />
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
  <SDatePicker
    v-model="empty"
    label="No later than end of July"
    :max-value="max"
  />
  <SDatePicker
    v-model="empty"
    label="Weekdays only"
    :is-date-disabled="noWeekends"
  />
</template>
```

  </template>
</Demo>

## Calendar settings

`weekStartsOn` changes the first day of the week (1 is Monday), and `fixedWeeks` set to `false`
turns off the stable 6-week grid height. The effect is visible with the calendar open.

<Demo>
  <ClientOnly>
    <SDatePicker v-model="empty" label="Week starts on Monday" :week-starts-on="1" />
    <SDatePicker v-model="empty" label="No fixed 6 weeks" :fixed-weeks="false" />
  </ClientOnly>

<template #code>

```vue
<template>
  <SDatePicker
    v-model="empty"
    label="Week starts on Monday"
    :week-starts-on="1"
  />
  <SDatePicker
    v-model="empty"
    label="No fixed 6 weeks"
    :fixed-weeks="false"
  />
</template>
```

  </template>
</Demo>

## Leaving the field

Like [`SInput`](/components/input), the field emits `focus` and `blur` events. Moving between
segments and into the calendar does not count as leaving: `blur` fires when focus has left both
the field and the open calendar. [`SDateRangePicker`](/components/date-range-picker),
[`SDateField`](/components/date-field), and [`STimeField`](/components/time-field) emit the same
events. To check the date when the user leaves the field, pass `rules` instead of handling `blur`:
see [Validation](#validation) below.

<Demo>
  <ClientOnly>
    <div style="display: grid; gap: 8px">
      <SDatePicker v-model="pickup" label="Pickup date" @focus="pickupEvents.push('focus')" @blur="pickupEvents.push('blur')" />
      <code>events: {{ pickupEvents.join(', ') || 'none' }}</code>
    </div>
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type { DateValue } from '@internationalized/date'

const pickup = shallowRef<DateValue>()
const events = ref<string[]>([])
</script>

<template>
  <SDatePicker
    v-model="pickup"
    label="Pickup date"
    @focus="events.push('focus')"
    @blur="events.push('blur')"
  />
  <code>events: {{ events.join(', ') }}</code>
</template>
```

  </template>
</Demo>

## `prepend` / `append` slots

The `prepend` and `append` slots add content inside the field frame, such as an icon or a button,
next to the standard calendar trigger.

<Demo>
  <ClientOnly>
    <SDatePicker v-model="empty" label="With an icon">
      <template #prepend><SIcon icon="calendar" :size="16" /></template>
    </SDatePicker>
    <SDatePicker v-model="empty" label="With a button">
      <template #append><SButton size="sm" variant="ghost" icon="info" aria-label="Help" /></template>
    </SDatePicker>
  </ClientOnly>

<template #code>

```vue
<template>
  <SDatePicker
    v-model="empty"
    label="With an icon"
  >
    <template #prepend>
      <SIcon
        icon="calendar"
        :size="16"
      />
    </template>
  </SDatePicker>

  <SDatePicker
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
  </SDatePicker>
</template>
```

  </template>
</Demo>

## Validation

`rules` checks the date when focus leaves the field together with its calendar: picking a day
does not count as leaving. The rules receive the `v-model` value, a `DateValue`, or `undefined`
while no complete date is set: `required()` fails on it, and your own rules should let it pass
(`!v || …`). See the [Validation](/guide/validation) guide for the details.

`min-value` greys out the earlier days in the calendar, but a date typed into the segments only
gets a red frame, with no text, and does not fail the check of a form. The rule below gives it a
message. Type a date in the past and leave the field.

<Demo>
  <ClientOnly>
    <SDatePicker
      v-model="visit"
      label="Visit date"
      :rules="[required(), notPast]"
    />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import { getLocalTimeZone, today, type DateValue } from '@internationalized/date'
import { required, type SRule } from '@smalt-ui/core'

const visit = shallowRef<DateValue>()
const notPast: SRule<DateValue | undefined> = (v) =>
  !v || v.compare(today(getLocalTimeZone())) >= 0 || 'Pick today or a later date'
</script>

<template>
  <SDatePicker
    v-model="visit"
    label="Visit date"
    :rules="[required(), notPast]"
  />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SDatePicker" />
