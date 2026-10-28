# Kbd

`SKbd` shows one key of a keyboard shortcut. A known key name (`meta`, `ctrl`, `shift`, `enter`,
`escape`, `arrowup`, … — case insensitive) is drawn as its symbol, any other text is shown as
given. The symbols are the same everywhere: the shortcut has to match the one the application
documents, and platform sniffing would make the server render something else than the browser.
Since a symbol read on its own is an unknown glyph, a key rendered as one gets `role="img"` and
the key name as its accessible name. Modifiers and service keys are named as printed on a
keyboard: `⌘` is "Command" (a Mac symbol, so the Mac name), `⌃` is "Ctrl", `⎋` is "Esc". Arrows and
space are announced as "Up arrow" or "Space", and these names come from the
[locale dictionary](/guide/i18n#dictionary-keys-smessages) (`kbdArrowUp` … `kbdSpace`). Text shown
as given is read as is.

| Symbol  | Names                                                                        |
| ------- | ---------------------------------------------------------------------------- |
| ⌘       | `meta`, `command`                                                            |
| ⌃       | `ctrl`, `control`                                                            |
| ⌥       | `alt`, `option`                                                              |
| ⇧       | `shift`                                                                      |
| ↵       | `enter`, `return`                                                            |
| ⌫       | `backspace`                                                                  |
| ⌦       | `delete`                                                                     |
| ⎋       | `escape`, `esc`                                                              |
| ⇥       | `tab`                                                                        |
| ⇪       | `capslock`                                                                   |
| ↑ ↓ ← → | `arrowup`/`up`, `arrowdown`/`down`, `arrowleft`/`left`, `arrowright`/`right` |
| ␣       | `space`                                                                      |

The symbols do not depend on the platform: on Windows `meta` is drawn as `⌘` too. If you need a
label for a specific OS, pick the `value` yourself.

## Keys

<Demo>
  <SKbd value="meta" />
  <SKbd value="shift" />
  <SKbd value="enter" />
  <SKbd value="escape" />
  <SKbd value="arrowup" />
  <SKbd value="K" />

<template #code>

```vue
<template>
  <SKbd value="meta" />
  <SKbd value="shift" />
  <SKbd value="enter" />
  <SKbd value="K" />
</template>
```

  </template>
</Demo>

## Shortcut

A shortcut is several `SKbd` placed next to each other; any separator between them belongs to the
application.

<Demo>
  <SKbd value="meta" />
  <SKbd value="K" />

<template #code>

```vue
<template>
  <SKbd value="meta" />
  <SKbd value="K" />
</template>
```

  </template>
</Demo>

## Sizes

The default is `md`.

<Demo>
  <SKbd size="sm" value="ctrl" />
  <SKbd size="md" value="ctrl" />
  <SKbd size="lg" value="ctrl" />

<template #code>

```vue
<template>
  <SKbd
    size="sm"
    value="ctrl"
  />
  <SKbd
    size="lg"
    value="ctrl"
  />
</template>
```

  </template>
</Demo>

## Variants

`outline` (the default) has a border, `solid` is filled and `subtle` is muted.

<Demo>
  <SKbd variant="outline" value="tab" />
  <SKbd variant="solid" value="tab" />
  <SKbd variant="subtle" value="tab" />

<template #code>

```vue
<template>
  <SKbd
    variant="solid"
    value="tab"
  />
  <SKbd
    variant="subtle"
    value="tab"
  />
</template>
```

  </template>
</Demo>

## Custom content

The default slot replaces `value` and is rendered as given: no symbol is substituted, and neither
`role="img"` nor an accessible name is added.

<Demo>
  <SKbd>Ctrl</SKbd>
  <SKbd>Space</SKbd>

<template #code>

```vue
<template>
  <SKbd>Ctrl</SKbd>
  <SKbd>Space</SKbd>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SKbd" />
