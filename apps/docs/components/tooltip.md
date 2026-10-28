# Tooltip

`STooltip` is a tooltip built on Reka UI: it shows on hover/focus, renders in a portal, supports
the keyboard and placement sides. The trigger goes into the `#trigger` slot, the content into the
default slot or the `content` prop. On touch devices the tooltip is enabled with the `trigger`
prop — see [Opening on press](#opening-on-press).

## Basic usage

<ClientOnly>
<Demo>
  <STooltip content="The tooltip appears on hover">
    <template #trigger>
      <SButton variant="outline">Hover over me</SButton>
    </template>
  </STooltip>

<template #code>

```vue
<template>
  <STooltip content="The tooltip appears on hover">
    <template #trigger>
      <SButton variant="outline">Hover over me</SButton>
    </template>
  </STooltip>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Sides

<ClientOnly>
<Demo>
  <div style="display: flex; gap: 12px">
    <STooltip content="Top" side="top"><template #trigger><SButton variant="ghost">top</SButton></template></STooltip>
    <STooltip content="Right" side="right"><template #trigger><SButton variant="ghost">right</SButton></template></STooltip>
    <STooltip content="Bottom" side="bottom"><template #trigger><SButton variant="ghost">bottom</SButton></template></STooltip>
    <STooltip content="Left" side="left"><template #trigger><SButton variant="ghost">left</SButton></template></STooltip>
  </div>

<template #code>

```vue
<template>
  <STooltip
    content="Right"
    side="right"
  >
    <template #trigger><SButton variant="ghost">right</SButton></template>
  </STooltip>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Opening on press

Touch devices have no hover, so by default the tooltip is unavailable there. The `trigger` prop
changes how it opens: `auto` keeps hover for the mouse and treats a touch as a press; `click`
opens on press on any device. A second press, a press outside, <kbd>Esc</kbd> and scrolling close
the tooltip. The `trigger` prop sets how the tooltip opens, the `#trigger` slot sets the element
itself.

The press is not blocked, so the trigger's own action fires as usual. A press inside an open
tooltip does not close it, so a link in it works. For that, in `auto` mode a trigger pressed by
touch does not take focus, unless the press lands in a field (`input`, `textarea`, `select` or
editable content), which still gets focus for typing. From the keyboard focus reaches the trigger
as usual.

`auto-close-delay` sets the time in milliseconds after which a tooltip opened by a press hides on
its own — useful when the trigger navigates to another screen.

A tooltip must not be the only carrier of important information: its content exists in the markup
only while it is open.

<ClientOnly>
<Demo>
  <div style="display: flex; gap: 12px">
    <STooltip content="Hover for the mouse, tap for touch" trigger="auto"><template #trigger><SButton variant="outline">auto</SButton></template></STooltip>
    <STooltip content="Press only" trigger="click"><template #trigger><SButton variant="outline">click</SButton></template></STooltip>
    <STooltip content="Hides after 1.5 s" trigger="click" :auto-close-delay="1500"><template #trigger><SButton variant="outline">auto-close-delay</SButton></template></STooltip>
  </div>

<template #code>

```vue
<template>
  <STooltip
    content="Copy number"
    trigger="auto"
  >
    <template #trigger>
      <SButton
        icon="copy"
        aria-label="Copy"
      />
    </template>
  </STooltip>

  <STooltip
    content="Hides after 1.5 s"
    trigger="click"
    :auto-close-delay="1500"
  >
    <template #trigger><SButton variant="outline">Help</SButton></template>
  </STooltip>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Elevation

The tooltip is raised to the second elevation level. `flat` removes the shadow, `elevation`
changes the level — see [Elevation](/style/elevation).

<Demo>
  <ClientOnly>
    <STooltip content="No shadow" flat>
      <template #trigger><SButton variant="outline">flat</SButton></template>
    </STooltip>
    <STooltip content="Higher" :elevation="4">
      <template #trigger><SButton variant="outline">elevation 4</SButton></template>
    </STooltip>
  </ClientOnly>

<template #code>

```vue
<template>
  <STooltip
    content="Copy number"
    flat
  >
    <template #trigger>
      <SButton
        icon="copy"
        aria-label="Copy"
      />
    </template>
  </STooltip>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="STooltip" />
