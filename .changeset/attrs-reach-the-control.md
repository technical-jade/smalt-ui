---
'@smalt-ui/core': minor
---

Fallthrough attributes and listeners now reach the element that uses them. `SPopover`, `SHoverCard`, `STooltip`, `SDropdownMenu`, `SContextMenu` and `SAlertDialog` put them on the panel instead of losing them. `SSelect`, `SCheckbox` and `SSwitch` keep `class`/`style` on the outer field and pass the rest to the control; `SSelect` emits `focus`/`blur` for the field as a whole. `SCheckbox`, `SSwitch` and `SSlider` get an `ariaLabel` prop for controls without a visible label. `SAspectRatio` renders its own outer element, so `class`/`style` size the whole box, and falls back to 1:1 with a dev warning when `ratio` is not a positive finite number.
