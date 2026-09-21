<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { SIcon } from '../SIcon'
import { SFormField } from '../SFormField'
import { SLabel } from '../../internal/SLabel'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
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

defineSlots<{
  /** Label text (alternative to the `label` prop). */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <SFormField
    :id="p.id"
    :class="rootClass"
    :style="rootStyle"
    :floating-label="false"
    :inline="!p.stretch"
    :hint="p.hint"
    :error="p.error"
    :invalid="p.invalid"
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
          :disabled="p.disabled"
          :required="p.required"
          :aria-label="p.ariaLabel"
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

        <SLabel
          v-if="p.label || $slots.default"
          class="s-checkbox__label"
          :for="boxId"
          :disabled="p.disabled"
        >
          <slot>{{ p.label }}</slot>
        </SLabel>
      </div>
    </template>
  </SFormField>
</template>

<style src="./SCheckbox.scss" lang="scss"></style>
