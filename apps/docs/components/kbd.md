# Kbd

`SKbd` shows one key of a keyboard shortcut. A known key name (`meta`, `ctrl`, `shift`, `enter`,
`escape`, `arrowup`, … — case insensitive) is drawn as its symbol, any other text is shown as
given. The symbols are the same everywhere: the shortcut has to match the one the application
documents, and platform sniffing would make the server render something else than the browser.
Since a symbol read on its own is an unknown glyph, a key rendered as one is announced by its
name (`⌘` as "meta").

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

## API

<ApiTable name="SKbd" />
