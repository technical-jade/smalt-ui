---
'@smalt-ui/core': minor
---

Overlay animation, touch-friendly hover and new component options.

- Hover highlights (`:hover`) of all components apply only on devices that can hover (`@media (hover: hover)`), so they no longer stick after a tap on a touch screen. Pressed and keyboard highlights are unchanged. The new SCSS mixin `tools.hover` wraps your own hover rules the same way.
- `SDialog`, `SAlertDialog` and `SDrawer` animate opening and closing: the window fades in with a slight zoom, the drawer slides in from its side, and the overlay fades. With `prefers-reduced-motion: reduce` there is no animation.
- `SDrawer` gets a `width` prop for `left`/`right` drawers and a `height` prop for `top`/`bottom` ones, plus the `--s-drawer-size` variable; a number means pixels, and the prop for the other axis is ignored. `100%` opens the drawer across the whole screen. A drawer never grows past the screen, and one that fills it loses its rounded corners and the border on the page side.
- `SAutocomplete`: the suggestion panel is as wide as the field, long suggestions wrap, and the panel never goes past the window edge. The new `max-width` prop lets the panel grow wider than the field up to a limit. The new `open-on-click` and `open-on-focus` props open the panel with a click on the field and when focus enters it; focus moved by code (the clear button, `SForm` moving to the first error) leaves it closed. The new `floating-label` prop (off by default) turns on a floating label, and a `floatingLabel` default in `global` now reaches it.
- `SNumberField`: the new `floating-label` prop (off by default) puts the label on the top edge of the frame, so the field lines up with neighboring fields that have a floating label; a `floatingLabel` default in `global` now reaches it. The label and the frame share a new `.s-number-field__wrap` wrapper around `.s-number-field__control`.
- `SNavigationMenu`: the panel opens under the item that opened it, and the new `align` prop (`start`/`center`/`end`, `start` by default) picks the alignment. The panel keeps the dropdown `z-index`, so blocks further down the page no longer cover it, and a flex parent that stretches the menu no longer moves it down. New `size` (`sm`/`md`/`lg`) and `columns` props and `--s-navigation-menu-*` variables; density presets reach `size`. Items and panel links take `target` and `rel`.
