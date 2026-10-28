---
'@smalt-ui/core': minor
---

Localization, accessibility and form fixes.

- `SNumberField` formats and parses the number by the library locale (`1,234.5` by default) and gets a `locale` prop for a single field; a `global` `locale` default reaches it as well. A screen reader announces it as a "number field" from the new `numberField` dictionary key instead of Reka's built-in string.
- The segments of `SDateField`, `STimeField`, `STimePicker`, `SDatePicker` and `SDateRangePicker` take their accessible names ("day", "month", "hour", …) and the "Empty" value text from the dictionary, so a translated dictionary translates them too.
- `SKbd` announces keys by readable names: `meta` is "Command", `ctrl` is "Ctrl", and the arrows and space come from the dictionary.
- The letter tokens of `SInput` masks (`S`, `N`, `A`/`a`, `X`/`x`) accept letters of any script, not only Latin.
- `SCommandPalette` opens by Cmd/Ctrl plus its key on non-Latin keyboard layouts through the same physical key, and hides empty groups for an empty query as well.
- 15 new `SMessages` keys: `numberField`, `kbdArrowUp`, `kbdArrowDown`, `kbdArrowLeft`, `kbdArrowRight`, `kbdSpace`, `segmentDay`, `segmentMonth`, `segmentYear`, `segmentHour`, `segmentMinute`, `segmentSecond`, `segmentDayPeriod`, `segmentTimeZone` and `segmentEmpty`.
