<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxViewport,
} from 'reka-ui'
import { SFormField } from '../SFormField'
import { SIcon } from '../SIcon'
import { SSpinner } from '../SSpinner'
import { useDefaults, useElevationProp, useMessages } from '../../composables'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import { useKeepCaretKeys } from '../../internal/useKeepCaretKeys'
import type { SAutocompleteOption, SAutocompleteProps } from './types'

/**
 * The component root is `SFormField`, the input sits inside it. If the root inherited attributes,
 * `maxlength` and a `@blur` handler would land on the outer `div`: blur does not bubble, so that
 * handler would silently never fire.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SAutocompleteProps>(), {
  size: 'md',
  required: false,
  invalid: false,
  disabled: false,
  loading: false,
  clearable: true,
  clearIcon: 'x',
})
const p = useDefaults(props, 'SAutocomplete')

const m = useMessages()

const { attrs, rootClass, rootStyle, controlAttrs } = useFieldAttrs()
// onBlur goes through the filter below.
const fieldAttrs = computed(() =>
  Object.fromEntries(Object.entries(controlAttrs.value).filter(([key]) => key !== 'onBlur')),
)

/**
 * A click on a suggestion is a selection inside the component, not leaving the field. List items
 * are focusable, so a mouse press first takes focus off the input: the application handler runs
 * before the selection, and if it changes the list, the item disappears between mousedown and
 * mouseup, so no click happens at all. Blur is passed out only when focus leaves the component.
 */
function onBlur(event: FocusEvent) {
  const next = event.relatedTarget
  if (next instanceof Element && next.closest('.s-autocomplete__root, .s-autocomplete__content')) {
    return
  }
  const handler = attrs.onBlur as ((event: FocusEvent) => void) | undefined
  const handlers = Array.isArray(handler) ? handler : [handler]
  handlers.forEach((fn) => fn?.(event))
}

/** Selected value: the suggestion's `value`. Two-way binding via `v-model`. */
const model = defineModel<string>()

/**
 * The user's query: what they typed. The application searches by it, usually debounced, and
 * passes the result back into `options`. The component writes only typed text here (and an empty
 * string from the clear button): the selected label and the reset on panel close do not get here,
 * otherwise the query would be indistinguishable from text the component inserted itself. Writing
 * from outside puts the text into the input, which is how a saved form is restored.
 */
const search = defineModel<string>('search', { default: '' })

/**
 * Text in the input. Kept apart from the query: it also receives the selected label and the reset
 * on panel close, which the application does not need to see in `search`.
 */
const text = ref(search.value)

watch(search, (value) => {
  if (value !== text.value) text.value = value
})

function onInput(event: Event) {
  search.value = (event.target as HTMLInputElement).value
}

const emit = defineEmits<{
  /** The value and the query text were cleared with the clear button. */
  clear: []
  /**
   * The user selected a suggestion with the mouse or keyboard. Fires on every selection,
   * including re-selecting the same suggestion, when `update:modelValue` stays silent because
   * the value did not change.
   */
  select: [option: SAutocompleteOption]
}>()

defineSlots<{
  /** Content at the start of the field, inside the frame (icon, country flag, button). */
  prepend?: (props: Record<string, never>) => unknown
  /** Content at the end of the field, inside the frame. */
  append?: (props: Record<string, never>) => unknown
  /** List row instead of the label. Receives the scoped props `{ option, index }`. */
  option?: (props: { option: SAutocompleteOption; index: number }) => unknown
  /** Panel content when there are no suggestions. */
  empty?: (props: Record<string, never>) => unknown
  /** Panel content while a request is in flight. */
  loading?: (props: Record<string, never>) => unknown
}>()

const elevationStyle = useElevationProp(p, 's-surface')

/**
 * Panel variables: the panel is teleported, so they travel with it rather than on the field root.
 * A number in maxHeight means pixels, as with width/height in Vue bindings.
 */
const contentStyle = computed(() => {
  const maxHeight =
    p.maxHeight == null
      ? undefined
      : {
          '--s-autocomplete-max-height':
            typeof p.maxHeight === 'number' ? `${p.maxHeight}px` : p.maxHeight,
        }
  if (!maxHeight && !elevationStyle.value) return undefined
  return { ...maxHeight, ...elevationStyle.value }
})

// Reka's first call comes before mount: an empty string would overwrite a preset search.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
/**
 * After a selection the suggestion list is empty, so the label comes from the prop. Reka calls
 * `displayValue` on blur and on value change, so the input keeps the name rather than the raw
 * value. A cleared value gets no label, even if the prop has not been updated yet.
 */
const displayValue = () => {
  if (model.value) return p.selectedLabel ?? ''
  return mounted.value ? '' : search.value
}

/** Panel state: tells whether the input text belongs to the user or to the label. */
const open = ref(false)

