# @smalt-ui/core

## 2.1.0

### Minor Changes

- d1d61ad: `SButtonGroup`: an attached group of filled buttons casts one shadow that follows the group shape instead of a shadow per button, which fell onto the previous button and stuck out below each shared edge. Filled buttons are split by a thin line in their text color. A group that mixes filled and other variants has no shadow, and a button's own `elevation` still draws its own. The new `flat` and `elevation` props remove the group shadow or set its level; in a detached group they reach every button.
- 2de6f26: Overlay animation, touch-friendly hover and new component options.

  - Hover highlights (`:hover`) of all components apply only on devices that can hover (`@media (hover: hover)`), so they no longer stick after a tap on a touch screen. Pressed and keyboard highlights are unchanged. The new SCSS mixin `tools.hover` wraps your own hover rules the same way.
  - `SDialog`, `SAlertDialog` and `SDrawer` animate opening and closing: the window fades in with a slight zoom, the drawer slides in from its side, and the overlay fades. With `prefers-reduced-motion: reduce` there is no animation.
  - `SDrawer` gets a `width` prop for `left`/`right` drawers and a `height` prop for `top`/`bottom` ones, plus the `--s-drawer-size` variable; a number means pixels, and the prop for the other axis is ignored. `100%` opens the drawer across the whole screen. A drawer never grows past the screen, and one that fills it loses its rounded corners and the border on the page side.
  - `SAutocomplete`: the suggestion panel is as wide as the field, long suggestions wrap, and the panel never goes past the window edge. The new `max-width` prop lets the panel grow wider than the field up to a limit. The new `open-on-click` and `open-on-focus` props open the panel with a click on the field and when focus enters it; focus moved by code (the clear button, `SForm` moving to the first error) leaves it closed. The new `floating-label` prop (off by default) turns on a floating label, and a `floatingLabel` default in `global` now reaches it.
  - `SNumberField`: the new `floating-label` prop (off by default) puts the label on the top edge of the frame, so the field lines up with neighboring fields that have a floating label; a `floatingLabel` default in `global` now reaches it. The label and the frame share a new `.s-number-field__wrap` wrapper around `.s-number-field__control`.
  - `SNavigationMenu`: the panel opens under the item that opened it, and the new `align` prop (`start`/`center`/`end`, `start` by default) picks the alignment. The panel keeps the dropdown `z-index`, so blocks further down the page no longer cover it, and a flex parent that stretches the menu no longer moves it down. New `size` (`sm`/`md`/`lg`) and `columns` props and `--s-navigation-menu-*` variables; density presets reach `size`. Items and panel links take `target` and `rel`.
  - The `color`/`text-color` props take `neutral`, the regular text color of the theme (`--s-color-text`): unlike `gray-*`, it follows the theme, and on `SButton` the hover and press highlights come out neutral too. Content on a `neutral` fill takes the surface color. `SIcon` and `STimeline` items understand it as well; there are no `neutral` utility classes.
  - `SButton` rendered as a link (`as="a"`) has no underline inside portals either: they lie outside the `.s-root` container, where browser link styles apply.
  - `STooltip`: a link inside a tooltip opened by a tap in `trigger="auto"` mode works, because the trigger pressed by touch no longer takes focus and the tooltip stays open. A field inside the trigger still takes focus from a tap.

- e980942: SCSS: the `tools.control-size` mixin takes `$grow: true` (the size height as `min-height` plus vertical padding, without stretching in a flex or grid row), and the `$control-sizes` map has a new optional `pad-y` key.
- 9eb8e8a: `SPopover` and `SHoverCard` take a border color.

  - The new CSS variables `--s-popover-border` and `--s-hover-card-border` color the panel border and the arrow stroke together.
  - The arrow stroke is as thick as the panel border. It used to scale with the arrow and came out thicker, which showed on a colored border.

- b29d183: Steadier inline fields and a stretchable number field.

  - `SCheckbox`, `SSwitch` and `SRating` align to the top of the line instead of the text baseline, so checking a checkbox no longer changes the line height and moves the content below.
  - `SNumberField`: the new `stretch` prop spreads the field across its container, with the step buttons at the edges and the input taking the free space. The new `--s-number-field-input-width` CSS variable sets the input width (`4rem` by default).

