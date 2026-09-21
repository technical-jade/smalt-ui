<script setup lang="ts">
import { computed, useId } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { SLabel } from '../../internal/SLabel'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import { useColorProp, useDefaults } from '../../composables'
import type { SSwitchProps } from './types'

defineOptions({ inheritAttrs: false })

const props = defineProps<SSwitchProps>()
const p = useDefaults(props, 'SSwitch')

const colorStyle = useColorProp(p, 's-switch')
const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()

/** Switch state. Two-way bound via `v-model`. */
const model = defineModel<boolean>({ default: false })

defineSlots<{
  /** Label text (an alternative to the `label` prop). */
  default?: (props: Record<string, never>) => unknown
}>()

const uid = useId()
const switchId = computed(() => p.id ?? `s-switch-${uid}`)
</script>

<template>
  <div
    class="s-switch"
    :class="[{ 's-switch--disabled': p.disabled }, rootClass]"
    :style="[colorStyle, rootStyle]"
  >
    <SwitchRoot
      v-bind="controlAttrs"
      :id="switchId"
      v-model="model"
      class="s-switch__track"
      :disabled="p.disabled"
      :required="p.required"
      :aria-label="p.ariaLabel"
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

<style src="./SSwitch.scss" lang="scss"></style>
