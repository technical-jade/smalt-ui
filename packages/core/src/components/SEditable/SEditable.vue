<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, type ComponentPublicInstance } from 'vue'
import { EditableArea, EditableInput, EditablePreview, EditableRoot } from 'reka-ui'
import { SButton } from '../SButton'
import { SFormField } from '../SFormField'
import { useDefaults, useMessages } from '../../composables'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import { useFieldFocus } from '../../internal/useFieldFocus'
import { useFieldValidation } from '../../internal/useFieldValidation'
import type { SEditableControlsSlotProps, SEditablePreviewSlotProps, SEditableProps } from './types'

/**
 * The component root is `SFormField`, with the field inside it. If the root inherited attributes,
 * `maxlength`/`autocomplete` and an `@blur` handler would land on the outer `div`: blur does not
 * bubble, so such a handler would silently never fire.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SEditableProps>(), {
  size: 'md',
  activationMode: 'focus',
  submitMode: 'both',
  disabled: false,
  readonly: false,
  required: false,
  invalid: false,
  square: false,
  autoResize: false,
  selectOnFocus: false,
  startWithEditView: false,
  withControls: false,
})
const p = useDefaults(props, 'SEditable')
const m = useMessages()

const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()

const emit = defineEmits<{
  /** The value has been committed; carries the new value. */
  submit: [value: string]
  /** Editing has been dropped (Escape or the cancel control); the value is unchanged. */
  cancel: []
  /** The editor has been opened. */
  edit: []
  /** Focus entered the field. Moving between the value and the controls does not count. */
  focus: [event: FocusEvent]
  /** Focus left the field. Moving between the value and the controls does not count. */
  blur: [event: FocusEvent]
}>()

defineSlots<{
  /**
   * The value as it is shown at rest, instead of plain text. Receives
   * `{ value, isEditing }`; the placeholder is drawn by the field itself when the value is empty.
   */
  preview?: (props: SEditablePreviewSlotProps) => unknown
  /**
   * Replaces the default row of buttons (`with-controls`). Receives
   * `{ isEditing, edit, submit, cancel }`.
   */
  controls?: (props: SEditableControlsSlotProps) => unknown
}>()

/** The committed text value. Two-way binding via `v-model`. */
const model = defineModel<string>({ default: '' })

interface EditableApi {
  edit: () => void
  submit: () => void
  cancel: () => void
}

/**
 * Reka names the input "editable input" in English; the name it gets here comes from the field
 * label, and from the dictionary when the field is rendered without one.
 */
const inputLabel = computed(() => p.ariaLabel ?? (p.label ? undefined : m.value.edit))

const root = useTemplateRef<ComponentPublicInstance>('root')
const preview = useTemplateRef<ComponentPublicInstance>('preview')
const editable = useTemplateRef<EditableApi>('editable')

const previewEl = () => preview.value?.$el as HTMLElement | undefined
const inputEl = () =>
  (root.value?.$el as Element | undefined)?.querySelector<HTMLElement>('.s-editable__input') ??
  undefined

/**
 * Reka reports every state change through `update:state` and has no editing model, so the open
 * editor is tracked here: focusing the field has to reach the input, not the hidden preview.
 */
const editing = ref(p.startWithEditView)

const focusField = () => (editing.value ? inputEl() : previewEl())?.focus()

const {
  errorMessage,
  onBlur: onLeave,
  expose,
} = useFieldValidation(p, () => model.value, root, focusField)
const { onFocusIn, onFocusOut } = useFieldFocus(root, emit, undefined, onLeave)

defineExpose({
  ...expose,
  /** Opens the editor. */
  edit: () => editable.value?.edit(),
  /** Commits the typed value. */
  submit: () => editable.value?.submit(),
  /** Closes the editor, keeping the committed value. */
  cancel: () => editable.value?.cancel(),
})

/**
 * Activation is driven here instead of by Reka (the root gets `activation-mode="none"`): focus
 * returning to the preview after a commit has to skip it, and Reka's own handler cannot be told
 * to stand down for one event. Double click also gains a keyboard equivalent this way.
 */
let restoring = false

const canEdit = () => !p.disabled && !p.readonly && p.activationMode !== 'none'