- 3ff6e92: `SButton` with `variant="link"` answers hover with color: the text shifts 30% toward `--s-shade`, so it gets darker in the light theme and lighter in the dark one, and a link with `color="neutral"` takes the accent color. The underline does not change. A button with `color="neutral"` gets the new `.s-button--neutral` modifier class.
- dd49075: Localization, accessibility and form fixes.

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
  - `SDatePicker` and `SDateRangePicker` mark a date disabled by `isDateDisabled` and typed into the segments as invalid, as they already did for a date outside `minValue`/`maxValue`; in a range a disabled day inside it counts too.
  - `SDateRangePicker` gets `closeOnSelect` (off by default) to close the calendar once both ends of the range are picked.
  - Inside an `SForm` with `validate-on`, `STimePicker` follows the form's mode instead of a configured prop default, like the other fields.
  - A click on the frame of `SInput` or `SColorField` outside interactive content (a prefix or suffix, the icon, the swatch, the padding) focuses the field.
  - `SInput` with `numeric` ignores `fill-mask` together with `mask`.
  - The `color` of `SSpinner` overrides every variant, `neutral` and `current` included.
  - `SIcon` treats a numeric string `size` (`size="20"`) as pixels.
  - `SImage` drops `srcset` and `sizes` while it shows the `fallback`.
  - `SAlert` accepts `:icon="false"` to remove the icon.
  - The `disabled` of `SColorPicker` also locks the preset swatches and the hex field of an open panel, and the visible `label` names the trigger when `aria-label` is not set.
  - `.s-container--fluid` removes the width cap on every breakpoint, not only below the first one.

- efab498: Pinned floating label and a dimmed select placeholder.

  - `floating-label="pinned"` on the fields with a floating label (`SInput`, `STextarea`, `SSelect`, `SAutocomplete`, `SColorField`, `SDateField`, `STimeField`, `SDatePicker`, `SDateRangePicker`, `STimePicker`, `SNumberField`): the label always sits on the frame, and the placeholder of an empty field stays visible. `SNumberField` keeps its label on the frame anyway, so `'pinned'` works there like `true`. `floatingLabel: 'pinned'` in `global` defaults pins the label on all these fields.
  - `SSelect`: the placeholder of a single select is dimmed like the placeholders of other fields instead of taking the value color.

- ca8c8cc: `createTheme`: `SemanticTokenName` accepts `color-outline`, `color-surface-variant`, `color-primary-container` and `color-on-primary-container`, so these roles can be themed without a type cast.
- 4e09a0b: New looks for alerts, tabs, toggles, buttons and separators.

  - `SAlert`: the new `appearance` prop, `outline` (default) or `soft`. `soft` draws the background without a border; the icon keeps the status color.
  - `STabs`: the new `variant` prop, `underline` (default) or `enclosed`. Enclosed tabs look like folders: the bordered active tab merges with the panel border. The list still scrolls only horizontally.
  - `SToggle` and `SToggleGroup`: the new `variant` prop, `tonal` (default) or `outline`. `outline` shows the on state with an accent-colored border and no fill. The group passes its `variant` to every item, including `SToggle`s in the slot; an item's own `variant` wins.
  - `SButton`: `variant="link"` renders underlined text without the button height, padding and background, so it fits into a line of text. `size` changes only the font size. `SButtonGroup`, `SFab` and `SBackTop` do not accept `link`.
  - `SSeparator`: the new `line-style` prop, `solid` (default), `dashed` or `dotted`, and the new `color` prop for the line color from the palette. The label stays muted.

### Patch Changes

- e980942: - `SButton`: a long label in a narrow container wraps, and the button grows in height instead of letting the second line out of its frame onto the neighboring content. The size height (`sm` 32px, `md` 40px, `lg` 48px) is now a minimum; a single-line button looks as before and keeps its own height next to a taller neighbor in a flex or grid row.
  - `SButtonGroup`: when a label of an attached horizontal group wraps, the other buttons take its height, so the shared edges still meet.
- bd9bcf8: Floating labels no longer overlap leading content or get cut off too early.

  - A resting floating label sits after the text in `#prepend` or `prefix`, however wide it is, and follows it when that width changes, including a `#prepend` that appears after mount. This covers `SInput`, `STextarea`, `SSelect`, `SAutocomplete`, `SColorField`, `SDateField`, `STimeField`, `SDatePicker` and `SDateRangePicker`. The offset used to fit only an icon, and `SDatePicker` and `SDateRangePicker` had none.
  - A floated label is cut off with an ellipsis only when it does not fit into the frame at its reduced size. The width limit used to count the unscaled label, so in a narrow field it was cut with a quarter of the width to spare, and leading content narrowed it although the floated label sits on the border above it. `SNumberField` had no limit at all, and a long label ran past the frame.

