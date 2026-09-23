# Time Picker

`STimePicker` is a time field with a panel: the segmented input of
[`STimeField`](./time-field) plus a button that opens columns of hours, minutes, seconds and
AM/PM to pick from. It is the time counterpart of [`SDatePicker`](./date-picker) — use
`STimeField` when typing is enough, and `STimePicker` when the value should also be pickable
from a list. The value is a `Time` (or `CalendarDateTime`/`ZonedDateTime`) from
`@internationalized/date`; keep it in a
[`shallowRef`](./date-field#value-and-shallowref), not a `ref`. Picking from the panel keeps the
class the value already had: a `Time` stays a `Time`, and a date-time keeps its date.

Every field prop of `STimeField` is forwarded (`label`, `hint`, `error`, `size`, `disabled`,
`readonly`, `required`, `invalid`, `square`, `locale`, `rules`, `validate-on`), and the field
still accepts typing into the segments.

**Keyboard and accessibility.** The trigger button carries `aria-expanded` and `aria-haspopup`;
opening it moves focus to the hour column. Each column is a `listbox` of `option`s named after
its unit in the field's locale, and the current value is marked `aria-selected` and scrolled into
view. <kbd>↑</kbd>/<kbd>↓</kbd> move inside a column, <kbd>Home</kbd>/<kbd>End</kbd> jump to its
first and last entry, <kbd>←</kbd>/<kbd>→</kbd> cross to the neighbouring column,
<kbd>Enter</kbd> or <kbd>Space</kbd> picks, and <kbd>Esc</kbd> closes the panel and returns focus
to the field. Entries outside `min-value`/`max-value` are disabled and skipped by the arrows.

## Basic usage

<script setup>
import { shallowRef } from 'vue'
import { Time, parseTime } from '@internationalized/date'
import { required } from '@smalt-ui/core'
const appointment = shallowRef(parseTime('09:30'))
const empty = shallowRef()
const shift = shallowRef()
const withSeconds = shallowRef(parseTime('12:05:30'))
const delivery = shallowRef()
const booking = shallowRef()
const submitted = shallowRef('')
function onSubmit() {
  submitted.value = String(booking.value)
}
</script>

<Demo>
  <ClientOnly>
    <STimePicker v-model="appointment" label="Appointment time" />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { shallowRef } from 'vue'
import { parseTime } from '@internationalized/date'
const appointment = shallowRef(parseTime('09:30'))
</script>

<template>
  <STimePicker
    v-model="appointment"
    label="Appointment time"
  />
</template>
```

  </template>
</Demo>

## 12-hour cycle

`hour-cycle` fixes the clock the field and the panel use. Left out, it follows the locale: a
12-hour locale gets an AM/PM column, a 24-hour one lists the hours from `00` to `23`.

<Demo>
  <ClientOnly>
    <STimePicker v-model="empty" label="12-hour cycle" :hour-cycle="12" locale="en-US" />
    <STimePicker v-model="empty" label="24-hour cycle" :hour-cycle="24" locale="en-GB" />
  </ClientOnly>

<template #code>

```vue
<template>
  <STimePicker
    label="12-hour cycle"
    :hour-cycle="12"
    locale="en-US"
  />
  <STimePicker
    label="24-hour cycle"
    :hour-cycle="24"
    locale="en-GB"
  />
</template>
```

  </template>
</Demo>

## Step and granularity

`minute-step` and `second-step` thin out the entries the panel offers; `granularity` decides how
far the value goes and therefore which columns are drawn — `hour` leaves the hours alone,
`second` adds a seconds column.

<Demo>
  <ClientOnly>
    <STimePicker v-model="shift" label="Every 15 minutes" :minute-step="15" />
    <STimePicker v-model="withSeconds" label="With seconds" granularity="second" :second-step="10" />
    <STimePicker v-model="empty" label="Whole hours" granularity="hour" />
  </ClientOnly>

<template #code>

```vue
<template>
  <STimePicker
    v-model="shift"
    label="Every 15 minutes"
    :minute-step="15"
  />
  <STimePicker
    v-model="withSeconds"
    label="With seconds"
    granularity="second"
    :second-step="10"
  />
  <STimePicker
    label="Whole hours"
    granularity="hour"
  />
</template>
```

  </template>
</Demo>

## Allowed range

`min-value` and `max-value` disable the entries outside the range and mark a typed time outside
it invalid. The minutes are read against the hour that is already picked, so they open up once
the hour is inside the range.

<Demo>
  <ClientOnly>
    <STimePicker
      v-model="delivery"
      label="Delivery window"
      hint="Between 09:30 and 17:00"
      :min-value="new Time(9, 30)"
      :max-value="new Time(17, 0)"
      :minute-step="10"
    />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { shallowRef } from 'vue'
import { Time } from '@internationalized/date'
const delivery = shallowRef()
</script>

<template>
  <STimePicker
    v-model="delivery"
    label="Delivery window"
    hint="Between 09:30 and 17:00"
    :min-value="new Time(9, 30)"
    :max-value="new Time(17, 0)"
    :minute-step="10"
  />
</template>
```

  </template>
</Demo>

## Validation

`rules` run when focus leaves the field; picking from the panel does not count as leaving it. The
rules receive the `v-model` value, a time or `undefined` while the field is empty: `required()`
fails on it, and your own rules should let it pass (`!v || …`). `SForm` collects the field,
blocks a submission that fails and focuses the first segment of the first invalid field. See the
[Validation](/guide/validation) guide for the details.

<Demo>
  <ClientOnly>
    <SForm
      style="display: grid; gap: 16px; width: 100%; max-width: 320px"
      @submit="onSubmit"
    >
      <STimePicker
        v-model="booking"
        label="Booking time"
        name="booking"
        :minute-step="30"
        :rules="[required()]"
      />
      <div style="display: flex; align-items: center; gap: 8px">
        <SButton type="submit">Book</SButton>
        <span v-if="submitted">Submitted: {{ submitted }}</span>
      </div>
    </SForm>
  </ClientOnly>

<template #code>

```vue
<script setup>
import { shallowRef } from 'vue'
import { required } from '@smalt-ui/core'
const booking = shallowRef()
</script>

<template>
  <SForm @submit="onSubmit">
    <STimePicker
      v-model="booking"
      label="Booking time"
      name="booking"
      :minute-step="30"
      :rules="[required()]"
    />
    <SButton type="submit"> Book </SButton>
  </SForm>
</template>
```

  </template>
</Demo>

## States and shape

`disabled` blocks the field and the button, `readonly` keeps the value as it is and does not open
the panel, `square` removes the rounding of both the field and the panel, and `flat`/`elevation`
control the shadow of the panel.

<Demo>
  <ClientOnly>
    <STimePicker v-model="appointment" label="Disabled" disabled />
    <STimePicker v-model="appointment" label="Read-only" readonly />
    <STimePicker v-model="appointment" label="Square" square />
    <STimePicker v-model="appointment" label="Flat panel" flat />
  </ClientOnly>

<template #code>

```vue
<template>
  <STimePicker
    v-model="appointment"
    label="Disabled"
    disabled
  />
  <STimePicker
    v-model="appointment"
    label="Read-only"
    readonly
  />
  <STimePicker
    v-model="appointment"
    label="Square"
    square
  />
  <STimePicker
    v-model="appointment"
    label="Flat panel"
    flat
  />
</template>
```

  </template>
</Demo>

## API

<ApiTable name="STimePicker" />