function activate(trigger: 'focus' | 'dblclick', edit: () => void) {
  if (restoring || !canEdit() || p.activationMode !== trigger) return
  edit()
}

function onPreviewKeydown(event: KeyboardEvent, edit: () => void) {
  if (!canEdit() || (event.key !== 'Enter' && event.key !== ' ')) return
  event.preventDefault()
  edit()
}

/**
 * Reka hides the input it was editing and leaves focus on it, so focus falls to the body. It goes
 * back to the value, with activation suppressed for that one event: in `focus` mode the editor
 * the user has just left would reopen at once.
 */
async function restoreFocus() {
  const rootEl = root.value?.$el as Element | undefined
  const active = document.activeElement
  // Focus has already moved on (a commit on blur): pulling it back would steal the next field.
  if (active && active !== document.body && !rootEl?.contains(active)) return
  restoring = true
  await nextTick()
  previewEl()?.focus()
  restoring = false
}

function onState(state: 'edit' | 'submit' | 'cancel') {
  editing.value = state === 'edit'
  if (state === 'edit') {
    emit('edit')
    return
  }
  if (state === 'cancel') emit('cancel')
  void restoreFocus()
}
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    class="s-editable"
    :class="[`s-editable--${p.size}`, rootClass]"
    :style="rootStyle"
    :label="p.label"
    :hint="p.hint"
    :error="errorMessage"
    :invalid="p.invalid"
    :required="p.required"
    :size="p.size"
    :floating-label="false"
    :square="p.square"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template #default="{ id: fieldId, describedBy, invalid: fieldInvalid }">
      <EditableRoot
        v-slot="{ isEditing, edit, submit, cancel }"
        ref="editable"
        v-model="model"
        class="s-editable__root"
        activation-mode="none"
        :placeholder="p.placeholder ?? ''"
        :disabled="p.disabled"
        :readonly="p.readonly"
        :submit-mode="p.submitMode"
        :max-length="p.maxLength"
        :auto-resize="p.autoResize"
        :select-on-focus="p.selectOnFocus"
        :start-with-edit-mode="p.startWithEditView"
        :name="p.name"
        :required="p.required"
        @submit="emit('submit', $event ?? '')"
        @update:state="onState"
      >
        <EditableArea
          class="s-editable__area"
          :class="{
            's-editable__area--invalid': fieldInvalid,
            's-editable__area--auto': p.autoResize,
          }"
        >
          <EditablePreview
            ref="preview"
            as="div"
            class="s-editable__preview"
            :tabindex="p.disabled ? -1 : 0"
            @focusin="activate('focus', edit)"
            @dblclick="activate('dblclick', edit)"
            @keydown="onPreviewKeydown($event, edit)"
          >
            <slot
              name="preview"
              :value="model"
              :is-editing="isEditing"
              >{{ model || p.placeholder }}</slot
            >
          </EditablePreview>
          <!-- auto-resize: a one-character intrinsic width lets the grid cell follow the text
               instead of the input's native twenty-character box. -->
          <EditableInput
            v-bind="controlAttrs"
            :id="fieldId"
            class="s-editable__input"
            :size="p.autoResize ? 1 : undefined"
            :aria-label="inputLabel"
            :aria-describedby="describedBy"
            :aria-invalid="fieldInvalid || undefined"
          />
        </EditableArea>

        <div
          v-if="p.withControls"
          class="s-editable__controls"
        >
          <slot
            name="controls"
            :is-editing="isEditing"
            :edit="edit"
            :submit="submit"
            :cancel="cancel"
          >
            <SButton
              v-if="!isEditing"
              variant="ghost"
              icon-only
              icon="pencil"
              :size="p.size"
              :disabled="p.disabled || p.readonly"
              :aria-label="p.editLabel ?? m.edit"
              @click="edit"
            />
            <template v-else>
              <SButton
                variant="ghost"
                icon-only
                icon="check"
                :size="p.size"
                :aria-label="p.saveLabel ?? m.save"
                @click="submit"
              />
              <SButton
                variant="ghost"
                icon-only
                icon="x"
                :size="p.size"
                :aria-label="p.cancelLabel ?? m.cancel"
                @click="cancel"
              />
            </template>
          </slot>
        </div>
      </EditableRoot>
    </template>
  </SFormField>
</template>

<style src="./SEditable.scss" lang="scss"></style>
