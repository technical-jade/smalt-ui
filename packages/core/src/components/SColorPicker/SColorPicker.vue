<script setup lang="ts">
import {
  ColorAreaRoot,
  ColorAreaArea,
  ColorAreaThumb,
  ColorSliderRoot,
  ColorSliderTrack,
  ColorSliderThumb,
  ColorSwatchPickerRoot,
  ColorSwatchPickerItem,
  ColorSwatchPickerItemSwatch,
} from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { parseColor, convertToHsb } from 'reka-ui'
import { SPopover } from '../SPopover'
import { SColorField } from '../SColorField'
import { useDefaults, useMessages } from '../../composables'
import type { SColorPickerProps } from './types'

const props = withDefaults(defineProps<SColorPickerProps>(), {
  withAlpha: false,
  hideInput: false,
  disabled: false,
})
const p = useDefaults(props, 'SColorPicker')

const m = useMessages()

/** Selected color in hex (for example `#3B82F6`). Two-way binding via `v-model`. */
const model = defineModel<string>({ default: '#3B82F6' })

type Color = ReturnType<typeof parseColor>

/**
 * The hue is stored separately from the hex model. A hex string loses the hue on achromatic
 * colors (black/white/gray: s=0 or b=0), and the area's hue backdrop would reset to red. The
 * Color object keeps hue as a separate channel, so it is taken from the Reka `@update:color`
 * event (while dragging the area or the hue slider) and from external hex changes.
 */
function hueOf(hex: string): number {
  try {
    return convertToHsb(parseColor(hex)).h
  } catch {
    return 0
  }
}

const hue = ref(hueOf(model.value))

function onColor(color: Color): void {
  hue.value = convertToHsb(color).h
}

watch(model, (hex) => {
  try {
    const hsb = convertToHsb(parseColor(hex))
    // Hue is undefined for achromatic values; keep the previous one to avoid a hue jump.
    if (hsb.s > 0 && hsb.b > 0) hue.value = hsb.h
  } catch {
    // invalid input in the hex field leaves the hue unchanged
  }
})

// Area background = pure hue (from the stored hue) + saturation and brightness overlays.
const areaStyle = computed(() => ({ backgroundColor: `hsl(${hue.value}, 100%, 50%)` }))
</script>

<template>
  <!--
    The wrapper provides the root BEM class: SPopover renders a fragment (PopoverRoot has no
    node of its own), so a class on it is lost and the consumer could not target the root the
    way they do with other components.
  -->
  <span class="s-color-picker">
    <!-- The panel is an SPopover: shadow props go to it, there is no separate surface here. -->
    <SPopover
      :aria-label="p.ariaLabel ?? m.colorPicker"
      :flat="p.flat"
      :elevation="p.elevation"
    >
      <template #trigger>
        <button
          type="button"
          class="s-color-picker__trigger"
          :disabled="p.disabled"
          :aria-label="p.ariaLabel ?? (p.label ? undefined : m.pickColor)"
        >
          <span
            class="s-color-picker__preview"
            :style="{ backgroundColor: model }"
            aria-hidden="true"
          />
          <span
            v-if="p.label"
            class="s-color-picker__label"
            >{{ p.label }}</span
          >
        </button>
      </template>

      <div class="s-color-picker__panel">
        <ColorAreaRoot
          v-model="model"
          class="s-color-picker__area"
          color-space="hsb"
          x-channel="saturation"
          y-channel="brightness"
          :disabled="p.disabled"
          @update:color="onColor"
        >
          <ColorAreaArea
            class="s-color-picker__area-bg"
            :style="areaStyle"
          >
            <ColorAreaThumb class="s-color-picker__thumb" />
          </ColorAreaArea>
        </ColorAreaRoot>

        <div class="s-color-picker__sliders">
          <ColorSliderRoot
            v-model="model"
            class="s-color-picker__slider s-color-picker__slider--hue"
            channel="hue"
            :disabled="p.disabled"
            @update:color="onColor"
          >
            <ColorSliderTrack class="s-color-picker__track">
              <ColorSliderThumb class="s-color-picker__thumb" />
            </ColorSliderTrack>
          </ColorSliderRoot>

          <ColorSliderRoot
            v-if="p.withAlpha"
            v-model="model"
            class="s-color-picker__slider s-color-picker__slider--alpha"
            channel="alpha"
            :disabled="p.disabled"
            @update:color="onColor"
          >
            <ColorSliderTrack class="s-color-picker__track s-color-picker__track--alpha">
              <ColorSliderThumb class="s-color-picker__thumb" />
            </ColorSliderTrack>
          </ColorSliderRoot>
        </div>

        <ColorSwatchPickerRoot
          v-if="p.swatches && p.swatches.length"
          v-model="model"
          class="s-color-picker__swatches"
          :disabled="p.disabled"
          :aria-label="p.swatchesLabel ?? m.colorSwatches"
        >
          <ColorSwatchPickerItem
            v-for="color in p.swatches"
            :key="color"
            :value="color"
            class="s-color-picker__swatch"
          >
            <ColorSwatchPickerItemSwatch class="s-color-picker__swatch-fill" />
          </ColorSwatchPickerItem>
        </ColorSwatchPickerRoot>

        <SColorField
          v-if="!p.hideInput"
          v-model="model"
          label="HEX"
          class="s-color-picker__input"
          :square="p.square"
          :disabled="p.disabled"
        />
      </div>
    </SPopover>
  </span>
</template>

<style src="./SColorPicker.scss" lang="scss"></style>
