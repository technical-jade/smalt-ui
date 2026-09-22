import type { SAlertDialogProps } from '../components/SAlertDialog/types'
import { enqueueConfirm, hasConfirmProvider } from '../internal/confirmQueue'
import { devWarn } from '../internal/dev'

/** What the confirmation dialog shows: a subset of `SAlertDialog` props. */
export type SConfirmOptions = Pick<
  SAlertDialogProps,
  'title' | 'description' | 'confirmLabel' | 'cancelLabel' | 'danger' | 'square' | 'initialFocus'
>

/**
 * Confirmation is a client-side mechanism (the provider mounts in the browser). On the server the
 * module is shared by all requests, so a queue entry would leak into another user's response
 * (cross-request state pollution).
 */
const isClient = typeof window !== 'undefined'

function answerImmediately(reason: string): Promise<boolean> {
  devWarn(reason)
  return Promise.resolve(false)
}

/**
 * Async counterpart of the native `confirm()`: `if (await confirm({ title: 'Delete?' }))`.
 * Requires one mounted `ConfirmProvider` at the app root; it is what shows the dialog.
 * Cancel and `Escape` resolve to `false`. Clicking the overlay does NOT close the dialog:
 * unlike `SDialog`, a confirmation requires an explicit choice.
 */
export function useConfirm() {
  function confirm(options: SConfirmOptions): Promise<boolean> {
    if (!isClient) {
      return answerImmediately(
        '[useConfirm] call during server rendering ignored: the queue is shared by all ' +
          'requests. Ask for confirmation from onMounted or a client-side handler.',
      )
    }
    if (!hasConfirmProvider()) {
      return answerImmediately(
        '[useConfirm] the app has no <ConfirmProvider>, so nothing can show the dialog; ' +
          'the confirmation is treated as declined. Mount the provider at the app root.',
      )
    }
    return enqueueConfirm(options)
  }

  return { confirm }
}
