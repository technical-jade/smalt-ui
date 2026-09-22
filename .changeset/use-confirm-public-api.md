---
'@smalt-ui/core': major
---

`useConfirm()` returns only `{ confirm }`. The queue it used to expose together with `settle` and `clear` belonged to `ConfirmProvider`: any caller could decline or answer somebody else's confirmation. The `SConfirmEntry` type is no longer exported. Code that only calls `confirm()` needs no change.