- 8a60945: - `SNumberField`: the floating label of a disabled field is dimmed together with the frame instead of staying at full opacity over the dimmed border.
- b93a07f: `SPopover`: an open panel moves with its trigger when the page scrolls instead of lagging behind it. For a trigger inside a `fixed` or `sticky` block, such as the `SAppBar` header, the panel stays fixed in place along with it.
- bf32548: `STextarea`: the resize grip sits in the bottom right corner of the frame instead of inset inside it. The text paddings, the field height and the room for `append` stay the same.
- e980942: `SToggle` and `SToggleGroup` items: a long label in a narrow container wraps, and the toggle grows in height instead of letting the second line out of its frame. The size height (`sm` 32px, `md` 40px, `lg` 48px) is now a minimum; a single-line toggle and an icon toggle look as before. In `SToggleGroup` the other items take the height of the wrapped one.

## 2.0.0

### Major Changes

- e8bb0f9: `useConfirm()` returns only `{ confirm }`. The queue it used to expose together with `settle` and `clear` belonged to `ConfirmProvider`: any caller could decline or answer somebody else's confirmation. The `SConfirmEntry` type is no longer exported. Code that only calls `confirm()` needs no change.

### Minor Changes

- 7eceef6: Accessibility fixes. A disabled `SCard` rendered as a button or link no longer takes focus or activates from the keyboard. `SFormField` announces an error when it appears (a polite live region). `SPopover`'s `ariaLabel` now names the panel; before, Reka's `aria-labelledby` to the trigger took precedence. `SSeparator` gets its accessible name from a label passed through the slot, and `decorative` now applies to a labeled separator. `SSplitter` handles have an accessible name (new `resize` key in `SMessages`, `handleLabel` prop) and `aria-orientation`, and Enter collapses and restores a `collapsible` panel.
- 66ff368: An app shell and four components that finish the set. `SAppBar`, `SSidebar` and `SPage` frame an
  application: a bar that can elevate on scroll, a side navigation that collapses to a rail and turns
  into a drawer below its breakpoint, and a content area that offsets itself through CSS variables
  rather than measuring anything. `SCommandPalette` is the ⌘K search over grouped commands, with
  keyboard navigation, shortcut hints and a query you can hand to a server. `SLoadingOverlay` covers a
  card or the whole viewport while something loads and announces the busy state. `SFab` is the
  floating action button, circular or extended, optionally opening a fan of actions. `SBanner`
  announces something app-wide, above the content that `SAlert` speaks about.
- 3edc6bc: Fallthrough attributes and listeners now reach the element that uses them. `SPopover`, `SHoverCard`, `STooltip`, `SDropdownMenu`, `SContextMenu` and `SAlertDialog` put them on the panel instead of losing them. `SSelect`, `SCheckbox` and `SSwitch` keep `class`/`style` on the outer field and pass the rest to the control; `SSelect` emits `focus`/`blur` for the field as a whole. `SCheckbox`, `SSwitch` and `SSlider` get an `ariaLabel` prop for controls without a visible label. `SAspectRatio` renders its own outer element, so `class`/`style` size the whole box, and falls back to 1:1 with a dev warning when `ratio` is not a positive finite number.
- de807a4: `SAutocomplete`:

  - new `free-text` prop for free text input: `v-model` holds the input text, picking a suggestion
    puts its `label` into the input and passes the option to `select`; neither closing the panel nor
    leaving the field changes the text, the clear button makes it an empty string, and the panel
    stays closed without suggestions and opens when they arrive;
  - `focus` and `blur` are now component events: `blur` fires when focus leaves the component by any
    path, including Tab from the clear button.

- 9fc82df: `SButton` icons follow the button size: 16px for `sm`, 18px for `md` (as before), 20px for `lg`. The loading spinner sits over the content instead of replacing the leading icon, so the button keeps its width when `loading` toggles.
- f501da3: `SProgress` gains a circular form: `circular` draws a ring instead of a bar, `thickness` sets the
  stroke width, `show-value` puts the percentage in the middle, and the default slot replaces it with
  your own content. The ring keeps the same ARIA as the bar, including the indeterminate state.
  `SInput` gains `revealable`, a trailing button that shows and hides a password value; its accessible
  name comes from the `showPassword`/`hidePassword` messages and can be overridden per instance.
