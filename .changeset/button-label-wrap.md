---
'@smalt-ui/core': patch
---

- `SButton`: a long label in a narrow container wraps, and the button grows in height instead of letting the second line out of its frame onto the neighboring content. The size height (`sm` 32px, `md` 40px, `lg` 48px) is now a minimum; a single-line button looks as before and keeps its own height next to a taller neighbor in a flex or grid row.
- `SButtonGroup`: when a label of an attached horizontal group wraps, the other buttons take its height, so the shared edges still meet.
