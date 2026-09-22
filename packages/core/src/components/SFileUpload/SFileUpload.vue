<script setup lang="ts">
import { computed, ref, useTemplateRef, type ComponentPublicInstance } from 'vue'
import { SFormField } from '../SFormField'
import { SIcon } from '../SIcon'
import { useDefaults, useFormatLocale, useMessages } from '../../composables'
import { useFieldAttrs } from '../../internal/useFieldAttrs'
import { useFieldFocus } from '../../internal/useFieldFocus'
import { useFieldValidation } from '../../internal/useFieldValidation'
import type { SFileUploadFileSlotProps, SFileUploadProps, SFileUploadRejection } from './types'

/**
 * The component root is `SFormField`, with the file input inside it. If the root inherited
 * attributes, `name` and an `@change` handler would land on the outer `div` instead of the input.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SFileUploadProps>(), {
  size: 'md',
  disabled: false,
  required: false,
  invalid: false,
  multiple: false,
  dropzone: true,
  icon: 'upload',
  removable: true,
  removeIcon: 'x',
  showList: true,
})
const p = useDefaults(props, 'SFileUpload')

const emit = defineEmits<{
  /**
   * Files refused by `accept`, `maxSize` or `maxFiles`. They never enter the model; the payload
   * carries the reason and the message, so the app can report the failure its own way.
   */
  reject: [rejections: SFileUploadRejection[]]
}>()

defineSlots<{
  /** Content of the drop zone (or of the compact button) instead of the default text. */
  hint?: (props: Record<string, never>) => unknown
  /**
   * One row of the selected list. Receives `{ file, index, remove }` — this is where an app
   * draws its own upload progress.
   */
  file?: (props: SFileUploadFileSlotProps) => unknown
  /** Shown in place of the list while nothing is selected. */
  empty?: (props: Record<string, never>) => unknown
}>()

/**
 * Selected files. Always an array, `multiple` or not: a single-file field holds an array of one,
 * so the value type does not change with the prop.
 */
const model = defineModel<File[]>({ default: () => [] })
const files = computed(() => model.value ?? [])

const m = useMessages()
// No locale prop here: only the size number is formatted, and it follows the library locale.
const locale = useFormatLocale(() => undefined)

const root = useTemplateRef<ComponentPublicInstance>('root')
const input = useTemplateRef<HTMLInputElement>('input')
const { errorMessage, onBlur: onLeave, expose } = useFieldValidation(p, () => files.value, root)
const { onFocusIn, onFocusOut } = useFieldFocus(root, () => {}, undefined, onLeave)
defineExpose(expose)

const { rootClass, rootStyle, controlAttrs } = useFieldAttrs()

// The suffixes read the same in every locale the library ships, so only the number is formatted.
const UNITS = ['B', 'KB', 'MB', 'GB', 'TB']

function formatSize(bytes: number): string {
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024
    unit += 1
  }
  const fraction = unit === 0 || value >= 100 ? 0 : 1
  const number = new Intl.NumberFormat(locale.value, { maximumFractionDigits: fraction })
  return `${number.format(value)} ${UNITS[unit]}`
}

const fill = (template: string, max: string) => template.replace('{max}', max)

/**
 * The native `accept` filters the dialog only; a dropped file bypasses it, so the same tokens are
 * matched here. A file dragged from an archive or a camera can arrive with an empty `type`, which
 * only an extension token can match.
 */
function matchesAccept(file: File): boolean {
  const accept = p.accept?.trim()
  if (!accept) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return accept.split(',').some((entry) => {
    const token = entry.trim().toLowerCase()
    if (!token) return false
    if (token.startsWith('.')) return name.endsWith(token)
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1))
    return type === token
  })
}

// The message of the last selection, shown only while the app supplies no `error` of its own.
const rejection = ref<string>()
const shownError = computed(() => p.error || rejection.value || errorMessage.value)

function select(incoming: readonly File[]) {
  if (p.disabled) return
  const kept = p.multiple ? [...files.value] : []
  const limit = p.multiple ? p.maxFiles : 1
  const accepted: File[] = []
  const rejected: SFileUploadRejection[] = []

  for (const file of incoming) {
    if (!matchesAccept(file)) {
      rejected.push({ file, reason: 'type', message: m.value.fileTypeRejected })
    } else if (p.maxSize != null && file.size > p.maxSize) {
      const message = fill(m.value.fileTooLarge, formatSize(p.maxSize))
      rejected.push({ file, reason: 'size', message })
    } else if (limit != null && kept.length + accepted.length >= limit) {
      rejected.push({ file, reason: 'count', message: fill(m.value.tooManyFiles, String(limit)) })
    } else {
      accepted.push(file)
    }
  }

  rejection.value = rejected[0]?.message
  if (rejected.length) emit('reject', rejected)
  if (accepted.length) model.value = [...kept, ...accepted]
}

