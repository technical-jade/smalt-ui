<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  type ComponentPublicInstance,
} from 'vue'
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
import { useFieldFocus } from '../../internal/useFieldFocus'
import { useFieldValidation } from '../../internal/useFieldValidation'
import { useKeepCaretKeys } from '../../internal/useKeepCaretKeys'
import type { SAutocompleteOption, SAutocompleteProps } from './types'

// The component root is `SFormField`; `maxlength` and `autocomplete` belong on the input inside it.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SAutocompleteProps>(), {
  size: 'md',
  required: false,
  invalid: false,
  disabled: false,
  loading: false,
  freeText: false,
  clearable: true,
  clearIcon: 'x',
})
const p = useDefaults(props, 'SAutocomplete')

const m = useMessages()

const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()

/**
 * Field value: usually the `value` of the selected suggestion; with `free-text`, the input text
 * itself. Two-way binding via `v-model`.
 */
const model = defineModel<string>()

const emit = defineEmits<{
  /**
   * Focus entered the component. Moves inside it (into the panel, to the clear button) do not
   * count.
   */
  focus: [event: FocusEvent]
  /** Focus left the component. Moves inside it (into the panel, to the clear button) do not count. */
  blur: [event: FocusEvent]
  /** The value and the query text were cleared with the clear button. */
  clear: []
  /**
   * The user selected a suggestion with the mouse or keyboard. Fires on every selection,
   * including re-selecting the same suggestion, when `update:modelValue` stays silent because
   * the value did not change.
   */
  select: [option: SAutocompleteOption]
}>()

const root = useTemplateRef<ComponentPublicInstance>('root')
const { errorMessage, onBlur: onLeave, expose } = useFieldValidation(p, () => model.value, root)
/**
 * A click on a suggestion is a selection inside the component, not leaving the field: otherwise
 * the application's `blur` handler would run before the selection, and if it changed the list,
 * the item would vanish between mousedown and mouseup. So `blur` is tracked on the root and the
 * panel rather than on the input: Tab from the input to the clear button is not leaving either,
 * but the next Tab is.
 */
const { onFocusIn, onFocusOut } = useFieldFocus(root, emit, '.s-autocomplete__content', () => {
  awaitingOptions = false
  onLeave()
})
defineExpose(expose)

/**
 * The user's query: what they typed. The application searches by it, usually debounced, and
 * passes the result back into `options`. The component never writes a label here, otherwise the
 * query would be indistinguishable from text the component inserted itself; it only empties the
 * query when the input stops showing the user's text. Writing from outside puts the text into the
 * input, which is how a saved form is restored.
 */
const search = defineModel<string>('search', { default: '' })

/**
 * Text in the input. Kept apart from the query: it also receives the selected label, which the
 * application does not need to see in `search`.
 */
const text = ref(p.freeText ? (model.value ?? '') : search.value)

/**
 * What the input shows right now: the label of the selected value, put there by the component, or
 * the user's own text. Only text the component wrote may be taken back — a typed query stays even
 * when the panel closes.
 */
const showsLabel = ref(!!model.value)

watch(search, (value) => {
  if (p.freeText) return
  // Emptying the query is how the component announces the label it just put in: the label stays.
  if (showsLabel.value && value === '') return
  if (value !== text.value) {
    text.value = value
    showsLabel.value = false
  }
})

function syncText() {
  if (p.freeText && (model.value ?? '') !== text.value) text.value = model.value ?? ''
}

watch(model, syncText)

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  if (p.freeText) {
    awaitingOptions = true
    model.value = value
    return
  }
  search.value = value
  showsLabel.value = false
}

/**
 * In free-text the input shows `v-model`, so after a selection it holds whatever the application
 * left there: its own text from the `select` handler or the suggestion label. The check runs after
 * the prop update, because `watch(model)` stays silent when the application puts back the same
 * value it had before the selection.
 */
function onSelect(option: SAutocompleteOption) {
  if (p.freeText) {
    model.value = option.label
    text.value = option.label
  }
  emit('select', option)
  void nextTick(syncText)
}

/**
 * Reka's value. In free-text the component value is the text and a selection goes out as an
 * event, so Reka gets `null`: no suggestion is marked selected, and picking the same one again
 * does not turn into deselecting it.
 */
