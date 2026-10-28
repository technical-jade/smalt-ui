# Isolation and embedding

Smalt UI uses **global BEM classes** (`.s-button`, not scoped styles). This gives a stable contract
and tree-shakeable CSS, but requires care with isolation: host page styles must not distort the
components, and library styles must not break the host. Below is how this works and what is
guaranteed.

## The `.s-root` container

Wrap the app (or the subtree that uses the components) in an element with the `.s-root` class.
It is the isolation boundary: it sets base typography, a new stacking context
(`isolation: isolate`) and resets inherited properties that would otherwise leak in from the page.

```vue
<template>
  <div class="s-root s-root--app">
    <App />
  </div>
</template>
```

- `.s-root`: inheritance boundary + base typography/color. Put it on the root of the subtree with
  components.
- `.s-root--app`: modifier for a **full-screen app** that adds a background (`--s-color-bg`) and
  `min-height: 100dvh`. Do not use it on a widget wrapper inside someone else's page, or you will
  repaint its background.

::: tip Nuxt
The `@smalt-ui/nuxt` module applies `.s-root .s-root--app` to the app root automatically (the
`container` option), so there is no need to wrap it by hand. See [Nuxt](/guide/nuxt).
:::

## What isolation protects (host → components)

Inherited typography properties of the host page are **neutralized** on the root of every
component by the `reset-inherited` mixin. Even if the page has aggressive CSS like this:

```css
/* host page styles */
body {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-style: italic;
}
```

the text in buttons, inputs, menus, the calendar and floating layers stays correct. Reset
properties: `font-family`, `font-style`, `text-transform`, `text-align`, `letter-spacing`,
`word-spacing`, `text-indent`, `line-height`. The `direction` property is deliberately **not**
touched, so RTL keeps working.

### Fonts

`font-family` is fully protected: `reset-inherited` sets `font-family: var(--s-font-sans)` on the
root of every component, so the host font does not reach the components. `font-size` and
`font-weight` are not part of the per-root reset: their base value comes from the `.s-root`
container and from the components themselves (through typography roles).

Component titles use a second family, `--s-font-heading`; this does not affect isolation, since
the font still comes from the library, not from the page.

To make components **inherit the host page font** instead, set both tokens to `inherit`:

```css
:root:root:root {
  --s-font-sans: inherit;
  --s-font-heading: inherit;
}
```

By default the heading token just refers to the text token, but if headings have their own font
(`'Manrope', var(--s-font-sans)`), `inherit` inside such a list makes the whole declaration
invalid. Setting `inherit` on both tokens protects you from that.

Font strategies are covered in [Theming](/theming#fonts).

## Overriding library styles

App rules override component styles with a single class, without `!important` and without a
doubled selector:

```css
.checkout-button {
  border-radius: 0;
  box-shadow: none;
}
```

This works because library styles live in the `smalt.*` cascade layers, while app rules declare
no layers: by the spec an unlayered rule beats any layer regardless of load order. The order does
matter here: component CSS ships in its JS chunk and reaches the document **after** the app's
global files, so without layers it would always win at equal specificity. See
[Architecture](/guide/architecture#cascade-layers).

If the behavior should change across the whole app rather than in one place, the right tool is
usually not CSS but [prop defaults](/guide/defaults) or [theme tokens](/theming).

## Limits of isolation (important)

Isolation is built on neutralizing **inherited** properties. It does **not** protect against
direct host element selectors that target tags or the `.s-*` classes themselves with enough
specificity:

```css
/* this host rule gets through: it is a direct tag match, not inheritance */
.some-host-scope button {
  border-radius: 0 !important;
}
```

This is a fundamental limitation of any library built on global classes (without Shadow DOM);
Vuetify and other UI libraries behave the same way. In practice a conflict is unlikely: names use
the `--s-`/`.s-` prefix, and the host's typical reset/normalize and "global typography" are caught
by the container and `reset-inherited`. If you need full control, place Smalt UI in an isolated
subtree and do not set competing rules on it.

## Global reset and embedding a widget

`styles.css` contains a minimal global normalize: `* { box-sizing: border-box }`,
`body { margin: 0 }` and `font: inherit` on native form controls. For a full app this is
convenient and expected. But when embedding a **widget into someone else's page**, the global
`box-sizing` may be unwanted.

This block is wrapped in the `settings.$reset` SASS flag (`true` by default). To turn it off,
build the global styles from the package's SCSS sources instead of the ready-made `styles.css`:
configure `settings` first, then pull in the aggregator:

```scss
@use '@smalt-ui/core/scss/settings' with (
  $reset: false
);
@use '@smalt-ui/core/scss/index';
```

Outside Vite (plain Sass CLI) write the paths with the `pkg:` prefix and run the compiler with
`--pkg-importer=node`. Components stay `border-box` without the global rule: the property is part
of `reset-inherited` on their roots.

::: warning
The flag applies **at SASS build time**. The prebuilt `dist/styles.css` already contains the
normalize; to exclude it, compile the global styles from sources as shown above. The reset is
deliberately minimal, so in most cases there is no need to turn it off.
:::

## Portals (overlays)

Reka UI teleports floating layers (Dialog, AlertDialog, Drawer, Popover, HoverCard, Tooltip,
Select, DropdownMenu, ContextMenu, Menubar, Toast, DatePicker panels and others) to the end of
`<body>`, **outside** the `.s-root` container. To keep isolation working there, `reset-inherited`
is also applied directly to the roots of portal content (`__content`/`__overlay`/viewport). Nothing is required from you.

With SSR (Nuxt/VitePress), wrap demos of components with portals in `<ClientOnly>`; this avoids
hydration mismatch warnings.

## Summary

- Wrap the app in `.s-root` (automatic in Nuxt).
- The host's inherited typography does not leak into components; the font is always Smalt UI's
  (switchable with the `--s-font-sans` and `--s-font-heading` tokens, all the way to `inherit`).
- Isolation does not catch direct high-specificity host element selectors; that is the limit of
  global classes.
- The global normalize is minimal and can be turned off with the `$reset` flag when building from
  sources.
