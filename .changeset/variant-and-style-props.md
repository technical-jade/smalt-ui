---
'@smalt-ui/core': minor
---

New looks for alerts, tabs, toggles, buttons and separators.

- `SAlert`: the new `appearance` prop, `outline` (default) or `soft`. `soft` draws the background without a border; the icon keeps the status color.
- `STabs`: the new `variant` prop, `underline` (default) or `enclosed`. Enclosed tabs look like folders: the bordered active tab merges with the panel border. The list still scrolls only horizontally.
- `SToggle` and `SToggleGroup`: the new `variant` prop, `tonal` (default) or `outline`. `outline` shows the on state with an accent-colored border and no fill. The group passes its `variant` to every item, including `SToggle`s in the slot; an item's own `variant` wins.
- `SButton`: `variant="link"` renders underlined text without the button height, padding and background, so it fits into a line of text. `size` changes only the font size. `SButtonGroup`, `SFab` and `SBackTop` do not accept `link`.
- `SSeparator`: the new `line-style` prop, `solid` (default), `dashed` or `dotted`, and the new `color` prop for the line color from the palette. The label stays muted.
