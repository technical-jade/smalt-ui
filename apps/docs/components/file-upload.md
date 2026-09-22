<script setup>
import { ref } from 'vue'
import { required } from '@smalt-ui/core'

const basic = ref([])
const compact = ref([])
const limited = ref([])
const rejected = ref([])
const slotted = ref([])
const formFiles = ref([])
const formSent = ref(false)

function onReject(files) {
  rejected.value = files.map((entry) => `${entry.file.name} — ${entry.message}`)
}

function onFormReset() {
  formFiles.value = []
  formSent.value = false
}
</script>

# File Upload

`SFileUpload` is a file **selection** field: a drop zone (or a compact button) that collects files
into `v-model` as a `File[]`. It does not upload anything — no request, no progress, no retries.
Sending the files is the app's job: take the array, put it into a `FormData` and post it with
`fetch`, XHR or an upload client. The component checks `accept`, `maxSize` and `maxFiles` before a
file reaches the model, and reports what it refused through `reject`.

It is built on `SFormField`, like `SInput`: label, hint, error message and the a11y wiring are
reused, and the field takes part in `SForm` validation. The model is always an array, with
`multiple` or without — a single-file field holds an array of one.

Accessibility: the control is a real `<input type="file">`, visually hidden but **focusable**
(never `display: none`), and the drop zone is its `<label>`. So the field is reachable with Tab,
<kbd>Enter</kbd> and <kbd>Space</kbd> open the file dialog, and a click anywhere on the zone opens
it too. The accessible name comes from the field label, and the hint or the error is linked
through `aria-describedby`.

## Drop zone

The default shape. Drag files onto the area or click it; the selected files are listed below with
their size and a remove button.

<Demo>
  <SFileUpload
    v-model="basic"
    label="Attachments"
    hint="Any file type"
    multiple
  />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const files = ref<File[]>([])
</script>

<template>
  <SFileUpload
    v-model="files"
    label="Attachments"
    hint="Any file type"
    multiple
  />
</template>
```

  </template>
</Demo>

## Compact mode

`:dropzone="false"` replaces the area with a button of the field's size. Dropping files still
works — the button is the same label. Use `button-label` to change its text, `show-list` to hide
the list of files.

<Demo>
  <SFileUpload
    v-model="compact"
    label="Avatar"
    :dropzone="false"
    accept="image/*"
    button-label="Choose an image"
  />

<template #code>

```vue
<template>
  <SFileUpload
    v-model="avatar"
    label="Avatar"
    :dropzone="false"
    accept="image/*"
    button-label="Choose an image"
  />
</template>
```

  </template>
</Demo>

## Restrictions and rejections

`accept` (native syntax), `maxSize` (in bytes) and `maxFiles` are checked for picked **and**
dropped files alike — the native `accept` attribute filters the dialog only. A refused file never
enters the model: the field shows the reason in its error area and emits `reject` with the file,
the `reason` (`type`, `size` or `count`) and the ready-made `message`.

The built-in message is shown only while the app passes no `error` of its own: an `error` prop
always wins, so a server-side failure is never overwritten by a local one. Listen to `reject` when
you would rather report the failure yourself — a toast, a list, anything.

Try a file over 512 KB, or a third file.

<Demo>
  <SFileUpload
    v-model="limited"
    label="Documents"
    hint="Images or PDF, up to 512 KB each, 2 files at most"
    multiple
    accept="image/*,.pdf"
    :max-size="524288"
    :max-files="2"
    @reject="onReject"
  />
  <div
    v-if="rejected.length"
    style="font-size: 13px"
  >
    <div v-for="line in rejected" :key="line">{{ line }}</div>
  </div>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { SFileUploadRejection } from '@smalt-ui/core'

const files = ref<File[]>([])
const refused = ref<string[]>([])

function onReject(entries: SFileUploadRejection[]) {
  refused.value = entries.map((entry) => `${entry.file.name} — ${entry.message}`)
}
</script>

<template>
  <SFileUpload
    v-model="files"
    label="Documents"
    hint="Images or PDF, up to 512 KB each, 2 files at most"
    multiple
    accept="image/*,.pdf"
    :max-size="524288"
    :max-files="2"
    @reject="onReject"
  />
</template>
```

  </template>
</Demo>

## Custom file row

The `file` slot replaces one row and receives `{ file, index, remove }`. This is where an upload
progress bar goes: keep the per-file state in your own code, render `SProgress` next to the name
and call `remove()` to drop the file from the model.

<Demo>
  <SFileUpload
    v-model="slotted"
    label="Photos"
    multiple
    accept="image/*"
  >
    <template #file="{ file, remove }">
      <STag
        removable
        @remove="remove()"
      >
        {{ file.name }}
      </STag>
    </template>
  </SFileUpload>

<template #code>

```vue
<template>
  <SFileUpload
    v-model="photos"
    label="Photos"
    multiple
    accept="image/*"
  >
    <template #file="{ file, remove }">
      <STag
        removable
        @remove="remove()"
      >
        {{ file.name }}
      </STag>
    </template>
  </SFileUpload>
</template>
```

  </template>
</Demo>

## Validation

Inside `SForm` the field behaves like any other: `rules` receive the `File[]`, the check runs when
focus leaves the field and then on every change while an error is shown, and a failing field takes
focus on submit. The built-in factories work on the array as is — `required()` fails on an empty
list, `minLength(2)`/`maxLength(5)` count files. A rule of your own gets the same array, so a
check on the total weight is two lines.

Submit the form with no file attached.

<Demo>
  <SForm
    style="display: grid; gap: 16px; width: 100%; max-width: 400px"
    @submit="formSent = true"
    @reset="onFormReset"
  >
    <SFileUpload
      v-model="formFiles"
      label="Scan of the contract"
      name="contract"
      required
      accept=".pdf"
      :rules="[required('Attach the contract')]"
    />
    <div style="display: flex; align-items: center; gap: 8px">
      <SButton type="submit">Send</SButton>
      <SButton type="reset" variant="ghost">Reset</SButton>
      <span v-if="formSent">Sent</span>
    </div>
  </SForm>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { required } from '@smalt-ui/core'

const files = ref<File[]>([])

const underLimit = (list: File[]) =>
  list.reduce((total, file) => total + file.size, 0) < 5_000_000 || 'Up to 5 MB in total'
</script>

<template>
  <SForm @submit="send">
    <SFileUpload
      v-model="files"
      label="Scan of the contract"
      name="contract"
      required
      accept=".pdf"
      :rules="[required('Attach the contract'), underLimit]"
    />
    <SButton type="submit">Send</SButton>
  </SForm>
</template>
```

  </template>
</Demo>

## Sending the files

The component stops at the selection, so the request stays in the app:

```ts
async function send(files: File[]) {
  const body = new FormData()
  files.forEach((file) => body.append('files', file))
  await fetch('/api/upload', { method: 'POST', body })
}
```

## API

<ApiTable name="SFileUpload" />
