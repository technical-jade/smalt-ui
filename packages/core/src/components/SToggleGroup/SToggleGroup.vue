<script setup lang="ts">
import { computed, provide } from 'vue'
import { ToggleGroupRoot } from 'reka-ui'
import { SToggle } from '../SToggle'
import { provideDefaults, useDefaults } from '../../composables'
import { TOGGLE_GROUP_KEY } from './context'
import type { SToggleGroupProps } from './types'

const props = withDefaults(defineProps<SToggleGroupProps>(), {
  size: 'md',
  mandatory: false,
})
const p = useDefaults(props, 'SToggleGroup')

// Tells nested SToggle components that they are group items (see context.ts).
provide(TOGGLE_GROUP_KEY, true)

// SToggle passed through the slot takes the group size as its default; its own size still wins.
provideDefaults(() => ({ SToggle: { size: p.size } }))

/**
 * Selected value (`single`) or array of values (`multiple`). Two-way bound via `v-model`.
 */
const model = defineModel<string | string[]>()

// Resolved here rather than by Reka: the value below is never undefined, so Reka could not tell.
const mode = computed(() => p.type ?? (Array.isArray(model.value) ? 'multiple' : 'single'))

/**
 * Reka keeps its own copy of the value while `modelValue` is undefined and would clear it before
 * `mandatory` can refuse, so the root always gets a defined value.
 */
const rootValue = computed(() => model.value ?? (mode.value === 'multiple' ? [] : null))

function update(next: string | string[] | undefined) {
  if (next === undefined && p.mandatory && mode.value === 'single') return
  model.value = next
}

defineSlots<{
  /** Custom set of `SToggle` (instead of the `options` prop); give each one a `value`. */
  default?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <ToggleGroupRoot
    :model-value="rootValue"
    class="s-toggle-group"
    :type="mode"
    :disabled="p.disabled"
    :aria-label="p.ariaLabel"
    @update:model-value="update($event as string | string[] | undefined)"
  >
    <slot>
      <SToggle
        v-for="opt in p.options"
        :key="opt.value"
        :value="opt.value"
        :size="p.size"
        :disabled="opt.disabled"
      >
        {{ opt.label ?? opt.value }}
      </SToggle>
    </slot>
  </ToggleGroupRoot>
</template>

<style src="./SToggleGroup.scss" lang="scss"></style>
