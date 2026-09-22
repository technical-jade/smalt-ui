---
'@smalt-ui/core': patch
---

`SScrollArea` scrolls when its size comes from `max-height`. The cap sat on the root, which then had
no definite height to hand to the viewport: the viewport grew with the content and the root simply
clipped it, leaving a cut-off region with no scrollbar.
