# Architecture

This section is for those who want a deeper understanding of how Smalt UI behaves: what is part of
the public contract, how styles are delivered, how tree-shaking and SSR work.

## Foundation: Reka UI

Smalt UI components are built on top of [Reka UI](https://reka-ui.com) (headless primitives for
Vue 3): Reka handles behavior, accessibility and focus management, Smalt UI handles styling with
design tokens. That is why `reka-ui` and `vue` are declared as **peer dependencies**: they come
from your app and are not duplicated in the bundle.

## Styles: global BEM + tokens

- Components use **global BEM classes** (`.s-name`, `.s-name__el`, `.s-name--mod`), without
  scoped styles or CSS Modules.
- **Class names are stable and part of the public contract**: you can hook custom styles onto
  them (see [Theming](/theming#customizing-specific-components)).
- All values go through CSS variables prefixed with `--s-` (three-tier tokens).
- The theme is set with the `data-theme` attribute on `<html>`; isolation with the `.s-root`
  container (see [Isolation](/guide/isolation)).

## CSS delivery and tree-shaking

Styles are delivered in three ways:

1. **`@smalt-ui/core/styles.css`**: the global layer with design tokens, the light/dark theme, the
   `.s-root` container and a minimal normalize. Import it **once** in the entry point. Without it
   components have no tokens.
2. **Component CSS**: injected automatically when a component is imported (via
   `vite-plugin-lib-inject-css`). Import only `SButton`, and only its CSS ends up in the bundle.
3. **`@smalt-ui/core/fonts.css`**: the `@font-face` rules for the Inter font and the files
   themselves (`@smalt-ui/core/fonts/*`). A separate, optional entry: an app with its own fonts
   does not import it (see [Fonts](/theming#fonts)).

The package is marked `sideEffects: ["*.css"]` and built with `preserveModules`, so unused
components are **tree-shaken**: you pay only for what you import. The `SUI` plugin (registers all
components globally) is convenient, but for the smallest bundle import components one by one.

## Component composition

Complex components reuse simpler ones as ready-made S-components instead of pulling in the
primitives again. For example, all text and composite fields are built on `SFormField` (label,
hint, error message and a11y wiring), and `SIcon` is reused by dozens of components. So
customizing a base component (e.g. `.s-field` or its tokens) affects everything that uses it.

## Attributes and listeners

Attributes that are not props (`class`, `style`, `data-*`, `aria-*`, event listeners) go where
they are useful rather than to the outermost element:

- **Floating layers** (`SPopover`, `SHoverCard`, `STooltip`, `SDropdownMenu`, `SContextMenu`,
  `SDialog`, `SDrawer`, `SAlertDialog`) put them on the panel itself: the teleported element with
  the component's `__content` class.
- **Fields with a single control** (`SInput`, `STextarea`, `SAutocomplete`, `SSelect`,
  `SCheckbox`, `SSwitch`, `SColorField`, `SNumberField`) keep `class`/`style` on the outer field and pass everything else to the
  control, so `aria-*`, `data-testid` and `@keydown` reach the element that uses them.
- Other components keep them on their root element.

Composite fields (`SSelect`, `SNumberField`, `SPinInput`, the date and time fields) emit `focus`
and `blur` for the field as a whole: moving between segments, cells, buttons or into the open
list does not count.

## Native forms

Every form control accepts `name`. Inside a `<form>` it submits the value with the form and
takes part in native validation (`required`), the same as a native input. Controls without a
native element behind them render a hidden one that carries the value:

| Component                   | Submitted value                                                      |
| --------------------------- | -------------------------------------------------------------------- |
| `SSelect` with `multiple`   | one entry per selected value (`formData.getAll(name)`)               |
| `SAutocomplete`             | the suggestion's `value`, not the text in the input                  |
| `SDateField`, `SDatePicker` | ISO date, `2026-01-02` (date-time with a time `granularity`)         |
| `STimeField`                | ISO time, `09:30:00`                                                 |
| `SDateRangePicker`          | ISO interval, `2026-01-02/2026-01-05`; empty until both ends are set |
| `SSlider` with a range      | `name[0]`, `name[1]`                                                 |
| `SPinInput`                 | the cells joined into one string                                     |

## SSR and portals

- Components are SSR-safe: they do not access `window`/`document` without checks. This is verified
  automatically: the library tests render every component on the server.
- Floating layers use Reka UI **portals** (teleport to `<body>`). In some environments (static
  rendering of demos) wrap them in `<ClientOnly>`.
- Toast notifications work through a single `ToastProvider` at the app root (imperative
  `useToast` API).

## Package and types

- **ESM-only.** The package ships as ES modules (`"type": "module"`); the `exports` field points
  to `./dist/index.js` and `./styles.css`. There is no CJS entry point.
- **Types** (`.d.ts`) are generated from the sources by `vue-tsc`: full types of props, slots and
  models, including types from Reka UI and `@internationalized/date` (the latter only in the types
  of date components, declared as an optional peer). They resolve with any `moduleResolution`
  setting, both `bundler` and `node16`/`nodenext`.
- **Node ≥ 22.12.** A modern build environment is required.
- **Entry points:** `@smalt-ui/core` (components, composables, providers), `@smalt-ui/core/icons`
  (lucide re-export), `@smalt-ui/core/resolver` (auto-import for `unplugin-vue-components`,
  see [Auto-import](/guide/auto-import)), `@smalt-ui/core/labs`, `@smalt-ui/core/styles.css`,
  `@smalt-ui/core/fonts.css` (+ font files `@smalt-ui/core/fonts/*`) and `@smalt-ui/core/scss/*`,
  the SCSS sources of tokens and mixins.
- **SCSS subpath.** `@smalt-ui/core/scss/settings` exposes SASS maps (`$breakpoints`, `$spacing`,
  palettes), `@smalt-ui/core/scss/tools` exposes mixins (`respond-to`, `field-shell`,
  `state-layer`), `@smalt-ui/core/scss/fonts` exposes `@font-face` rules with a configurable
  `$font-path`. Use it where a CSS variable will not do: a media query cannot read one, so the app
  takes its breakpoints from here instead of duplicating the numbers.

  ```scss
  @use '@smalt-ui/core/scss/tools' as tools;

  .sidebar {
    @include tools.respond-to(md) {
      padding: var(--s-space-4);
    }
  }
  ```

## Labs channel

`@smalt-ui/core/labs` holds experimental components. Their public API may change without a
deprecation cycle, so they are not part of the main entry point and the plugin does not register
them by default:

```ts
import { createSUI } from '@smalt-ui/core'

app.use(createSUI({ labs: true }))
```

A component moves from `labs` to the main export once its API has settled; the move is a breaking
change for imports only, the behavior stays the same.

## Browser support

Styles target current browsers: `:where()`, `color-mix()`, `clip-path`, logical properties,
cascade layers (`@layer`). The lower bound is set by `color-mix()`: Chrome 111, Safari 16.2,
Firefox 113.

## Cascade layers

Library styles live in the layers `smalt.tokens`, `smalt.base`, `smalt.components`,
`smalt.utilities` (in this priority order). App rules do not declare layers, and by the spec an
unlayered rule beats any layer, so **overriding needs neither `!important` nor a doubled
selector**:

```css
/* a single class is enough */
.checkout-button {
  border-radius: 0;
  box-shadow: none;
}
```

This matters because component CSS is injected into its JS chunk and reaches the document **after**
the app's global files. Without layers it would always win at equal specificity, and the import
order would affect the result.

Layers do not replace isolation from host styles: that still relies on the `.s-root` container
and `reset-inherited`, see [Isolation and embedding](/guide/isolation).
