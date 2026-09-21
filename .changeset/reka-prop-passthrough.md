---
'@smalt-ui/core': minor
---

More Reka behavior is reachable through props. `SAccordion`, `SAccordionItem`, `SCollapsible` and `STabs` get `unmountOnHide`: `false` keeps hidden content mounted, so nested fields keep their state and page search finds collapsed text. `STabs` gets `activationMode` (`manual` moves focus with the arrow keys without opening the tab). `SHoverCard` gets `enableTouch` to open on tap. `SRating` previews the rating under the pointer. `SDatePicker` now closes the calendar once a day is picked; the new `closeOnSelect` prop set to `false` keeps it open as before.
