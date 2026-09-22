<script setup lang="ts">
import {
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
} from 'reka-ui'
import { STag } from '../STag'
import { SIcon } from '../SIcon'
import { useMessages } from '../../composables'

/**
 * Internal branch of `SInput` in `use-tags` mode: Reka TagsInput (add-on-Enter, paste, max,
 * roving focus) plus `STag` chips. Not public — used only from `SInput.vue`.
 */
defineOptions({ inheritAttrs: false })

defineProps<{
  fieldId?: string
  describedBy?: string
  // Comes with the consumer's attrs: it belongs to Reka's hidden inputs, not the typing buffer.
  name?: string
  invalid?: boolean
  placeholder?: string
  disabled?: boolean
  required?: boolean
  icon?: string
  duplicate?: boolean
  addOnPaste?: boolean
  max?: number
  removeIcon?: string
  removeTagLabel?: string
}>()

defineSlots<{
  prepend?: (props: Record<string, never>) => unknown
  append?: (props: Record<string, never>) => unknown
}>()

const model = defineModel<string[]>({ default: () => [] })
const m = useMessages()
</script>

<template>
  <TagsInputRoot
    v-model="model"
    class="s-input__control"
    :class="{ 's-input__control--invalid': invalid }"
    :duplicate="duplicate"
    :add-on-paste="addOnPaste"
    :max="max"
    :disabled="disabled"
    :name="name"
    :required="required"
  >
    <span
      v-if="$slots.prepend"
      class="s-input__prepend"
    >
      <slot name="prepend" />
    </span>
    <SIcon
      v-if="icon"
      class="s-input__leading"
      :icon="icon"
      :size="16"
    />
    <TagsInputItem
      v-for="(tag, index) in model"
      :key="`${tag}-${index}`"
      :value="tag"
      class="s-input__tag-item"
    >
      <STag>
        <TagsInputItemText />
        <template #remove>
          <TagsInputItemDelete
            class="s-tag__remove"
            :aria-label="removeTagLabel ?? m.removeTag"
          >
            <SIcon
              :icon="removeIcon"
              :size="12"
            />
          </TagsInputItemDelete>
        </template>
      </STag>
    </TagsInputItem>

    <TagsInputInput
      v-bind="$attrs"
      :id="fieldId"
      class="s-input__tags-field"
      :placeholder="placeholder"
      :aria-required="required || undefined"
      :aria-describedby="describedBy"
      :aria-invalid="invalid || undefined"
    />
    <span
      v-if="$slots.append"
      class="s-input__append"
    >
      <slot name="append" />
    </span>
  </TagsInputRoot>
</template>
