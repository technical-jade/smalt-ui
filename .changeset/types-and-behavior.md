---
'@smalt-ui/core': minor
---

Behavior fixes. `SAccordion` and `SToggleGroup` without `type` take the mode from `v-model`: an array selects several items instead of being replaced by a string on the first click. `SPinInput` keeps its model and `complete` value as strings also with `type="number"`, as its type promises. `SColorField` clears the value when the erased text is committed with Enter, not only on blur. `SSplitter` keys its panels by name, so removing a panel no longer hands its size to the next one. Toasts from `useToast()` follow the `SToast` defaults (`variant`, `duration`); `ToastProvider` has no own `duration` default any more, and entries in the queue keep `variant` unset unless it was passed. `ToastProvider` and `ConfirmProvider` report a second mounted instance through the development-only warning, so production consoles stay quiet.
