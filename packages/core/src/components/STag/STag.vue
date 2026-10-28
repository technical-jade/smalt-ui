<script setup lang="ts">
import { SBadge } from '../SBadge'
import { SIcon } from '../SIcon'
import { useDefaults, useMessages } from '../../composables'
import type { STagProps } from './types'

const m = useMessages()

const props = withDefaults(defineProps<STagProps>(), {
  variant: 'neutral',
  size: 'md',
  removable: false,
  removeIcon: 'x',
})
const p = useDefaults(props, 'STag')

const emit = defineEmits<{
  /** Click on the built-in remove button. */
  remove: []
}>()

defineSlots<{
  /** Tag content (text). */
  default?: (props: Record<string, never>) => unknown
  /**
   * Custom remove control instead of the built-in button, e.g. Reka `TagsInputItemDelete`
   * when the tag is used inside an input. Rendered without `removable` too.
   */
  remove?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <SBadge
    class="s-tag"
    :variant="p.variant"
    :square="p.square"
    :color="p.color"
    :text-color="p.textColor"
    :size="p.size"
    :icon="p.icon"
  >
    <slot />
    <slot name="remove">
      <button
        v-if="p.removable"
        type="button"
        class="s-tag__remove"
        :aria-label="p.removeLabel ?? m.removeTag"
        @click="emit('remove')"
      >
        <SIcon
          :icon="p.removeIcon"
          :size="12"
        />
      </button>
    </slot>
  </SBadge>
</template>

<style src="./STag.scss" lang="scss"></style>
