---
'@smalt-ui/core': patch
---

The close buttons of `SAlert`, `SToast`, `SDialog` and `SDrawer` and the selected-option mark of `SSelect` draw `SIcon` (`x`, `check`) instead of the `×`/`✓` text glyphs, so they no longer depend on the host font and follow icons replaced through `registerIcons`.
