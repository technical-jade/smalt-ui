<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { SFormField, useValidation, type SRule, type SValidateOn } from '@smalt-ui/core'

const props = defineProps<{
  label?: string
  name?: string
  rules?: SRule<string>[]
  validateOn?: SValidateOn
  error?: string
  disabled?: boolean
}>()

const model = defineModel<string>({ default: '' })
const input = useTemplateRef<HTMLInputElement>('input')

const { errorMessage, invalid, validating, onBlur, validate, resetValidation } = useValidation({
  value: model,
  rules: () => props.rules,
  validateOn: () => props.validateOn,
  error: () => props.error,
  disabled: () => props.disabled,
  name: () => props.name,
  focus: () => input.value?.focus(),
  el: () => input.value,
})

defineExpose({ validate, resetValidation, errorMessage, invalid, validating })
</script>

<template>
  <SFormField
    v-slot="{ id, describedBy, invalid: marked }"
    :label="label"
    :error="errorMessage"
  >
    <div
      class="color-code"
      :class="{ 'color-code--invalid': marked }"
      @focusout="onBlur"
    >
      <span>#</span>
      <input
        :id="id"
        ref="input"
        v-model="model"
        :name="name"
        :disabled="disabled"
        :aria-describedby="describedBy"
        :aria-invalid="marked || undefined"
      />
    </div>
  </SFormField>
</template>

<style scoped>
.color-code {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 2.5rem;
  padding: 0 12px;
  border: 1px solid var(--s-color-outline);
  border-radius: var(--s-radius-sm);
  background: var(--s-color-surface);
  color: var(--s-color-text);
}
.color-code:focus-within {
  border-color: var(--s-color-primary);
}
.color-code--invalid {
  border-color: var(--s-color-negative);
}
.color-code input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
}
</style>
