import { readonly, ref } from 'vue'
import type { SConfirmOptions } from '../composables/useConfirm'

/**
 * The app-wide queue behind `useConfirm()`. Only `ConfirmProvider` reads and answers it: exposed
 * to the app, `clear()` or a foreign `settle()` would decline somebody else's question.
 */
export interface ConfirmEntry extends SConfirmOptions {
  id: number
}

const entries = ref<ConfirmEntry[]>([])
let seq = 0

// Resolve functions stay outside reactivity: a `ref` would deeply proxy them for nothing.
const pending = new Map<number, (answer: boolean) => void>()

let activeProviders = 0

export const confirmQueue = readonly(entries)

export function enqueueConfirm(options: SConfirmOptions): Promise<boolean> {
  const id = ++seq
  entries.value.push({ ...options, id })
  return new Promise<boolean>((resolve) => pending.set(id, resolve))
}

/** Answer a request and remove it from the queue. */
export function settleConfirm(id: number, answer: boolean): void {
  pending.get(id)?.(answer)
  pending.delete(id)
  const index = entries.value.findIndex((entry) => entry.id === id)
  if (index !== -1) entries.value.splice(index, 1)
}

/** Decline everything left, or `await confirm()` would never return once the provider is gone. */
export function clearConfirms(): void {
  pending.forEach((resolve) => resolve(false))
  pending.clear()
  entries.value.splice(0)
}

export function hasConfirmProvider(): boolean {
  return activeProviders > 0
}

export function registerConfirmProvider(): number {
  return ++activeProviders
}

export function unregisterConfirmProvider(): number {
  activeProviders = Math.max(0, activeProviders - 1)
  return activeProviders
}