- a3e4da0: Shadows show in the dark theme. A black shadow vanished on the dark page, so the dark theme now draws the elevation levels with a light shadow, a soft glow that grows with the level. The levels are built from new theme tokens `--s-shadow-color`, `--s-shadow-key-opacity` and `--s-shadow-ambient-opacity` (also accepted by `createTheme`); the light theme looks as before.
- 38d4cd3: Date and time fields. `SDateField`, `STimeField`, `SDatePicker` and `SDateRangePicker` mark a typed value outside `minValue`/`maxValue` as invalid (frame and `aria-invalid`), as the segments already did. Pasting into a segment now fills the whole value: ISO 8601 (`2024-03-15`, `2024-03-15T09:30`, a `start/end` interval for ranges), the numeric format of the locale (`03/15/2024` in en-US, `15/03/2024` in en-GB) and times like `9:30 PM`. `SCalendar` gets `v-model:placeholder`, the month shown, which also keeps server-rendered markup stable when there is no value.
- b365522: Better defaults. `STabs` without a value shows the first enabled tab instead of an empty panel. `SToggleGroup` gets `mandatory`: in `single` mode a click on the active item keeps it selected. `SBreadcrumb` marks `aria-current="page"` only on the current item: the new `current` field sets it explicitly, and otherwise the last item is current only when it has no `href`. A last item with `href` stays a link. Items without `href` that are not current use the new muted `s-breadcrumb__text` class instead of `s-breadcrumb__current`. `SAspectRatio` gets `square` to remove the border radius.
- 5c6e824: Accessibility and form fixes. `SAccordionItem` headers are headings (`role="heading"`, new `headingLevel` prop on the item and on `SAccordion`, level 3 by default), and the open section of a non-collapsible single accordion is marked `aria-disabled`. A loading `SButton` keeps focus: it is blocked through `aria-disabled` instead of native `disabled`. `SDropdownMenu`'s `ariaLabel` now names the menu. `SInput` with `use-tags` submits the tags under `name` (`name[0]`, `name[1]`, …) and validates `required` against them rather than the typing buffer. `SSelect` and `SAutocomplete` announce `required` through `aria-required`. `SProgress` without `label` is named by its percentage, or by the `loading` message while indeterminate. `SRadioGroup` and `SSlider` pass fallthrough attributes to the radio group and the first thumb, keeping `class`/`style` on the field. Across fields, consumer attributes override the component's own ones except the bindings built by `SFormField` (`id`, `aria-describedby`, `aria-labelledby`, `aria-invalid`). A disabled `SCard` rendered as a label warns in development when the control inside is not disabled.
- d20da68: Add built-in form validation.

  - `SForm` renders a `<form novalidate>`, checks every field on submit, moves focus to the first invalid field and emits `submit` only when the form is valid (`invalid` otherwise). Without a `submit` listener a valid form is submitted natively. `v-model` reports validity (`true`, `false` or `null`), the default slot exposes `valid`, `validating`, `errors`, `validate` and `resetValidation`, and `validate()`/`resetValidation()` are available through a template ref.
  - The form fields take `rules`: functions of the value that return `true` or an error text, synchronously or as a Promise. `validate-on` sets when a field checks: `blur` (default; then on every change while an error is shown), `input` or `submit`. It is set on `SForm` or on a field, and through prop defaults. The `error` prop still wins over the rules. This applies to `SInput`, `STextarea`, `SSelect`, `SAutocomplete`, `SNumberField`, `SPinInput`, `SSlider`, `SColorField`, `SDateField`, `STimeField`, `SDatePicker`, `SDateRangePicker`, `SCheckbox`, `SRadioGroup`, `SSwitch` and `SRating`; each of them provides `validate()`, `resetValidation()` and `focus()` through a template ref.
  - Built-in rules `required`, `minLength`, `maxLength`, `min`, `max`, `pattern` and `email`, with default texts in `SMessages` (`ruleRequired` and nine more keys). `min` and `max` also accept a numeric string (the value of a numeric `SInput`) and let an array pass, so a range `SSlider` needs a rule of its own. `required` treats a date range with both ends missing as empty, while a range with only one end is not empty for `required()`; `isEmptyValue` exposes the check for custom rules.
  - `schemaRule` turns a Standard Schema (Zod, Valibot, ArkType) into a rule.
  - `useValidation` connects a custom control to `SForm`.
  - `SFormField` exposes `controlId`, the id it gives the control, through a template ref.
  - `SSwitch` and `SRating` get `hint`, `error` and `invalid`. The consumer's `class` and `style` on them now land on the field wrapper, as on `SCheckbox`: a selector such as `.my-switch.s-switch` or `.parent > .s-switch` no longer matches. The generated id of `SSwitch` changes from `s-switch-…` to `s-field-…`. An invalid switch gets a red track border, an invalid rating red empty stars. A rating is `0` until the user picks one, and `0` is not empty, so require a rating with `min(1)`; a `readonly` rating is still validated.
  - An invalid `SCheckbox` gets a red box border, and an invalid `SRadioGroup` red radio circles.
  - Fix `SSelect` not emitting `focus` and `blur` when its list is opened with the mouse: Reka Select moves focus straight into the list, so neither event fired and validation on blur never ran. Now `focus` fires as soon as focus enters the field or its list, and `blur` fires once focus has left both, whichever way the list was opened. Moving between the field and its open list still emits nothing.

