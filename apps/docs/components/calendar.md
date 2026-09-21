# Calendar

`SCalendar` is an interactive date grid with month navigation. It is fully keyboard accessible
(arrows move between days, `PageUp`/`PageDown` between months), localized, and marks today, the
selected date, and unavailable dates. The value is a `DateValue` from `@internationalized/date`;
the navigation is built on `SIcon`. To pick a date in a form, use `SDatePicker`, which opens the
calendar in a popover. Keep the value in a [`shallowRef`](./date-field#value-and-shallowref), not
a `ref`: a regular `ref` unwraps the date class, and type checking no longer recognizes it as a
`DateValue`.

## Basic usage

<script setup>
import { shallowRef } from 'vue'
import { parseDate, today, getLocalTimeZone, isWeekend } from '@internationalized/date'
const date = shallowRef(parseDate('2026-07-11'))
const range = shallowRef()
const min = today(getLocalTimeZone())
const max = parseDate('2026-07-20')
const dates = shallowRef([parseDate('2026-07-08'), parseDate('2026-07-15'), parseDate('2026-07-22')])
const twoMonths = shallowRef(parseDate('2026-07-11'))
const weekStart = shallowRef(parseDate('2026-07-11'))
const workday = shallowRef()
const weekend = (d) => isWeekend(d, 'en-US')
</script>

<Demo>
  <ClientOnly>
    <SCalendar v-model="date" />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { shallowRef } from 'vue'
import { parseDate } from '@internationalized/date'
const date = shallowRef(parseDate('2026-07-11'))
</script>

<template>
  <SCalendar v-model="date" />
</template>
```

  </template>
</Demo>

## Limiting the date range

The `minValue`/`maxValue` props (or the `isDateDisabled` predicate) disable unavailable days.

<Demo>
  <ClientOnly>
    <SCalendar v-model="range" :min-value="min" />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { today, getLocalTimeZone } from '@internationalized/date'
const min = today(getLocalTimeZone())
</script>

<template>
  <!-- Past dates cannot be selected -->
  <SCalendar
    v-model="date"
    :min-value="min"
  />
</template>
```

  </template>
</Demo>

## Multiple dates

With the `multiple` prop the calendar lets you pick several dates; `v-model` is then an array of
`DateValue`.

<Demo>
  <ClientOnly>
    <SCalendar v-model="dates" multiple />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import { parseDate } from '@internationalized/date'
const dates = shallowRef([
  parseDate('2026-07-08'),
  parseDate('2026-07-15'),
  parseDate('2026-07-22'),
])
</script>

<template>
  <SCalendar
    v-model="dates"
    multiple
  />
</template>
```

  </template>
</Demo>

## Multiple months

`numberOfMonths` shows several months side by side, which is handy for picking a range.

<Demo>
  <ClientOnly>
    <SCalendar v-model="twoMonths" :number-of-months="2" />
  </ClientOnly>

<template #code>

```vue
<template>
  <SCalendar
    v-model="date"
    :number-of-months="2"
  />
</template>
```

  </template>
</Demo>

## Week settings

`weekStartsOn` sets the first day of the week (0 is Sunday, 1 is Monday). `fixedWeeks` (`true` by
default) keeps the grid at 6 rows; with `false` the height follows the month.

<Demo>
  <ClientOnly>
    <div style="display: flex; gap: 24px; flex-wrap: wrap">
      <SCalendar v-model="weekStart" :week-starts-on="1" />
      <SCalendar v-model="weekStart" :fixed-weeks="false" />
    </div>
  </ClientOnly>

<template #code>

```vue
<template>
  <!-- The week starts on Monday -->
  <SCalendar
    v-model="date"
    :week-starts-on="1"
  />
  <!-- The grid height follows the month -->
  <SCalendar
    v-model="date"
    :fixed-weeks="false"
  />
</template>
```

  </template>
</Demo>

## Unavailable dates

The `isDateDisabled` predicate disables arbitrary days. Here weekends are blocked.

<Demo>
  <ClientOnly>
    <SCalendar v-model="workday" :is-date-disabled="weekend" />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import { isWeekend } from '@internationalized/date'
const workday = shallowRef()
const weekend = (date) => isWeekend(date, 'en-US')
</script>

<template>
  <!-- Weekends cannot be selected -->
  <SCalendar
    v-model="workday"
    :is-date-disabled="weekend"
  />
</template>
```

  </template>
</Demo>

## States and upper bound

`disabled` turns the grid off completely, `readonly` keeps it view-only (no selection), and
`max-value` caps the selection: dates after the maximum are unavailable.

<Demo>
  <ClientOnly>
    <div style="display: flex; flex-wrap: wrap; gap: 24px">
      <SCalendar
        :model-value="date"
        disabled
      />
      <SCalendar
        :model-value="date"
        readonly
      />
      <SCalendar
        v-model="date"
        :max-value="max"
      />
    </div>
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import { parseDate } from '@internationalized/date'
const date = shallowRef(parseDate('2026-07-11'))
const max = parseDate('2026-07-20')
</script>

<template>
  <SCalendar
    v-model="date"
    disabled
  />
  <SCalendar
    v-model="date"
    readonly
  />
  <!-- Dates after July 20 are unavailable -->
  <SCalendar
    v-model="date"
    :max-value="max"
  />
</template>
```

  </template>
</Demo>

## Server rendering

Without a value, the calendar opens on today's month and marks today, both taken from the time
zone where it renders. With SSR the server and the browser can disagree near midnight or across
time zones. Pin the month with `v-model:placeholder` or render the calendar on the client only:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CalendarDate } from '@internationalized/date'

const date = ref<CalendarDate>()
const month = ref(new CalendarDate(2026, 7, 1))
</script>

<template>
  <SCalendar
    v-model="date"
    v-model:placeholder="month"
  />
</template>
```

## API

<ApiTable name="SCalendar" />
