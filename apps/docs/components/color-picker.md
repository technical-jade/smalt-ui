# Color Picker

`SColorPicker` is a visual color picker in a popover panel: a 2D saturation/brightness area, a hue
slider (and optionally an alpha slider), preset swatches, and a hex field
([`SColorField`](./color-field)). The trigger shows the current color. It is built on `SPopover`;
the value is a hex string bound with `v-model`; without a value, `#3B82F6` is selected. A color
picked in the area or on the sliders arrives in lower case (`#8b5cf6`). The panel opens in a portal,
so the demos are wrapped in `<ClientOnly>`.

The panel is an [`SPopover`](./popover), so it closes on `Esc` and on a click outside, fits the
space left on screen (long content scrolls inside it), and moves together with the trigger when the
page scrolls. It also takes its border color from `--s-popover-border`; the panel renders in a
portal, so set that variable globally (for example on `:root`) rather than on the picker.

## Basic usage

<script setup>
import { ref } from 'vue'
const color = ref('#3B82F6')
const brand = ref('#8B5CF6')
const swatches = ['#EF4444', '#F59E0B', '#10B981']
</script>

<Demo>
  <ClientOnly>
    <div style="display: flex; align-items: center; gap: 16px">
      <SColorPicker v-model="color" label="Color" />
      <code>{{ color }}</code>
    </div>
  </ClientOnly>

<template #code>

```vue
<script setup>
import { ref } from 'vue'
const color = ref('#3B82F6')
</script>

<template>
  <SColorPicker
    v-model="color"
    label="Color"
  />
</template>
```

  </template>
</Demo>

## Alpha and presets

`with-alpha` adds an alpha slider; a color with transparency is written with eight hex digits
(`#8b5cf680`). `swatches` is an array of hex strings shown in the panel for one-click selection.

<Demo>
  <ClientOnly>
    <SColorPicker v-model="brand" label="Brand color" with-alpha :swatches="swatches" />
  </ClientOnly>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const color = ref('#8B5CF6')
const swatches = ['#EF4444', '#F59E0B', '#10B981']
</script>

<template>
  <SColorPicker
    v-model="color"
    label="Brand color"
    with-alpha
    :swatches="swatches"
  />
</template>
```

  </template>
</Demo>

## Without the input

The `hide-input` flag hides the hex field in the panel, leaving only the saturation area, the hue
slider, and the swatches.

<Demo>
  <ClientOnly>
    <SColorPicker v-model="color" label="Color" hide-input />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { ref } from 'vue'
const color = ref('#3B82F6')
</script>

<template>
  <SColorPicker
    v-model="color"
    label="Color"
    hide-input
  />
</template>
```

  </template>
</Demo>

## Disabled

`disabled` locks the trigger: the panel does not open and the color cannot be changed. When
`disabled` turns on while the panel is open, the area, the sliders, the preset swatches and the hex
field inside it are locked too.

<Demo>
  <ClientOnly>
    <SColorPicker v-model="color" label="Color" disabled />
  </ClientOnly>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const color = ref('#3B82F6')
</script>

<template>
  <SColorPicker
    v-model="color"
    label="Color"
    disabled
  />
</template>
```

  </template>
</Demo>

## Accessibility

The area and the sliders are controlled with the arrow keys, like regular sliders. The trigger is
named by its visible `label`, or "Pick a color" without one; the panel is named "Color picker" and
the swatch group "Color swatches" (strings of the [locale dictionary](/guide/i18n)). `aria-label`
sets one name for the trigger and the panel, `swatches-label` for the swatch group. When the
picker has a `label`, include its text in `aria-label`: the accessible name has to contain the
visible label (WCAG 2.5.3).

## Shadow and shape

The panel has a shadow by default. `flat` removes it, and `elevation` (0-5, see the
[scale](/style/elevation)) sets the level and wins over `flat`. `square` removes the rounding of
the hex field in the panel.

## Limitations

`SColorPicker` is not a form field: it has no `hint`, `error`, `rules`, or `name`, and `SForm`
does not validate it. To validate the color or submit it with a form, use
[`SColorField`](./color-field).

## API

<ApiTable name="SColorPicker" />
