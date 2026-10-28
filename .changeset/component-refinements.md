---
'@smalt-ui/core': minor
---

Overlay animation, touch-friendly hover and new component options.

- Hover highlights (`:hover`) of all components apply only on devices that can hover (`@media (hover: hover)`), so they no longer stick after a tap on a touch screen. Pressed and keyboard highlights are unchanged. The new SCSS mixin `tools.hover` wraps your own hover rules the same way.
- `SDialog`, `SAlertDialog` and `SDrawer` animate opening and closing: the window fades in with a slight zoom, the drawer slides in from its side, and the overlay fades. With `prefers-reduced-motion: reduce` there is no animation.
