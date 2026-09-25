# @smalt-ui/core

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
