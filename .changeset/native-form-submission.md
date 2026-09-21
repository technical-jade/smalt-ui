---
'@smalt-ui/core': minor
---

Form controls submit their value with a native `<form>`. `SCheckbox`, `SSwitch`, `SRadioGroup`, `SSlider`, `SSelect`, `SAutocomplete`, `SColorField`, `SNumberField`, `SPinInput`, `SDateField`, `SDatePicker`, `SDateRangePicker` and `STimeField` get a `name` prop, and `required` now takes part in native validation. `SAutocomplete` submits the suggestion's value instead of the input text; `SSelect` with `multiple` submits every selected value; `SDateRangePicker` submits an ISO interval (`start/end`), empty until both ends are set. `SColorField` and `SNumberField` pass attributes other than `class`/`style` to the input; `SNumberField` and `SPinInput` emit `focus`/`blur` for the field as a whole.
