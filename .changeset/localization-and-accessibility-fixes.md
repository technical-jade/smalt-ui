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
- `SPinInput` cells form a group (`role="group"`) named by the field label, and the new `ariaLabel` prop names it without a visible label. Attributes other than `class`/`style` now go to that group instead of the field wrapper.
- `SRadio` gets an `ariaLabel` prop for an option without a visible label. Its attributes other than `class`/`style` now go to the `role="radio"` element instead of the wrapper.
- `SScrollArea` passes `aria-*` attributes and `role` to its focusable viewport instead of the root.
- `SSlider` links the hint and the error to every thumb of a range, not only the first one.
- The arrow keys of `SRating` set the rating as they move focus, as in `SRadioGroup`.
- In the `SSidebar` rail the text of the rows is hidden only visually, so icon-only rows keep their accessible names; below the breakpoint the drawer takes the sidebar's `aria-label` as its name.
- `STimeline` marks the current item with `aria-current="step"` and a disabled one with `aria-disabled`.
- `SListItem` with `clickable` on a non-interactive tag (`as="div"`) becomes a keyboard button: `role="button"`, a tab stop, activation by Enter and Space.
- `SToolbar` gets working roving focus: the panel is one tab stop, and the arrow keys, Home and End move focus between its `SButton` and `SToggle` items, skipping disabled ones.
- An indeterminate `SCheckbox` is no longer submitted as checked by a native form, and with `required` it blocks the submission.
- `SLoadingOverlay` no longer sets `aria-busy` on itself: a screen reader held back the announcement of its own live region. Put `aria-busy` and `inert` on the covered content instead.