/**
 * Reka asks for `displayValue` only at selection time and when the panel closes. An application
 * with server-side search learns `selectedLabel` later, when nothing calls it anymore, and the
 * input stays empty until the next close. So the label is written here. While the panel is open,
 * the input text belongs to the user's query, and the label does not override it.
 */
watch([model, () => p.selectedLabel, open], ([value], [prevValue, , prevOpen]) => {
  if (open.value) return
  // Without a value, the input is cleared by a selection reset or panel close, not a label update.
  if (!value && value === prevValue && prevOpen === open.value) return
  const label = displayValue()
  if (text.value !== label) text.value = label
})

const showClear = computed(() => p.clearable && !p.disabled && (!!model.value || !!text.value))

const anchor = ref<{ $el: Element }>()
useKeepCaretKeys(anchor)

const input = ref<{ $el: HTMLInputElement }>()

function clear() {
  model.value = undefined
  text.value = ''
  search.value = ''
  input.value?.$el.focus()
  emit('clear')
}
</script>

<template>
  <SFormField
    :id="p.id"
    :floating-label="false"
    class="s-autocomplete"
    :class="[`s-autocomplete--${p.size}`, rootClass]"
    :style="rootStyle"
    :label="p.label"
    :hint="p.hint"
    :error="p.error"
    :invalid="p.invalid"
    :required="p.required"
    :size="p.size"
    :square="p.square"
  >
    <template #default="{ id: fieldId, describedBy, invalid: fieldInvalid }">
      <!-- ignore-filter: the application has already picked the suggestions. If Reka filtered
           them again by substring, fuzzy, transliterated and index search results would vanish
           from the list even though the server returned them. -->
      <ComboboxRoot
        v-model="model"
        v-model:open="open"
        class="s-autocomplete__root"
        ignore-filter
        :disabled="p.disabled"
        :name="p.name"
        :required="p.required"
      >
        <ComboboxAnchor
          ref="anchor"
          class="s-autocomplete__control"
          :class="{ 's-autocomplete__control--invalid': fieldInvalid }"
        >
          <span
            v-if="$slots.prepend"
            class="s-autocomplete__prepend"
          >
            <slot name="prepend" />
          </span>
          <SIcon
            v-if="p.icon"
            class="s-autocomplete__icon"
            :icon="p.icon"
            :size="16"
          />

          <ComboboxInput
            v-bind="fieldAttrs"
            :id="fieldId"
            ref="input"
            v-model="text"
            class="s-autocomplete__field"
            :placeholder="p.placeholder"
            :display-value="displayValue"
            :aria-label="p.label ? undefined : p.ariaLabel"
            :aria-describedby="describedBy"
            :aria-invalid="fieldInvalid || undefined"
            :aria-required="p.required || undefined"
            @input="onInput"
            @blur="onBlur"
          />

          <SSpinner
            v-if="p.loading"
            class="s-autocomplete__spinner"
            size="sm"
            :label="m.loading"
          />
          <button
            v-if="showClear"
            type="button"
            class="s-autocomplete__clear"
            :aria-label="p.clearLabel ?? m.clear"
            @click="clear"
          >
            <SIcon
              :icon="p.clearIcon"
              :size="16"
            />
          </button>
          <span
            v-if="$slots.append"
            class="s-autocomplete__append"
          >
            <slot name="append" />
          </span>
        </ComboboxAnchor>

        <ComboboxPortal>
          <!-- Focus stays in the input: otherwise a mouse selection moves it to an item that
               disappears right away with the updated list. -->
          <ComboboxContent
            class="s-autocomplete__content"
            :class="{ 's-autocomplete__content--square': p.square }"
            :style="contentStyle"
            position="popper"
            :side-offset="4"
            @mousedown.prevent
          >
            <ComboboxViewport class="s-autocomplete__viewport">
              <div
                v-if="p.loading"
                class="s-autocomplete__status"
              >
                <slot name="loading">
                  <SSpinner size="sm" />
                  {{ m.loading }}
                </slot>
              </div>
              <ComboboxEmpty
                v-else
                class="s-autocomplete__status"
              >
                <slot name="empty">{{ p.emptyText ?? m.autocompleteEmpty }}</slot>
              </ComboboxEmpty>

              <ComboboxItem
                v-for="(option, index) in p.loading ? [] : p.options"
                :key="option.value"
                class="s-autocomplete__item"
                :value="option.value"
                :disabled="option.disabled"
                @select="emit('select', option)"
              >
                <slot
                  name="option"
                  :option="option"
                  :index="index"
                  >{{ option.label }}</slot
                >
              </ComboboxItem>
            </ComboboxViewport>
          </ComboboxContent>
        </ComboboxPortal>
      </ComboboxRoot>
    </template>
  </SFormField>
</template>

<style src="./SAutocomplete.scss" lang="scss"></style>
