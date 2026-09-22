<script setup lang="ts">
import { useTemplateRef, type ComponentPublicInstance } from 'vue'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { SIcon } from '../SIcon'
import { SFormField } from '../SFormField'
import { SLabel } from '../../internal/SLabel'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import { useFieldFocus } from '../../internal/useFieldFocus'
import { useFieldValidation } from '../../internal/useFieldValidation'
import { useColorProp, useDefaults } from '../../composables'
import type { SCheckboxProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SCheckboxProps>(), {
  checkedIcon: 'check',
  indeterminateIcon: 'minus',
  align: 'start',
})
const p = useDefaults(props, 'SCheckbox')

const colorStyle = useColorProp(p, 's-checkbox')
const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()

/** Checkbox state. `'indeterminate'` is the mixed state. */
const model = defineModel<boolean | 'indeterminate'>({ default: false })

const root = useTemplateRef<ComponentPublicInstance>('root')
const { errorMessage, onBlur: onLeave, expose } = useFieldValidation(p, () => model.value, root)
const { onFocusIn, onFocusOut } = useFieldFocus(root, () => {}, undefined, onLeave)
defineExpose(expose)

defineSlots<{
  /** Label text (alternative to the `label` prop). */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    :class="rootClass"
    :style="rootStyle"
    :floating-label="false"
    :inline="!p.stretch"
    :hint="p.hint"
    :error="errorMessage"
    :invalid="p.invalid"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template #default="{ id: boxId, describedBy, invalid }">
      <div
        class="s-checkbox"
        :class="{
          's-checkbox--disabled': p.disabled,
          's-checkbox--align-center': p.align === 'center',
          's-checkbox--stretch': p.stretch,
        }"
        :style="colorStyle"
      >
        <CheckboxRoot
          v-bind="controlAttrs"
          :id="boxId"
          v-model="model"
          class="s-checkbox__box"
          :value="p.value"
          :name="p.name"
          :disabled="p.disabled"
          :required="p.required"
          :aria-label="p.ariaLabel"
          :aria-labelledby="p.label || $slots.default ? `${boxId}-label` : undefined"
          :aria-invalid="invalid || undefined"
          :aria-describedby="describedBy"
        >
          <CheckboxIndicator
            class="s-checkbox__indicator"
            aria-hidden="true"
          >
            <SIcon
              v-if="model === 'indeterminate'"
              :icon="p.indeterminateIcon"
              :size="14"
            />
            <SIcon
              v-else
              :icon="p.checkedIcon"
              :size="14"
            />
          </CheckboxIndicator>
        </CheckboxRoot>

        <!-- Reka reads its own aria-label fallback from `[for=id]`'s `innerText`, which does not
             skip aria-hidden content and would pull the required marker into it. An explicit
             aria-labelledby wins over aria-label in the accessible name computation and, unlike
             innerText, excludes aria-hidden descendants. -->
        <SLabel
          v-if="p.label || $slots.default"
          :id="`${boxId}-label`"
          class="s-checkbox__label"
          :for="boxId"
          :required="p.required"
          :disabled="p.disabled"
        >
          <slot>{{ p.label }}</slot>
        </SLabel>
      </div>
    </template>
  </SFormField>
</template>

<style src="./SCheckbox.scss" lang="scss"></style>