- 442682f: Eight components for forms and data. `SFileUpload` selects files through a drop zone or a compact
  button, checks them against `accept`, `maxSize` and `maxFiles`, lists what was picked and reports
  what it turned away — sending the files stays with the application. `SCheckboxGroup` collects an
  array of values the way `SRadioGroup` collects one, validation included. `STimePicker` adds a panel
  to `STimeField`: columns for hours, minutes, seconds and AM/PM, with keyboard navigation and
  `minValue`/`maxValue`. `SListbox` is a standalone selectable list — what `SSelect` shows in its
  dropdown, usable on its own. `SList` with `SListItem` lays out rows with an icon, text and an
  action, as plain rows, links or buttons. `SEditable` turns text into an input in place. `SStat`
  shows a metric with a formatted value and a trend whose direction is also announced to screen
  readers.
- db04f6b: Layout fixes. `--s-z-dropdown` moves from 1000 to 1500, the popover level: lists of `SSelect`, `SAutocomplete`, `SDropdownMenu`, `SContextMenu` and `SMenubar` no longer open under an `SDialog` or `SDrawer` and its overlay. Floating labels rise over a value filled by browser autofill. `STabs` scrolls a list of tabs that does not fit its container and scrolls a tab activated from outside into view. `SNumberField` and `SPinInput` get a `size` prop, so the density presets reach them.
- ab2e86a: Accessible names that Reka hardcodes in English now come from the locale dictionary. New `SMessages` keys: `calendar` (calendar grids of `SCalendar`, `SDatePicker`, `SDateRangePicker`, overridable with the new `calendarLabel` prop), `pagination` (the `SPagination` landmark, prop `ariaLabel`), `pinCell` (`SPinInput` cells, a `{index}`/`{length}` template, prop `cellLabel`) and `notification` (the word announced before each toast). `ToastProvider`'s `label` and the `notifications` key now name the notification region, as documented, instead of prefixing every announcement.
- cb519d1: Form controls submit their value with a native `<form>`. `SCheckbox`, `SSwitch`, `SRadioGroup`, `SSlider`, `SSelect`, `SAutocomplete`, `SColorField`, `SNumberField`, `SPinInput`, `SDateField`, `SDatePicker`, `SDateRangePicker` and `STimeField` get a `name` prop, and `required` now takes part in native validation. `SAutocomplete` submits the suggestion's value instead of the input text; `SSelect` with `multiple` submits every selected value; `SDateRangePicker` submits an ISO interval (`start/end`), empty until both ends are set. `SColorField` and `SNumberField` pass attributes other than `class`/`style` to the input; `SNumberField` and `SPinInput` emit `focus`/`blur` for the field as a whole.
- 687c251: Overlays and small gaps. Long `SDialog` content scrolls in the body, and the title, footer actions and close button stay in view. `SPopover` fits the space left on screen and scrolls long content. `SToast` announces `negative` toasts assertively and the rest politely, as `SAlert` does. A `closable` `SAlert` hides itself on close; the new `v-model:visible` shows it again, and `close` is still emitted. `SAlertDialog` and `useConfirm()` get `initialFocus` (`cancel` by default, `confirm` or `none`). `SIcon` takes a CSS length in `size`, such as `1em`.
- 8961c93: Smaller fixes around Reka. `SAvatar` shows its fallback again when `src` is cleared after an image loaded. An empty `SColorField` shows an empty input instead of `#000000`, and erasing the text clears the value. `SProgress` clamps `value` and `max` once, so the announced value matches the bar. `SPinInput` emits `complete` and `SSlider` emits `valueCommit`, both of which were lost. `SPagination` clamps the page when the page count drops. `SToggle` inside `SToggleGroup`'s slot takes the group `size`. `mergeDefaults` (nested `ConfigProvider`) treats an `undefined` value as unset instead of wiping the outer default.
- 1dc03ca: More Reka behavior is reachable through props. `SAccordion`, `SAccordionItem`, `SCollapsible` and `STabs` get `unmountOnHide`: `false` keeps hidden content mounted, so nested fields keep their state and page search finds collapsed text. `STabs` gets `activationMode` (`manual` moves focus with the arrow keys without opening the tab). `SHoverCard` gets `enableTouch` to open on tap. `SRating` previews the rating under the pointer. `SDatePicker` now closes the calendar once a day is picked; the new `closeOnSelect` prop set to `false` keeps it open as before.
- f501da3: Seven components for gaps every reference library already covers. `SButtonGroup` joins buttons into
  one control and passes `size`/`variant`/`color` down as prop defaults, so a button set explicitly
  still wins. `SKbd` renders a keyboard key, mapping names like `meta` or `enter` to their symbols and
  keeping the spelled-out name for screen readers. `SEmptyState` is the "nothing here" placeholder
  (icon or image, title, description, actions). `STimeline` shows a feed of events from `items`, with
  `v-model` marking the current one and everything before it as completed. `SScrollArea` wraps Reka's
  scroll area for overlay scrollbars that look the same in every browser. `SImage` adds lazy loading,
  a skeleton placeholder, an error fallback and `ratio` through `SAspectRatio`. `SBackTop` is the
  floating button that returns a page — or any scrollable container — to the top.
