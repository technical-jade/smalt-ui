<script setup lang="ts">
import { computed, useTemplateRef, type ComponentPublicInstance } from 'vue'
import { CheckboxGroupRoot } from 'reka-ui'
import { SFormField } from '../SFormField'
import { SCheckbox } from '../SCheckbox'
import { useDefaults } from '../../composables'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import { useFieldFocus } from '../../internal/useFieldFocus'
import { useFieldValidation } from '../../internal/useFieldValidation'
import type { SCheckboxGroupProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SCheckboxGroupProps>(), {
  orientation: 'vertical',
})
const p = useDefaults(props, 'SCheckboxGroup')
const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()

/** Values of the checked options. Two-way binding via `v-model`. */
const model = defineModel<string[]>()

/**
 * Reka reads a nullish group value as "the group keeps no state" and lets every checkbox fall
 * back to its own `v-model`, which the group never writes to. An empty array keeps the boxes on
 * the group while its model is still empty, and the rules always see a list.
 */
const values = computed({
  get: () => model.value ?? [],
  set: (next: string[]) => {
    model.value = next
  },
})

const root = useTemplateRef<ComponentPublicInstance>('root')
const { errorMessage, onBlur: onLeave, expose } = useFieldValidation(p, () => values.value, root)
const { onFocusIn, onFocusOut } = useFieldFocus(root, () => {}, undefined, onLeave)
defineExpose(expose)

defineSlots<{
  /** Custom set of `SCheckbox` items (instead of the `options` prop); each one needs a `value`. */
  default?: (props: Record<string, never>) => unknown
  /** Group title as markup, when a string `label` is not enough. */
  label?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    :class="rootClass"
    :style="rootStyle"
    :floating-label="false"
    :label="p.label"
    :hint="p.hint"
    :error="errorMessage"
    :invalid="p.invalid"
    :required="p.required"
    :size="p.size"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template
      v-if="$slots.label"
      #label
    >
      <slot name="label" />
    </template>
    <!-- The group title is linked via aria-labelledby: `<label for>` does not work with a
         role="group" container, which has no value of its own. Reka gives the group no role at
         all, so the label would have nothing to name without it. -->
    <template #default="{ id, labelId, describedBy, invalid }">
      <!-- Checkboxes are independent, so each one keeps its own tab stop; Reka's roving focus
           would turn the group into the single tab stop of a radio group. -->
      <CheckboxGroupRoot
        v-bind="controlAttrs"
        :id="id"
        v-model="values"
        class="s-checkbox-group"
        :class="[`s-checkbox-group--${p.orientation}`, p.groupClass]"
        role="group"
        :roving-focus="false"
        :disabled="p.disabled"
        :name="p.name"
        :required="p.required"
        :aria-label="labelId ? undefined : p.ariaLabel"
        :aria-labelledby="labelId"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedBy"
      >
        <slot>
          <SCheckbox
            v-for="option in p.options"
            :key="option.value"
            :value="option.value"
            :label="option.label"
            :hint="option.hint"
            :disabled="option.disabled"
          />
        </slot>
      </CheckboxGroupRoot>
    </template>
  </SFormField>
</template>

<style src="./SCheckboxGroup.scss" lang="scss"></style>
