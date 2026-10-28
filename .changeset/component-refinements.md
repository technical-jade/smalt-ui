---
'@smalt-ui/core': minor
---

Overlay animation, touch-friendly hover and new component options.

- Hover highlights (`:hover`) of all components apply only on devices that can hover (`@media (hover: hover)`), so they no longer stick after a tap on a touch screen. Pressed and keyboard highlights are unchanged. The new SCSS mixin `tools.hover` wraps your own hover rules the same way.
- `SDialog`, `SAlertDialog` and `SDrawer` animate opening and closing: the window fades in with a slight zoom, the drawer slides in from its side, and the overlay fades. With `prefers-reduced-motion: reduce` there is no animation.
- `SDrawer` gets a `width` prop for `left`/`right` drawers and a `height` prop for `top`/`bottom` ones, plus the `--s-drawer-size` variable; a number means pixels, and the prop for the other axis is ignored. `100%` opens the drawer across the whole screen. A drawer never grows past the screen, and one that fills it loses its rounded corners and the border on the page side.
