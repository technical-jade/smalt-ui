---
'@smalt-ui/core': minor
---

Overlays and small gaps. Long `SDialog` content scrolls in the body, and the title, footer actions and close button stay in view. `SPopover` fits the space left on screen and scrolls long content. `SToast` announces `negative` toasts assertively and the rest politely, as `SAlert` does. A `closable` `SAlert` hides itself on close; the new `v-model:visible` shows it again, and `close` is still emitted. `SAlertDialog` and `useConfirm()` get `initialFocus` (`cancel` by default, `confirm` or `none`). `SIcon` takes a CSS length in `size`, such as `1em`.
