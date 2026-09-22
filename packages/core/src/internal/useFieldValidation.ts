import {
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUpdate,
  shallowRef,
  type ComponentPublicInstance,
  type ShallowRef,
} from 'vue'
import {
  useValidation,
  type SValidateOn,
  type SValidationProps,
} from '../composables/useValidation'
import { formContextKey } from './formContext'

export interface FieldValidationProps<T> extends SValidationProps<T> {
  error?: string
  disabled?: boolean
  name?: string
}

const TABBABLE =
  'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), ' +
  'select:not([disabled]), button:not([disabled]), [tabindex]'

const isTabbable = (el: Element): el is HTMLElement =>
  el instanceof HTMLElement && el.matches(TABBABLE) && el.tabIndex >= 0

const firstTabbable = (scope: Element) =>
  isTabbable(scope) ? scope : Array.from(scope.querySelectorAll(TABBABLE)).find(isTabbable)

/**
 * Focuses the control of a field: the element with the id `SFormField` gave it, else the one
 * marked `aria-invalid`, else the first tabbable. Group fields put the id or the mark on the
 * group container, so the tab stop is looked up inside: in a roving group it is the one element
 * with a non-negative tabindex.
 */
export function focusControl(root: Element | null, controlId?: string): void {
  if (!root) return
  const scopes = [
    controlId ? root.querySelector(`#${CSS.escape(controlId)}`) : null,
    root.querySelector('[aria-invalid="true"]'),
    root,
  ]
  for (const scope of scopes) {
    const target = scope && firstTabbable(scope)
    if (target) return target.focus()
  }
}

/**
 * Focuses the first editable segment of a date or time field; `block` is its BEM block
 * (`s-date-field`).
 */
export function focusFirstSegment(root: Element | null | undefined, block: string): void {
  root?.querySelector<HTMLElement>(`.${block}__segment:not(.${block}__segment--literal)`)?.focus()
}

/**
 * Validation of a library field. `validate-on` is read as passed on the field itself: a default
 * from `useDefaults` would otherwise beat an explicit `validate-on` of the enclosing `SForm`, so
 * the field's configured default applies only after the form. `focusField` replaces
 * `focusControl` in date fields: Reka puts the id on a hidden input, and prepend is in the group.
 */
export function useFieldValidation<T>(
  p: FieldValidationProps<T>,
  value: () => T,
  root: Readonly<ShallowRef<ComponentPublicInstance | null>>,
  focusField?: () => void,
) {
  const vm = getCurrentInstance()
  // vnode.props is not reactive; refreshed before each update, as in useDefaults.
  const raw = shallowRef(vm?.vnode.props ?? null)
  onBeforeUpdate(() => {
    raw.value = vm?.vnode.props ?? null
  })
  const form = inject(formContextKey, null)
  const explicit = () =>
    (raw.value?.validateOn ?? raw.value?.['validate-on']) as SValidateOn | undefined

  const el = () => (root.value?.$el as Element | undefined) ?? null
  // The root is SFormField, which exposes the id of the control.
  const focus =
    focusField ??
    (() => focusControl(el(), (root.value as { controlId?: string } | null)?.controlId))

  const validation = useValidation<T>({
    value,
    rules: () => p.rules,
    validateOn: () => explicit() ?? (form?.validateOn.value ? undefined : p.validateOn),
    error: () => p.error,
    disabled: () => p.disabled,
    // SInput and STextarea take `name` as a fallthrough attribute, not a prop.
    name: () => p.name ?? (raw.value?.name as string | undefined),
    focus,
    el,
  })

  return {
    errorMessage: validation.errorMessage,
    /**
     * `onLeave` of `useFieldFocus`; fields whose own `focus`/`blur` stay on the control pass it
     * a no-op emit. Deferred: Reka number and color fields commit the typed text on blur, and
     * when focus moves from a script the `v-model` value arrives only after the parent re-renders.
     */
    onBlur: () => void nextTick(validation.onBlur),
    expose: {
      validate: validation.validate,
      resetValidation: validation.resetValidation,
      focus,
    },
  }
}
