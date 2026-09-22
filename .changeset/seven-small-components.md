---
'@smalt-ui/core': minor
---

Seven components for gaps every reference library already covers. `SButtonGroup` joins buttons into
one control and passes `size`/`variant`/`color` down as prop defaults, so a button set explicitly
still wins. `SKbd` renders a keyboard key, mapping names like `meta` or `enter` to their symbols and
keeping the spelled-out name for screen readers. `SEmptyState` is the "nothing here" placeholder
(icon or image, title, description, actions). `STimeline` shows a feed of events from `items`, with
`v-model` marking the current one and everything before it as completed. `SScrollArea` wraps Reka's
scroll area for overlay scrollbars that look the same in every browser. `SImage` adds lazy loading,
a skeleton placeholder, an error fallback and `ratio` through `SAspectRatio`. `SBackTop` is the
floating button that returns a page — or any scrollable container — to the top.
