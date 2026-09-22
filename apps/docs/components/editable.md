# Editable

`SEditable` shows a value as plain text and turns it into an input in place. It is built on Reka UI
(activation, commit and cancel, the hidden input for native form submission) and reuses
`SFormField` (label, hint, error message, a11y) and `SButton` for the optional controls. The value
is bound with `v-model`.

Prefer it to an always-visible field when the value is mostly read and rarely corrected — a
document title, a name in a list row, a cell in a table — so the page reads as content instead of
as a form. When the value is meant to be filled in, use [`SInput`](/components/input): a field that
announces itself is easier to find and to fill.

The box never changes size between the two states: the frame, its padding and its border width
stay the same and only the colors change, so nothing on the page moves when editing starts.

**Keyboard and screen readers.** The value is a tab stop. With the default `activation-mode="focus"`
reaching it opens the editor; in `dblclick` mode press <kbd>Enter</kbd> or <kbd>Space</kbd> (or
double-click). <kbd>Enter</kbd> commits the value, <kbd>Escape</kbd> discards the edit, and focus
returns to the value afterwards instead of falling to the page. The input carries the field label,
so it is announced like any other field; with `with-controls` the buttons give assistive technology
and touch users an explicit affordance, which a double click alone does not.

<script setup>
import { ref } from 'vue'
import { maxLength, required } from '@smalt-ui/core'

const title = ref('Quarterly report')
const nickname = ref('')
const note = ref('Call back on Monday')
const cardTitle = ref('Design system')
const tags = ref(['Draft', 'Q3', 'Internal'])
const projectName = ref('')
const projectSaved = ref(false)
</script>

## Basic usage

Tab into the text or click it: the value becomes an input with the same box. <kbd>Enter</kbd> or
clicking away commits it, <kbd>Escape</kbd> restores it.

<Demo>
  <SEditable
    v-model="title"
    label="Report title"
    hint="Click the title to rename it"
    style="max-width: 320px"
  />

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const title = ref('Quarterly report')
</script>

<template>
  <SEditable
    v-model="title"
    label="Report title"
    hint="Click the title to rename it"
  />
</template>
```

  </template>
</Demo>

## With controls

`with-controls` adds the edit, save and cancel buttons. Their accessible names come from the
locale dictionary and can be replaced one by one (`edit-label`, `save-label`, `cancel-label`); the
`controls` slot replaces the whole row and receives `{ isEditing, edit, submit, cancel }`.

<Demo>
  <SEditable
    v-model="nickname"
    label="Nickname"
    placeholder="Not set"
    with-controls
    activation-mode="none"
    submit-mode="none"
    style="max-width: 320px"
  />

<template #code>

```vue
<template>
  <SEditable
    v-model="nickname"
    label="Nickname"
    placeholder="Not set"
    with-controls
    activation-mode="none"
    submit-mode="none"
  />
</template>
```

  </template>
</Demo>

## Activation and commit

`activation-mode` decides what opens the editor: `focus` (the default), `dblclick` or `none` —
with `none` only the controls and the exposed `edit()` do. `submit-mode` decides what commits the
value: `enter`, `blur`, `both` (the default) or `none`, where leaving the field discards the edit.
<kbd>Escape</kbd> cancels in every mode.

<Demo>
  <div style="display: grid; gap: 16px; max-width: 320px">
    <SEditable
      v-model="note"
      label="Double click to edit"
      activation-mode="dblclick"
      submit-mode="enter"
    />
    <SEditable
      :model-value="note"
      label="Read-only"
      readonly
    />
    <SEditable
      :model-value="note"
      label="Disabled"
      disabled
    />
  </div>

<template #code>

```vue
<template>
  <SEditable
    v-model="note"
    label="Double click to edit"
    activation-mode="dblclick"
    submit-mode="enter"
  />
  <SEditable
    :model-value="note"
    label="Read-only"
    readonly
  />
  <SEditable
    :model-value="note"
    label="Disabled"
    disabled
  />
</template>
```

  </template>
</Demo>

## As a title in a card

Without a label the field is just the text, which is what a card heading or a list row needs.
`auto-resize` makes the box follow the text instead of the row, `size` sets its type scale, and the
`preview` slot renders the value however the row needs it.

<Demo>
  <SCard style="width: 100%; max-width: 420px">
    <SEditable
      v-model="cardTitle"
      aria-label="Project name"
      auto-resize
      placeholder="Untitled project"
      size="lg"
    />
    <div style="display: flex; gap: 8px; align-items: center; margin-top: 12px">
      <SEditable
        v-for="(tag, index) in tags"
        :key="index"
        v-model="tags[index]"
        aria-label="Tag"
        auto-resize
        size="sm"
      >
        <template #preview="{ value }">
          <SBadge>{{ value }}</SBadge>
        </template>
      </SEditable>
    </div>
  </SCard>

<template #code>

```vue
<template>
  <SCard>
    <SEditable
      v-model="cardTitle"
      aria-label="Project name"
      auto-resize
      placeholder="Untitled project"
      size="lg"
    />
    <SEditable
      v-for="(tag, index) in tags"
      :key="index"
      v-model="tags[index]"
      aria-label="Tag"
      auto-resize
      size="sm"
    >
      <template #preview="{ value }">
        <SBadge>{{ value }}</SBadge>
      </template>
    </SEditable>
  </SCard>
</template>
```

  </template>
</Demo>

## Validation

`rules` checks the value when focus leaves the field, and then on every change while the error is
shown; inside [`SForm`](/components/form) the field is also checked on submit, and the form moves
focus to it — to the text when the editor is closed, to the input when it is open. `name` adds the
value to native form submission. See the [Validation](/guide/validation) guide for the details.

Submit with an empty name, then type one.

<Demo>
  <SForm
    style="display: grid; gap: 16px; width: 100%; max-width: 360px"
    @submit="projectSaved = true"
  >
    <SEditable
      v-model="projectName"
      label="Project name"
      name="project"
      placeholder="Click to name the project"
      required
      :rules="[required(), maxLength(40)]"
    />
    <div style="display: flex; gap: 12px; align-items: center">
      <SButton type="submit">
        Save project
      </SButton>
      <span v-if="projectSaved">Saved</span>
    </div>
  </SForm>

<template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { maxLength, required } from '@smalt-ui/core'

const projectName = ref('')
const saved = ref(false)
</script>

<template>
  <SForm @submit="saved = true">
    <SEditable
      v-model="projectName"
      label="Project name"
      name="project"
      placeholder="Click to name the project"
      required
      :rules="[required(), maxLength(40)]"
    />
    <SButton type="submit"> Save project </SButton>
  </SForm>
</template>
```

  </template>
</Demo>

## API

<ApiTable name="SEditable" />
