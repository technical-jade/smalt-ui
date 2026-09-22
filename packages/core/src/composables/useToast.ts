import { readonly, ref } from 'vue'
import type { SColorName } from './useColorProp'
import { devWarn } from '../internal/dev'

export type SToastVariant = 'info' | 'positive' | 'warning' | 'negative'

export interface SToastOptions {
  /** Notification title. */
  title: string
  /** Additional text below the title. */
  description?: string
  /** Semantic variant; sets the icon and the accent color. */
  variant?: SToastVariant
  /**
   * Accent (icon) color: a [palette](/style/palette) name (`primary`/`teal`/`teal-10`). Overrides
   * the variant color.
   */
  color?: SColorName
  /** Milliseconds before the notification hides automatically. */
  duration?: number
}

export interface SToastEntry extends SToastOptions {
  /** Unique id in the queue. */
  id: number
}

// One app-wide queue: the provider renders it, any caller fills it.
const toasts = ref<SToastEntry[]>([])
let seq = 0

/**
 * Toasts are a client-side mechanism (the provider mounts in the browser). On the server the
 * module is shared by all requests, so a queue entry would leak into another user's markup
 * (cross-request state pollution); there the call is ignored.
 */
const isClient = typeof window !== 'undefined'

/**
 * Imperative access to toast notifications. Requires one mounted `ToastProvider` at the app root.
 * Call `toast({...})` to show a notification and `dismiss(id)` to remove it manually.
 */
export function useToast() {
  function toast(options: SToastOptions): number {
    const id = ++seq
    if (!isClient) {
      devWarn(
        '[useToast] call during server rendering ignored: the queue is shared by all ' +
          'requests. Show notifications from onMounted or a client-side handler.',
      )
      return id
    }
    toasts.value.push({ ...options, id })
    return id
  }

  function dismiss(id: number): void {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) toasts.value.splice(index, 1)
  }

  /** Clear the whole queue (e.g. when the provider unmounts). */
  function clear(): void {
    toasts.value.splice(0)
  }

  return { toast, dismiss, clear, toasts: readonly(toasts) }
}
