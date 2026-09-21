---
'@smalt-ui/core': patch
---

Focus no longer falls to `<body>`. The clear button of `SInput`, `SAutocomplete` and `SSelect` returns focus to the control. Tab out of a non-modal `SDropdownMenu` or `SContextMenu` closes the menu and moves on from the element that opened it. Home and End move the caret in a searchable `SSelect` instead of jumping through the list.
