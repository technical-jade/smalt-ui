---
'@smalt-ui/core': patch
---

Floating labels no longer overlap leading content or get cut off too early.

- A resting floating label sits after the text in `#prepend` or `prefix`, however wide it is, and follows it when that width changes, including a `#prepend` that appears after mount. This covers `SInput`, `STextarea`, `SSelect`, `SAutocomplete`, `SColorField`, `SDateField`, `STimeField`, `SDatePicker` and `SDateRangePicker`. The offset used to fit only an icon, and `SDatePicker` and `SDateRangePicker` had none.
- A floated label is cut off with an ellipsis only when it does not fit into the frame at its reduced size. The width limit used to count the unscaled label, so in a narrow field it was cut with a quarter of the width to spare, and leading content narrowed it although the floated label sits on the border above it. `SNumberField` had no limit at all, and a long label ran past the frame.
