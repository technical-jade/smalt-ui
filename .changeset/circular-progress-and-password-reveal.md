---
'@smalt-ui/core': minor
---

`SProgress` gains a circular form: `circular` draws a ring instead of a bar, `thickness` sets the
stroke width, `show-value` puts the percentage in the middle, and the default slot replaces it with
your own content. The ring keeps the same ARIA as the bar, including the indeterminate state.
`SInput` gains `revealable`, a trailing button that shows and hides a password value; its accessible
name comes from the `showPassword`/`hidePassword` messages and can be overridden per instance.
