<script setup lang="ts">
import { computed, ref } from 'vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { SFormField } from '../SFormField'
import { useColorProp, useDefaults, useMessages } from '../../composables'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import type { SSliderProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SSliderProps>(), {
  invalid: false,
  required: false,
  disabled: false,
  min: 0,
  max: 100,
  step: 1,
  showValue: false,
  valueAlways: false,
})
const p = useDefaults(props, 'SSlider')

const colorStyle = useColorProp(p, 's-slider')
// The first thumb carries the field id, so the consumer's attributes go there too.
const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()
const m = useMessages()

/**
 * Slider value: a number for a single thumb or an array for a range. Two-way binding via
 * `v-model`. Without an explicit value the slider starts at `min` (see the getter below), not
 * 0: a default in `defineModel` cannot reference `props`, so the fallback lives in the getter.
 */
const model = defineModel<number | number[]>()

/**
 * A range has two thumbs, and the shared field name does not tell them apart by ear, so the
 * edges get separate labels ("Price: start" / "Price: end").
 */
function thumbLabel(index: number, total: number): string | undefined {
  const name = p.label ?? p.ariaLabel
  if (total < 2) return name
  const edge = index === 0 ? m.value.rangeStart : index === total - 1 ? m.value.rangeEnd : undefined
  if (!edge) return name
  return name ? `${name}: ${edge}` : edge
}

const emit = defineEmits<{
  /**
   * The user finished changing the value (released the thumb or pressed a key), unlike
   * `update:modelValue`, which fires on every step of a drag. A number for a single thumb, an
   * array for a range.
   */
  valueCommit: [value: number | number[]]
}>()

// Reka works with an array of values; for a single thumb it is unwrapped back into a number.
const isRange = computed(() => Array.isArray(model.value))
const arrayValue = computed({
  get: () => (Array.isArray(model.value) ? model.value : [model.value ?? p.min]),
  set: (v: number[]) => {
    model.value = Array.isArray(model.value) ? v : v[0]
  },
})

/**
 * The value bubble sits above the active thumb, so its visibility is derived from the control's
 * own state: hover, focus, and drag (Reka exposes no DOM attribute for dragging that plain CSS
 * could hook into).
 */
const dragging = ref(false)
const hovered = ref(false)
const focused = ref(false)
const valueVisible = computed(
  () => !!p.showValue && (!!p.valueAlways || dragging.value || hovered.value || focused.value),
)

function onDragStart(): void {
  dragging.value = true
  hovered.value = true
}
function onDragEnd(): void {
  dragging.value = false
}

defineSlots<{
  /**
   * Value bubble content. Defaults to the number; to show "%" or a "20–70" range, format it
   * here. Rendered for each thumb.
   */
  value: (props: { value: number; index: number }) => unknown
}>()
</script>

<template>
  <SFormField
    :id="p.id"
    :floating-label="false"
    class="s-slider"
    :class="rootClass"
    :style="[colorStyle, rootStyle]"
    :label="p.label"
    :hint="p.hint"
    :error="p.error"
    :invalid="p.invalid"
    :required="p.required"
  >
    <template #default="{ id: fieldId, describedBy, invalid: fieldInvalid }">
      <SliderRoot
        v-model="arrayValue"
        class="s-slider__control"
        :class="{ 's-slider__control--value-always': p.showValue && p.valueAlways }"
        :min="p.min"
        :max="p.max"
        :step="p.step"
        :disabled="p.disabled"
        :name="isRange ? p.name : undefined"
        :required="p.required"
        @value-commit="emit('valueCommit', isRange ? $event : $event[0])"
        @pointerenter="hovered = true"
        @pointerleave="hovered = false"
        @pointerdown="onDragStart"
        @pointerup="onDragEnd"
        @pointercancel="onDragEnd"
        @focusin="focused = true"
        @focusout="focused = false"
      >
        <SliderTrack class="s-slider__track">
          <SliderRange class="s-slider__range" />
        </SliderTrack>
        <SliderThumb
          v-for="(_, i) in arrayValue"
          v-bind="i === 0 ? controlAttrs : {}"
          :id="i === 0 ? fieldId : undefined"
          :key="i"
          class="s-slider__thumb"
          :aria-label="thumbLabel(i, arrayValue.length)"
          :aria-describedby="i === 0 ? describedBy : undefined"
          :aria-invalid="fieldInvalid || undefined"
        >
          <span
            v-if="p.showValue"
            class="s-slider__value"
            :class="{ 's-slider__value--visible': valueVisible }"
            aria-hidden="true"
          >
            <slot
              name="value"
              :value="arrayValue[i]"
              :index="i"
              >{{ arrayValue[i] }}</slot
            >
          </span>
        </SliderThumb>
      </SliderRoot>
      <!-- Reka names form values by index, "price[0]"; a single thumb submits a plain "price". -->
      <input
        v-if="p.name && !isRange"
        type="hidden"
        :name="p.name"
        :value="arrayValue[0]"
        :disabled="p.disabled"
      />
    </template>
  </SFormField>
</template>

<style src="./SSlider.scss" lang="scss"></style>