- 25bbcd8: Behavior fixes. `SAccordion` and `SToggleGroup` without `type` take the mode from `v-model`: an array selects several items instead of being replaced by a string on the first click. `SPinInput` keeps its model and `complete` value as strings also with `type="number"`, as its type promises. `SColorField` clears the value when the erased text is committed with Enter, not only on blur. `SSplitter` keys its panels by name, so removing a panel no longer hands its size to the next one. Toasts from `useToast()` follow the `SToast` defaults (`variant`, `duration`); `ToastProvider` has no own `duration` default any more, and entries in the queue keep `variant` unset unless it was passed. `ToastProvider` and `ConfirmProvider` report a second mounted instance through the development-only warning, so production consoles stay quiet.

### Patch Changes

- efcf799: `SAspectRatio` in a grid or flex row next to a taller item keeps all four corners rounded: the shape is set on the ratio box rather than on the root, which stretches to the row height.
- 14cb636: `SCheckbox` and `SSwitch` now show the `*` marker next to the label when `required` is set, matching `SFormField`-based fields. The accessible name stays the marker-free label text in both.
- 7f2b109: The scrolling body of `SDrawer` no longer clips the focus ring of a field at its edge.
- 32addd2: Focus no longer falls to `<body>`. The clear button of `SInput`, `SAutocomplete` and `SSelect` returns focus to the control. Tab out of a non-modal `SDropdownMenu` or `SContextMenu` closes the menu and moves on from the element that opened it. Home and End move the caret in a searchable `SSelect` instead of jumping through the list.
- b31afe7: The close buttons of `SAlert`, `SToast`, `SDialog` and `SDrawer` and the selected-option mark of `SSelect` draw `SIcon` (`x`, `check`) instead of the `×`/`✓` text glyphs, so they no longer depend on the host font and follow icons replaced through `registerIcons`.
- 442682f: `SScrollArea` scrolls when its size comes from `max-height`. The cap sat on the root, which then had
  no definite height to hand to the viewport: the viewport grew with the content and the root simply
  clipped it, leaving a cut-off region with no scrollbar.
- 7d22792: `SAutocomplete` keeps the typed text when focus leaves the field without a suggestion being picked,
  and when the panel is closed and opened again. The text is replaced by the label of a picked
  suggestion and emptied when the value is cleared; in both cases the component also empties
  `v-model:search`, so a query the user can no longer see does not stay behind.
- 9b57e64: Style fixes. `SNumberField` and `SColorField` turn their frame red when invalid, like the other fields. Disabled `outline`/`ghost` link buttons (`as="a"`) no longer light up on hover. The close button of `SToast` shows the focus ring. `SAlertDialog` fits the screen: its description and body scroll while the actions stay in view. The indeterminate `SProgress` and the `SButton` loading spinner slow down under `prefers-reduced-motion`. `SBreadcrumb` resets inherited typography on its root. `SDatePicker` drops a stray `z-index` fallback.

## 1.0.1
