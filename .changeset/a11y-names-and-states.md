---
'@smalt-ui/core': minor
---

Accessibility fixes. A disabled `SCard` rendered as a button or link no longer takes focus or activates from the keyboard. `SFormField` announces an error when it appears (a polite live region). `SPopover`'s `ariaLabel` now names the panel; before, Reka's `aria-labelledby` to the trigger took precedence. `SSeparator` gets its accessible name from a label passed through the slot, and `decorative` now applies to a labeled separator. `SSplitter` handles have an accessible name (new `resize` key in `SMessages`, `handleLabel` prop) and `aria-orientation`, and Enter collapses and restores a `collapsible` panel.
