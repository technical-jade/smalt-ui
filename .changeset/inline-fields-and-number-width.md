---
'@smalt-ui/core': minor
---

Steadier inline fields and a stretchable number field.

- `SCheckbox`, `SSwitch` and `SRating` align to the top of the line instead of the text baseline, so checking a checkbox no longer changes the line height and moves the content below.
- `SNumberField`: the new `stretch` prop spreads the field across its container, with the step buttons at the edges and the input taking the free space. The new `--s-number-field-input-width` CSS variable sets the input width (`4rem` by default).