const rootModel = computed({
  get: () => (p.freeText ? null : model.value),
  set: (value) => {
    if (!p.freeText) model.value = value ?? undefined
  },
})

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
 * `displayValue` on value change, so the input keeps the name rather than the raw value. A cleared
 * value gets no label, even if the prop has not been updated yet.
 */
const displayValue = () => {
  if (p.freeText) return text.value
  if (model.value) return p.selectedLabel ?? ''
  return mounted.value ? '' : search.value
}

/** Panel state: while it is open, the input text belongs to the user's typing. */
const open = ref(false)

/**
 * Reka asks for `displayValue` only at selection time, so an application with server-side search,
 * which learns `selectedLabel` later, would be left with an empty input: the label is written
 * here instead. While the panel is open the input belongs to the user's query; the check runs
 * again on close, which also catches a value that disappeared meanwhile.
 */
watch([model, () => p.selectedLabel, open], () => {
  if (p.freeText || open.value) return
  // Only the label the component put in is taken back; text the user typed stays in the input.
  if (!model.value && !showsLabel.value) return
  takeOverText(model.value ? (p.selectedLabel ?? '') : '')
})

/**
 * The input stops showing the user's text, so the query behind it is gone as well: left in
 * `search`, it would make the next opening of the panel list suggestions for text nobody sees.
 */
function takeOverText(label: string) {
  if (text.value !== label) text.value = label
  showsLabel.value = !!model.value
  if (search.value !== '') search.value = ''
}

const showClear = computed(() => p.clearable && !p.disabled && (!!model.value || !!text.value))

/**
 * In free-text an empty result is normal, and a "Nothing found" placeholder would get in the way
 * of typing: the panel stays closed without suggestions. Suggestions for the typed text arrive
 * after the input, so the panel also opens when they come — unless the user closed it or left
 * the field.
 */
const showContent = computed(() => !p.freeText || p.loading || p.options.length > 0)
let awaitingOptions = false

function onOpenChange(value: boolean) {
  if (!value) awaitingOptions = false
  open.value = value && showContent.value
}

watch(showContent, (value) => {
  if (!p.freeText) return
  if (!value) open.value = false
  else if (awaitingOptions) open.value = true
})

const anchor = ref<{ $el: Element }>()
useKeepCaretKeys(anchor)

const input = ref<{ $el: HTMLInputElement }>()

function clear() {
  model.value = p.freeText ? '' : undefined
  text.value = ''
  awaitingOptions = false
  if (!p.freeText) search.value = ''
  input.value?.$el.focus()
  emit('clear')
}
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    :floating-label="false"
    class="s-autocomplete"
    :class="[`s-autocomplete--${p.size}`, rootClass]"
    :style="rootStyle"
    :label="p.label"
    :hint="p.hint"
    :error="errorMessage"
    :invalid="p.invalid"
    :required="p.required"
    :size="p.size"
    :square="p.square"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template #default="{ id: fieldId, describedBy, invalid: fieldInvalid }">
      <!-- ignore-filter: the application has already picked the suggestions. If Reka filtered
           them again by substring, fuzzy, transliterated and index search results would vanish
           from the list even though the server returned them.
           reset-search-term-on-blur: leaving the field without a choice is not a reason to throw
           the typed text away — it stays in the input, as it does in `v-model:search`.
           reset-search-term-on-select: in free-text the input text is driven by `v-model`, not
           by Reka. -->
      <ComboboxRoot
        v-model="rootModel"
        :open="open"
        class="s-autocomplete__root"
        ignore-filter
        :reset-search-term-on-blur="false"
        :reset-search-term-on-select="!p.freeText"
        :disabled="p.disabled"
        :name="p.freeText ? undefined : p.name"
        :required="p.freeText ? undefined : p.required"
        @update:open="onOpenChange"
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
            v-bind="controlAttrs"
            :id="fieldId"
            ref="input"
            v-model="text"
            class="s-autocomplete__field"
            :placeholder="p.placeholder"
            :name="p.freeText ? p.name : undefined"
            :required="(p.freeText && p.required) || undefined"
            :display-value="displayValue"
            :aria-label="p.label ? undefined : p.ariaLabel"
            :aria-describedby="describedBy"
            :aria-invalid="fieldInvalid || undefined"
            :aria-required="p.required || undefined"
            @input="onInput"
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
                @select="onSelect(option)"
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
