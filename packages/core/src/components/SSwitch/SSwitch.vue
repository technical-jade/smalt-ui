<script setup lang="ts">
import { useTemplateRef, type ComponentPublicInstance } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { SFormField } from '../SFormField'
import { SLabel } from '../../internal/SLabel'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import { useFieldFocus } from '../../internal/useFieldFocus'
import { useFieldValidation } from '../../internal/useFieldValidation'
import { useColorProp, useDefaults } from '../../composables'
import type { SSwitchProps } from './types'

defineOptions({ inheritAttrs: false })

const props = defineProps<SSwitchProps>()
const p = useDefaults(props, 'SSwitch')

const colorStyle = useColorProp(p, 's-switch')
const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()

/** Switch state. Two-way bound via `v-model`. */
const model = defineModel<boolean>({ default: false })

const root = useTemplateRef<ComponentPublicInstance>('root')
const { errorMessage, onBlur: onLeave, expose } = useFieldValidation(p, () => model.value, root)
const { onFocusIn, onFocusOut } = useFieldFocus(root, () => {}, undefined, onLeave)
defineExpose(expose)

defineSlots<{
  /** Label text (an alternative to the `label` prop). */
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
    inline
    :hint="p.hint"
    :error="errorMessage"
    :invalid="p.invalid"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template #default="{ id: switchId, describedBy, invalid }">
      <div
        class="s-switch"
        :class="{ 's-switch--disabled': p.disabled }"
        :style="colorStyle"
      >
        <SwitchRoot
          v-bind="controlAttrs"
          :id="switchId"
          v-model="model"
          :name="p.name"
          class="s-switch__track"
          :disabled="p.disabled"
          :required="p.required"
          :aria-label="p.ariaLabel"
          :aria-invalid="invalid || undefined"
          :aria-describedby="describedBy"
        >
          <SwitchThumb class="s-switch__thumb" />
        </SwitchRoot>

        <SLabel
          v-if="p.label || $slots.default"
          class="s-switch__label"
          :for="switchId"
          :disabled="p.disabled"
        >
          <slot>{{ p.label }}</slot>
        </SLabel>
      </div>
    </template>
  </SFormField>
</template>

<style src="./SSwitch.scss" lang="scss"></style>
