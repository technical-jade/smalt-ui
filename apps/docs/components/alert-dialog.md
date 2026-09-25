<script setup>
import { ref } from 'vue'
import { useConfirm } from '@smalt-ui/core'

const { confirm } = useConfirm()
const removeAnswer = ref('')

async function askToRemove() {
  const ok = await confirm({
    title: 'Delete project?',
    description: 'The project and all its data will be permanently deleted.',
    confirmLabel: 'Delete',
    danger: true,
  })
  removeAnswer.value = ok ? 'Project deleted' : 'Deletion canceled'
}
</script>

# Alert Dialog

`SAlertDialog` is a modal confirmation dialog for important or irreversible actions. It is built on
Reka UI AlertDialog (`alertdialog` role, focus trap, `Esc`, portal). Unlike `SDialog`, it requires
an explicit choice between the confirm and cancel buttons: clicking the overlay does not close it.
The buttons are reusable `SButton` components. Long content scrolls inside the dialog while the
buttons stay in view.
It is controlled with `v-model:open`; the choice emits `confirm` / `cancel`. When you need a
confirmation in the middle of an async function, you can skip the markup and handlers entirely —
see [Async confirmation](#async-confirmation).

## Basic usage

<ClientOnly>
<Demo>
  <SAlertDialog
    title="Delete project?"
    description="The project and all its data will be permanently deleted."
    confirm-label="Delete"
    danger
  >
    <template #trigger>
      <SButton variant="negative">Delete project</SButton>
    </template>
  </SAlertDialog>

<template #code>

```vue
<template>
  <SAlertDialog
    v-model:open="open"
    title="Delete project?"
    description="This action cannot be undone."
    confirm-label="Delete"
    danger
    @confirm="onDelete"
    @cancel="onCancel"
  >
    <template #trigger>
      <SButton variant="negative">Delete project</SButton>
    </template>
  </SAlertDialog>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Custom title and confirmation

The `title` and `description` slots replace the props of the same name with markup (for example,
an icon next to the title), and the `cancelLabel` prop sets the cancel button label.

<ClientOnly>
<Demo>
  <SAlertDialog
    confirm-label="Publish"
    cancel-label="Not now"
  >
    <template #trigger>
      <SButton variant="primary">Publish article</SButton>
    </template>
    <template #title>
      <span style="display: inline-flex; align-items: center; gap: 8px">
        <SIcon icon="triangle-alert" :size="18" />
        Publish the article?
      </span>
    </template>
    <template #description>
      Once published, the article becomes visible to all users and appears in the feed.
    </template>
  </SAlertDialog>

<template #code>

```vue
<template>
  <SAlertDialog
    v-model:open="open"
    confirm-label="Publish"
    cancel-label="Not now"
    @confirm="onPublish"
  >
    <template #trigger>
      <SButton variant="primary">Publish article</SButton>
    </template>
    <template #title>
      <SIcon
        icon="triangle-alert"
        :size="18"
      />
      Publish the article?
    </template>
    <template #description>
      Once published, the article becomes visible to all users and appears in the feed.
    </template>
  </SAlertDialog>
</template>
```

  </template>
</Demo>
</ClientOnly>

## Initial focus

When the dialog opens, focus lands on the cancel button, so an accidental Enter does not confirm a
destructive action. `initial-focus="confirm"` focuses the confirm button for routine
confirmations; `initial-focus="none"` focuses the dialog itself, so no button is one keypress
away.

## Async confirmation {#async-confirmation}

The `useConfirm()` composable gives you a call in the spirit of the native `confirm()`, only
non-blocking: it returns a promise with the user's answer. The dialog is rendered by
`ConfirmProvider`, which you mount once at the app root, next to `ToastProvider`.

<ClientOnly>
<Demo>
  <ConfirmProvider />
  <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 12px">
    <SButton variant="negative" @click="askToRemove">Delete project</SButton>
    <span v-if="removeAnswer">{{ removeAnswer }}</span>
  </div>

<template #code>

```vue
<script setup lang="ts">
import { useConfirm } from '@smalt-ui/core'

const { confirm } = useConfirm()

async function removeProject() {
  const ok = await confirm({
    title: 'Delete project?',
    description: 'The project and all its data will be permanently deleted.',
    confirmLabel: 'Delete',
    danger: true,
  })
  if (!ok) return
  await api.removeProject()
}
</script>

<template>
  <!-- once at the app root -->
  <ConfirmProvider />
  <SButton
    variant="negative"
    @click="removeProject"
  >
    Delete project
  </SButton>
</template>
```

  </template>
</Demo>
</ClientOnly>

Worth knowing:

- cancel and `Esc` resolve to `false`, confirm resolves to `true`; clicking the overlay does not
  close the dialog, so the user cannot dismiss it without answering;
- calls are queued: the next dialog opens once the current one is answered;
- the options are a subset of the component props (`title`, `description`, `confirmLabel`,
  `cancelLabel`, `danger`, `square`, `initialFocus`), so the dialog looks the same as the declarative version;
- without a mounted `ConfirmProvider` the call resolves to `false` and warns in development — the
  promise never hangs. On the server (SSR) it also resolves to a refusal: the queue is shared by
  all requests;
- mount one `ConfirmProvider`: the queue is shared, so a second instance would duplicate the
  dialog, and in development it warns about that.

::: tip The `confirm` name
The local variable shadows the global `window.confirm` only inside its own module, and that is
legal: `confirm` is not a reserved word. The native dialog is still available as
`window.confirm(...)`, and if the shadowing gets in the way, rename it while destructuring:
`const { confirm: askUser } = useConfirm()`.
:::

## API

<ApiTable name="SAlertDialog" />
