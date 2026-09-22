<script setup lang="ts">
import { computed, ref, useTemplateRef, type ComponentPublicInstance } from 'vue'
import { RatingItem, RatingItemIndicator, RatingRoot } from 'reka-ui'
import { SFormField } from '../SFormField'
import { SIcon } from '../SIcon'
import { useColorProp, useDefaults, useMessages } from '../../composables'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import { useFieldFocus } from '../../internal/useFieldFocus'
import { useFieldValidation } from '../../internal/useFieldValidation'
import type { SRatingProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SRatingProps>(), {
  size: 'md',
  length: 5,
  readonly: false,
  disabled: false,
  allowHalf: false,
  clearable: false,
  icon: 'star',
  selectedIcon: 'star',
})
const p = useDefaults(props, 'SRating')

const colorStyle = useColorProp(p, 's-rating')
const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()
const m = useMessages()

/** Current rating (a number). Two-way bound via `v-model`. */
const model = defineModel<number>({ default: 0 })

const root = useTemplateRef<ComponentPublicInstance>('root')
const { errorMessage, onBlur: onLeave, expose } = useFieldValidation(p, () => model.value, root)
const { onFocusIn, onFocusOut } = useFieldFocus(root, () => {}, undefined, onLeave)
defineExpose(expose)

/**
 * Rating under the pointer, previewed instead of the value. Reka `hoverable` is not used: it
 * never clears the hovered rating when the pointer leaves, so the preview would stick.
 */
const hovered = ref(0)
const interactive = computed(() => !p.readonly && !p.disabled)

function preview(step: number) {
  if (interactive.value) hovered.value = step
}

/**
 * readonly ≠ disabled: the rating does not change, but the control stays in the tab order and
 * is announced as "read-only" rather than "unavailable". Reka has no readonly of its own, so
 * writes are dropped here; passing `disabled` is not an option because it removes focusability.
 */
const value = computed<number>({
  get: () => model.value,
  set: (next) => {
    if (!p.readonly) model.value = next
    hovered.value = 0
  },
})

/**
 * Fill ratio of star `i` (0 | 0.5 | 1). Unlike `Math.round(model)`, it shows fractional ratings
 * correctly: a half with `allowHalf` and read-only averages (e.g. 3.7).
 */
function fillRatio(i: number): number {
  const value = hovered.value || (model.value ?? 0)
  if (value >= i) return 1
  if (p.allowHalf && value >= i - 0.5) return 0.5
  return 0
}
</script>

<template>
  <SFormField
    ref="root"
    :class="rootClass"
    :style="rootStyle"
    :floating-label="false"
    inline
    :hint="p.hint"
    :error="errorMessage"
    :invalid="p.invalid"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template #default="{ describedBy, invalid }">
      <RatingRoot
        v-bind="controlAttrs"
        v-model="value"
        class="s-rating"
        :class="{ 's-rating--disabled': p.disabled, 's-rating--readonly': p.readonly }"
        :style="colorStyle"
        :length="p.length"
        :disabled="p.disabled"
        :aria-readonly="p.readonly || undefined"
        :clearable="p.clearable"
        :step="p.allowHalf ? 0.5 : 1"
        :aria-label="p.ariaLabel"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedBy"
        @mouseleave="hovered = 0"
      >
        <RatingItem
          v-for="i in p.length"
          :key="i"
          v-slot="{ steps }"
          :item="i"
          class="s-rating__item"
          :class="{
            's-rating__item--active': fillRatio(i) === 1,
            's-rating__item--half': fillRatio(i) === 0.5,
          }"
        >
          <span class="s-rating__glyphs">
            <SIcon
              class="s-rating__star s-rating__star--bg"
              :icon="p.icon"
              :size="p.size"
            />
            <SIcon
              class="s-rating__star s-rating__star--fg"
              :icon="p.selectedIcon"
              :size="p.size"
            />
          </span>

          <!--
            Click, focus and arrow keys live in RatingItemIndicator (a Reka RadioGroupItem inside):
            RatingItem itself is only a <label> with the list of steps. The indicators are laid out
            as transparent areas over the star (one step wide); fillRatio draws the fill.
          -->
          <RatingItemIndicator
            v-for="step in steps"
            :key="step"
            :step="step"
            class="s-rating__step"
            :aria-label="`${m.rating} ${step}`"
            @mouseenter="preview(step)"
          >
            <span class="s-rating__hit" />
          </RatingItemIndicator>
        </RatingItem>
      </RatingRoot>
    </template>
  </SFormField>
</template>

<style src="./SRating.scss" lang="scss"></style>
