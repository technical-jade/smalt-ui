# Components

An overview of the components in `@smalt-ui/core`, a UI library for Vue 3 and Nuxt. All components
are built on [Reka UI](https://reka-ui.com) (accessibility, keyboard, focus management), styled with
design tokens, and isolated from the host app's styles. Each page has live examples and an API
table generated directly from the types and JSDoc.

Components are named with the `S` prefix (`SButton`, `SInput`, …) and grouped by purpose.

## Basics

Basic building blocks reused by other components.

- [Button](/components/button) — a button with variants, sizes, and icon slots
- [Button Group](/components/button-group) — buttons joined into a single control
- [Icon](/components/icon) — an SVG icon from a name registry (Lucide)
- [Badge](/components/badge) — a compact label or counter
- [Tag](/components/tag) — a removable chip tag (also used in `use-tags` fields)
- [Avatar](/components/avatar) — an avatar with a fallback
- [Kbd](/components/kbd) — a keyboard shortcut key
- [Fab](/components/fab) — a floating action button, on its own or with a fan of actions

## Forms

Inputs on the shared `SFormField` frame (label, hint, error message, a11y relationships).

- Base: [Form](/components/form) (validation of the fields on submit, see
  [Validation](/guide/validation)), [Form Field](/components/form-field)
- Text: [Input](/components/input) (the `numeric` prop for numeric input, `use-tags` for tag input),
  [Textarea](/components/textarea)
- Numbers and codes: [Number Field](/components/number-field) (a stepper with buttons),
  [Pin Input](/components/pin-input)
- Selection: [Select](/components/select) (`searchable` for search, `multiple`/`use-tags` for
  multiple selection), [Autocomplete](/components/autocomplete) (suggestions from server-side
  search results)
- Color: [Color Field](/components/color-field), [Color Picker](/components/color-picker)
- Files: [File Upload](/components/file-upload) (drop zone, accept/size/count limits and
  rejections)
- Lists: [Listbox](/components/listbox) (a selectable list surface),
  [Editable](/components/editable) (editing text in place)
- Toggles: [Checkbox](/components/checkbox), [Radio](/components/radio),
  [Switch](/components/switch), [Toggle](/components/toggle)
- Value: [Slider](/components/slider), [Rating](/components/rating)

## Date and time

Fields and calendars on `@internationalized/date`.

- [Calendar](/components/calendar), [Date Field](/components/date-field),
  [Time Field](/components/time-field), [Date Picker](/components/date-picker),
  [Date Range Picker](/components/date-range-picker),
  [Time Picker](/components/time-picker)

## Navigation and menus

Moving between sections and contextual action menus.

- Navigation: [Breadcrumb](/components/breadcrumb), [Pagination](/components/pagination),
  [Tabs](/components/tabs), [Stepper](/components/stepper),
  [Navigation Menu](/components/navigation-menu)
- Menus: [Dropdown Menu](/components/dropdown-menu), [Context Menu](/components/context-menu),
  [Menubar](/components/menubar), [Toolbar](/components/toolbar)
- Scrolling: [Back to Top](/components/back-top)

## Overlays

Popup surfaces and dialogs (portals, focus management).

- [Dialog](/components/dialog), [Alert Dialog](/components/alert-dialog),
  [Drawer](/components/drawer), [Popover](/components/popover),
  [Hover Card](/components/hover-card), [Tooltip](/components/tooltip),
  [Command Palette](/components/command-palette)

## Feedback

Messages and status indicators.

- [Alert](/components/alert), [Toast](/components/toast), [Progress](/components/progress),
  [Spinner](/components/spinner), [Skeleton](/components/skeleton),
  [Empty State](/components/empty-state), [Banner](/components/banner),
  [Loading Overlay](/components/loading-overlay)

## Other

Layout, containers, and expandable content.

- App shell: [App Bar, Sidebar and Page](/components/app-shell)
- Layout: [Card](/components/card), [Separator](/components/separator),
  [Aspect Ratio](/components/aspect-ratio), [Image](/components/image),
  [Splitter](/components/splitter), [Scroll Area](/components/scroll-area)
- Disclosure: [Accordion](/components/accordion), [Collapsible](/components/collapsible),
  [Tree](/components/tree)
- Data: [Timeline](/components/timeline), [List](/components/list),
  [Stat](/components/stat)
