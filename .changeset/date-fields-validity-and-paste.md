---
'@smalt-ui/core': minor
---

Date and time fields. `SDateField`, `STimeField`, `SDatePicker` and `SDateRangePicker` mark a typed value outside `minValue`/`maxValue` as invalid (frame and `aria-invalid`), as the segments already did. Pasting into a segment now fills the whole value: ISO 8601 (`2024-03-15`, `2024-03-15T09:30`, a `start/end` interval for ranges), the numeric format of the locale (`03/15/2024` in en-US, `15/03/2024` in en-GB) and times like `9:30 PM`. `SCalendar` gets `v-model:placeholder`, the month shown, which also keeps server-rendered markup stable when there is no value.
