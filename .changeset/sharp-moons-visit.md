---
'@smalt-ui/core': patch
---

`SAutocomplete` keeps the typed text when focus leaves the field without a suggestion being picked,
and when the panel is closed and opened again. The text is replaced by the label of a picked
suggestion and emptied when the value is cleared; in both cases the component also empties
`v-model:search`, so a query the user can no longer see does not stay behind.
