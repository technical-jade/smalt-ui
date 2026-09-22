---
'@smalt-ui/core': patch
---

`SAspectRatio` in a grid or flex row next to a taller item keeps all four corners rounded: the shape is set on the ratio box rather than on the root, which stretches to the row height.
