---
'@smalt-ui/core': minor
---

`SButtonGroup`: an attached group of filled buttons casts one shadow that follows the group shape instead of a shadow per button, which fell onto the previous button and stuck out below each shared edge. Filled buttons are split by a thin line in their text color. A group that mixes filled and other variants has no shadow, and a button's own `elevation` still draws its own. The new `flat` and `elevation` props remove the group shadow or set its level; in a detached group they reach every button.
