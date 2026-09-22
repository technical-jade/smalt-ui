import type { ComputedRef, InjectionKey } from 'vue'
import type { SValidateOn } from '../composables/useValidation'

/** What a field registers in the nearest `SForm`. Getters keep the form's computeds reactive. */
export interface SFormFieldEntry {
  id: string
  name(): string | undefined
  el(): Element | null
  validate(): Promise<boolean>
  resetValidation(): void
  focus(): void
  errorMessage(): string | undefined
  hasRules(): boolean
  checked(): boolean
  validating(): boolean
}

export interface SFormContext {
  validateOn: ComputedRef<SValidateOn | undefined>
  register(entry: SFormFieldEntry): void
  unregister(entry: SFormFieldEntry): void
}

export const formContextKey: InjectionKey<SFormContext> = Symbol('smalt-form')
