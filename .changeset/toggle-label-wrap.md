---
'@smalt-ui/core': patch
---

`SToggle` and `SToggleGroup` items: a long label in a narrow container wraps, and the toggle grows in height instead of letting the second line out of its frame. The size height (`sm` 32px, `md` 40px, `lg` 48px) is now a minimum; a single-line toggle and an icon toggle look as before. In `SToggleGroup` the other items take the height of the wrapped one.
