---
'@smalt-ui/core': minor
---

Add built-in form validation.

- `SForm` renders a `<form novalidate>`, checks every field on submit, moves focus to the first invalid field and emits `submit` only when the form is valid (`invalid` otherwise). Without a `submit` listener a valid form is submitted natively. `v-model` reports validity (`true`, `false` or `null`), the default slot exposes `valid`, `validating`, `errors`, `validate` and `resetValidation`, and `validate()`/`resetValidation()` are available through a template ref.
- The form fields take `rules`: functions of the value that return `true` or an error text, synchronously or as a Promise. `validate-on` sets when a field checks: `blur` (default; then on every change while an error is shown), `input` or `submit`. It is set on `SForm` or on a field, and through prop defaults. The `error` prop still wins over the rules. This applies to `SInput`, `STextarea`, `SSelect`, `SAutocomplete`, `SNumberField`, `SPinInput`, `SSlider`, `SColorField`, `SDateField`, `STimeField`, `SDatePicker`, `SDateRangePicker`, `SCheckbox`, `SRadioGroup`, `SSwitch` and `SRating`; each of them provides `validate()`, `resetValidation()` and `focus()` through a template ref.
- Built-in rules `required`, `minLength`, `maxLength`, `min`, `max`, `pattern` and `email`, with default texts in `SMessages` (`ruleRequired` and nine more keys). `min` and `max` also accept a numeric string (the value of a numeric `SInput`) and let an array pass, so a range `SSlider` needs a rule of its own. `required` treats a date range with both ends missing as empty, while a range with only one end is not empty for `required()`; `isEmptyValue` exposes the check for custom rules.
- `schemaRule` turns a Standard Schema (Zod, Valibot, ArkType) into a rule.
- `useValidation` connects a custom control to `SForm`.
- `SFormField` exposes `controlId`, the id it gives the control, through a template ref.
- `SSwitch` and `SRating` get `hint`, `error` and `invalid`. The consumer's `class` and `style` on them now land on the field wrapper, as on `SCheckbox`: a selector such as `.my-switch.s-switch` or `.parent > .s-switch` no longer matches. The generated id of `SSwitch` changes from `s-switch-…` to `s-field-…`. An invalid switch gets a red track border, an invalid rating red empty stars. A rating is `0` until the user picks one, and `0` is not empty, so require a rating with `min(1)`; a `readonly` rating is still validated.
- An invalid `SCheckbox` gets a red box border, and an invalid `SRadioGroup` red radio circles.
- Fix `SSelect` not emitting `focus` and `blur` when its list is opened with the mouse: Reka Select moves focus straight into the list, so neither event fired and validation on blur never ran. Now `focus` fires as soon as focus enters the field or its list, and `blur` fires once focus has left both, whichever way the list was opened. Moving between the field and its open list still emits nothing.
