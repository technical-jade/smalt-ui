---
'@smalt-ui/core': minor
---

Smaller fixes around Reka. `SAvatar` shows its fallback again when `src` is cleared after an image loaded. An empty `SColorField` shows an empty input instead of `#000000`, and erasing the text clears the value. `SProgress` clamps `value` and `max` once, so the announced value matches the bar. `SPinInput` emits `complete` and `SSlider` emits `valueCommit`, both of which were lost. `SPagination` clamps the page when the page count drops. `SToggle` inside `SToggleGroup`'s slot takes the group `size`. `mergeDefaults` (nested `ConfigProvider`) treats an `undefined` value as unset instead of wiping the outer default.