function onChange(event: Event) {
  const el = event.target as HTMLInputElement
  select(Array.from(el.files ?? []))
  // Picking the same file twice in a row fires no `change` unless the input is emptied first.
  el.value = ''
}

function remove(index: number) {
  rejection.value = undefined
  model.value = files.value.filter((_, i) => i !== index)
  input.value?.focus()
}

/**
 * Depth counter, not a flag: `dragleave` fires every time the pointer crosses into a child of
 * the zone, and a plain flag would drop the highlight while the file is still over the area.
 */
const dragDepth = ref(0)
const dragging = computed(() => dragDepth.value > 0)

function onDragEnter() {
  if (!p.disabled) dragDepth.value += 1
}

function onDragOver(event: DragEvent) {
  // Without a prevented dragover the browser refuses the drop and opens the file instead.
  if (p.disabled || !event.dataTransfer) return
  event.dataTransfer.dropEffect = 'copy'
}

function onDragLeave() {
  dragDepth.value = Math.max(0, dragDepth.value - 1)
}

function onDrop(event: DragEvent) {
  dragDepth.value = 0
  select(Array.from(event.dataTransfer?.files ?? []))
}

const zoneText = computed(() =>
  p.dropzone ? (p.dropHint ?? m.value.dropFilesHint) : (p.buttonLabel ?? m.value.chooseFiles),
)
const iconSize = computed(() => (p.dropzone ? 24 : 16))
</script>

<template>
  <SFormField
    :id="p.id"
    ref="root"
    class="s-file-upload"
    :class="[`s-file-upload--${p.size}`, rootClass]"
    :style="rootStyle"
    :label="p.label"
    :hint="p.hint"
    :error="shownError"
    :invalid="p.invalid"
    :required="p.required"
    :size="p.size"
    :floating-label="false"
    :square="p.square"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template #default="{ id: fieldId, labelId, describedBy, invalid: fieldInvalid }">
      <!-- The zone is the input's own label, so a click and the keyboard both open the dialog;
           the input stays focusable (never display: none) and the zone shows its focus ring.
           `required` is announced through ARIA only: a native one on a hidden control leaves the
           browser with nothing to point its validation bubble at, and the submit stalls. -->
      <label
        class="s-file-upload__zone"
        :class="{
          's-file-upload__zone--compact': !p.dropzone,
          's-file-upload__zone--dragging': dragging,
          's-file-upload__zone--invalid': fieldInvalid,
          's-file-upload__zone--disabled': p.disabled,
        }"
        :for="fieldId"
        @dragenter.prevent="onDragEnter"
        @dragover.prevent="onDragOver"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop"
      >
        <input
          v-bind="controlAttrs"
          :id="fieldId"
          ref="input"
          class="s-file-upload__input"
          type="file"
          :multiple="p.multiple"
          :accept="p.accept"
          :disabled="p.disabled"
          :aria-required="p.required || undefined"
          :aria-labelledby="labelId"
          :aria-describedby="describedBy"
          :aria-invalid="fieldInvalid || undefined"
          @change="onChange"
        />
        <SIcon
          v-if="p.icon"
          class="s-file-upload__icon"
          :icon="p.icon"
          :size="iconSize"
        />
        <span class="s-file-upload__text">
          <slot name="hint">{{ zoneText }}</slot>
        </span>
      </label>

      <div
        v-if="p.showList && files.length"
        class="s-file-upload__list"
        role="list"
      >
        <div
          v-for="(file, index) in files"
          :key="`${file.name}-${index}`"
          class="s-file-upload__item"
          role="listitem"
        >
          <slot
            name="file"
            :file="file"
            :index="index"
            :remove="() => remove(index)"
          >
            <span class="s-file-upload__name">{{ file.name }}</span>
            <span class="s-file-upload__size">{{ formatSize(file.size) }}</span>
            <button
              v-if="p.removable"
              type="button"
              class="s-file-upload__remove"
              :disabled="p.disabled"
              :aria-label="`${p.removeLabel ?? m.removeFile}: ${file.name}`"
              @click="remove(index)"
            >
              <SIcon
                :icon="p.removeIcon"
                :size="16"
              />
            </button>
          </slot>
        </div>
      </div>
      <div
        v-else-if="p.showList && $slots.empty"
        class="s-file-upload__empty"
      >
        <slot name="empty" />
      </div>
    </template>
  </SFormField>
</template>

<style src="./SFileUpload.scss" lang="scss"></style>
