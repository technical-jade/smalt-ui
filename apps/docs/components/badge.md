# Badge

`SBadge` is a compact label: a status, a counter, a category. It is a plain `<span>` with no
interactivity; if the label has to be removable by a click, use [`STag`](/components/tag).

## Variants

`variant` sets the role: `primary` is a solid fill, the others are a soft background with colored
text. The default is `neutral`.

<Demo>
  <SBadge variant="neutral">Neutral</SBadge>
  <SBadge variant="primary">Primary</SBadge>
  <SBadge variant="positive">Positive</SBadge>
  <SBadge variant="warning">Warning</SBadge>
  <SBadge variant="negative">Negative</SBadge>

<template #code>

```vue
<template>
  <SBadge variant="neutral">Neutral</SBadge>
  <SBadge variant="primary">Primary</SBadge>
  <SBadge variant="positive">Positive</SBadge>
  <SBadge variant="warning">Warning</SBadge>
  <SBadge variant="negative">Negative</SBadge>
</template>
```

  </template>
</Demo>

## Sizes

`sm`, `md` (the default) and `lg`. Icon sizes adjust themselves. `lg` exists mainly for the
`comfortable` preset, which sets it globally.

<Demo>
  <SBadge size="sm">sm</SBadge>
  <SBadge size="md">md</SBadge>

<template #code>

```vue
<template>
  <SBadge size="sm">sm</SBadge>
  <SBadge size="md">md</SBadge>
</template>
```

  </template>
</Demo>

## Shape

A badge is rounded into a pill by default. `square` returns plain corners.

## Color

The `color` prop sets a color from the [palette](/style/palette) (`primary`, `teal`, `teal-10`) and
overrides the variant color. The filled `primary` variant also accepts `text-color`; for the soft
variants the color applies to both the tint and the text.

<Demo>
  <SBadge variant="primary" color="teal">teal</SBadge>
  <SBadge variant="primary" color="deep-purple">deep-purple</SBadge>
  <SBadge variant="positive" color="indigo">soft indigo</SBadge>
  <SBadge variant="primary" color="light-blue-3" text-color="dark">light-blue-3</SBadge>

<template #code>

```vue
<template>
  <SBadge
    variant="primary"
    color="teal"
  >
    teal
  </SBadge>
  <SBadge
    variant="primary"
    color="deep-purple"
  >
    deep-purple
  </SBadge>
  <SBadge
    variant="positive"
    color="indigo"
  >
    soft indigo
  </SBadge>
  <SBadge
    variant="primary"
    color="light-blue-3"
    text-color="dark"
  >
    light-blue-3
  </SBadge>
</template>
```

  </template>
</Demo>

## Icons

`icon` renders a leading icon, `icon-right` a trailing one: a registry name or a raw SVG path. The
icons are decorative (`aria-hidden`), so the text has to carry the meaning.

<Demo>
  <SBadge variant="positive" icon="check">Done</SBadge>
  <SBadge variant="neutral" icon-right="x">Draft</SBadge>

<template #code>

```vue
<template>
  <SBadge
    variant="positive"
    icon="check"
  >
    Done
  </SBadge>
  <SBadge
    variant="neutral"
    icon-right="x"
  >
    Draft
  </SBadge>
</template>
```

  </template>
</Demo>

## Accessibility

A badge has no role and no accessible name: a screen reader reads its text in the flow. Two rules
follow. Do not convey status by color alone (use the text "Error" instead of an empty red badge),
and give a bare counter some context, because a "3" next to an icon says nothing until the button
text or a hidden label reads "3 unread".

## API

<ApiTable name="SBadge" />
