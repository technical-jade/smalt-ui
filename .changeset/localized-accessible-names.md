---
'@smalt-ui/core': minor
---

Accessible names that Reka hardcodes in English now come from the locale dictionary. New `SMessages` keys: `calendar` (calendar grids of `SCalendar`, `SDatePicker`, `SDateRangePicker`, overridable with the new `calendarLabel` prop), `pagination` (the `SPagination` landmark, prop `ariaLabel`), `pinCell` (`SPinInput` cells, a `{index}`/`{length}` template, prop `cellLabel`) and `notification` (the word announced before each toast). `ToastProvider`'s `label` and the `notifications` key now name the notification region, as documented, instead of prefixing every announcement.
