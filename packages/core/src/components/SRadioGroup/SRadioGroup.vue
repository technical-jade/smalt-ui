<script setup lang="ts">
import { RadioGroupRoot } from 'reka-ui'
import { SFormField } from '../SFormField'
import { SRadio } from '../SRadio'
import { useDefaults } from '../../composables'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import type { SRadioGroupProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SRadioGroupProps>(), {
  orientation: 'vertical',
})
const p = useDefaults(props, 'SRadioGroup')
const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()

/** Selected value of the group. Two-way binding via `v-model`. */
const model = defineModel<string>()

const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

/**
 * An arrow key must both move focus and select the option (WAI-ARIA Radio Group pattern).
 * Reka selects with a delay and only while the key is held; `keyup` clears the flag, so on a
 * quick press focus moves without selecting. Reka handles navigation; the group only clicks
 * the option that already has focus.
 */
function selectFocused(event: KeyboardEvent) {
  if (!ARROW_KEYS.includes(event.key)) return
  const group = event.currentTarget as HTMLElement
  setTimeout(() => {
    const active = document.activeElement
    if (
      active instanceof HTMLElement &&
      group.contains(active) &&
      active.getAttribute('aria-checked') === 'false'
    ) {
      active.click()
    }
  })
}

defineSlots<{
  /** Custom set of `SRadio` items (instead of the `options` prop). */
  default?: (props: Record<string, never>) => unknown
  /** Group title as markup, when a string `label` is not enough. */
  label?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <SFormField
    :id="p.id"
    :class="rootClass"
    :style="rootStyle"
    :floating-label="false"
    :label="p.label"
    :hint="p.hint"
    :error="p.error"
    :invalid="p.invalid"
    :required="p.required"
  >
    <template
      v-if="$slots.label"
      #label
    >
      <slot name="label" />
    </template>
    <!-- The group title is linked via aria-labelledby: `<label for>` does not work with a
         role="radiogroup" container, which has no value of its own. -->
    <template #default="{ id, labelId, describedBy, invalid }">
      <RadioGroupRoot
        v-bind="controlAttrs"
        :id="id"
        v-model="model"
        class="s-radio-group"
        :class="[`s-radio-group--${p.orientation}`, p.groupClass]"
        :disabled="p.disabled"
        :name="p.name"
        :required="p.required"
        :aria-label="labelId ? undefined : p.ariaLabel"
        :aria-labelledby="labelId"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedBy"
        @keydown="selectFocused"
      >
        <slot>
          <SRadio
            v-for="option in p.options"
            :key="option.value"
            :value="option.value"
            :label="option.label"
            :disabled="option.disabled"
          />
        </slot>
      </RadioGroupRoot>
    </template>
  </SFormField>
</template>

<style src="./SRadioGroup.scss" lang="scss"></style>
