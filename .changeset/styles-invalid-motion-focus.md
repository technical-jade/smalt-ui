---
'@smalt-ui/core': patch
---

Style fixes. `SNumberField` and `SColorField` turn their frame red when invalid, like the other fields. Disabled `outline`/`ghost` link buttons (`as="a"`) no longer light up on hover. The close button of `SToast` shows the focus ring. `SAlertDialog` fits the screen: its description and body scroll while the actions stay in view. The indeterminate `SProgress` and the `SButton` loading spinner slow down under `prefers-reduced-motion`. `SBreadcrumb` resets inherited typography on its root. `SDatePicker` drops a stray `z-index` fallback.
