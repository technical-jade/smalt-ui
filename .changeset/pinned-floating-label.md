---
'@smalt-ui/core': minor
---

Pinned floating label and a dimmed select placeholder.

- `floating-label="pinned"` on the fields with a floating label (`SInput`, `STextarea`, `SSelect`, `SAutocomplete`, `SColorField`, `SDateField`, `STimeField`, `SDatePicker`, `SDateRangePicker`, `STimePicker`, `SNumberField`): the label always sits on the frame, and the placeholder of an empty field stays visible. `SNumberField` keeps its label on the frame anyway, so `'pinned'` works there like `true`. `floatingLabel: 'pinned'` in `global` defaults pins the label on all these fields.
- `SSelect`: the placeholder of a single select is dimmed like the placeholders of other fields instead of taking the value color.
