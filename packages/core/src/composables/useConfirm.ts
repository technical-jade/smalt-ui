import { readonly, ref } from 'vue'
import type { SAlertDialogProps } from '../components/SAlertDialog/types'
import { devWarn } from '../internal/dev'

/** What the confirmation dialog shows: a subset of `SAlertDialog` props. */
export type SConfirmOptions = Pick<
  SAlertDialogProps,
  'title' | 'description' | 'confirmLabel' | 'cancelLabel' | 'danger' | 'square' | 'initialFocus'
>

export interface SConfirmEntry extends SConfirmOptions {
  /** Unique id in the queue. */
  id: number
}

// One app-wide queue: the provider renders its first entry, callers append to it.
const queue = ref<SConfirmEntry[]>([])
let seq = 0

/**
 * Resolve functions are kept outside reactivity: in a `ref` they would be deeply proxied for no
 * benefit. The key is the queue entry id.
 */
const pending = new Map<number, (answer: boolean) => void>()

let activeProviders = 0

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
    if (activeProviders === 0) {
      return answerImmediately(
        '[useConfirm] the app has no <ConfirmProvider>, so nothing can show the dialog; ' +
          'the confirmation is treated as declined. Mount the provider at the app root.',
      )
    }

    const id = ++seq
    queue.value.push({ ...options, id })
    return new Promise<boolean>((resolve) => pending.set(id, resolve))
  }

  /** Answer a request and remove it from the queue. Called by the provider. */
  function settle(id: number, answer: boolean): void {
    pending.get(id)?.(answer)
    pending.delete(id)
    const index = queue.value.findIndex((entry) => entry.id === id)
    if (index !== -1) queue.value.splice(index, 1)
  }

  /**
   * Clear the queue, declining everything left: otherwise `await confirm()` in consumer code
   * would never return (e.g. after the provider unmounts).
   */
  function clear(): void {
    pending.forEach((resolve) => resolve(false))
    pending.clear()
    queue.value.splice(0)
  }

  return { confirm, settle, clear, queue: readonly(queue) }
}

/** Mounted provider tracking, for `ConfirmProvider` only. */
export function registerConfirmProvider(): number {
  return ++activeProviders
}

export function unregisterConfirmProvider(): number {
  activeProviders = Math.max(0, activeProviders - 1)
  return activeProviders
}
