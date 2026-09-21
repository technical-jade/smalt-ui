---
'@smalt-ui/core': minor
---

Better defaults. `STabs` without a value shows the first enabled tab instead of an empty panel. `SToggleGroup` gets `mandatory`: in `single` mode a click on the active item keeps it selected. `SBreadcrumb` marks `aria-current="page"` only on the current item: the new `current` field sets it explicitly, and otherwise the last item is current only when it has no `href`. A last item with `href` stays a link. Items without `href` that are not current use the new muted `s-breadcrumb__text` class instead of `s-breadcrumb__current`. `SAspectRatio` gets `square` to remove the border radius.
