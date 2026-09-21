import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUpdate,
  provide,
  shallowRef,
  toValue,
  type App,
  type ComputedRef,
  type InjectionKey,
  type MaybeRefOrGetter,
} from 'vue'

/**
 * Prop defaults: the `global` key applies to all components, the other keys are component names
 * (`SButton`, `SInput`). Each value is a partial set of props.
 */
export interface SDefaults {
  /** Defaults applied to every library component. */
  global?: Record<string, unknown>
  [component: string]: Record<string, unknown> | undefined
}

const DEFAULTS_KEY: InjectionKey<ComputedRef<SDefaults>> = Symbol('smalt-defaults')

const camelToKebab = (value: string) => value.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

/**
 * Merges default sets section by section: top-level keys (`global`, component names) are not
 * values but prop sets, so a top-level spread would drop the whole base section (a preset plus
 * custom `defaults` for the same component). `over` wins per prop.
 */
export function mergeDefaults(base: SDefaults = {}, over: SDefaults = {}): SDefaults {
  const merged: SDefaults = { ...base }
  for (const [component, props] of Object.entries(over)) {
    // An undefined value means "not set" here too, as for an explicit prop: it keeps the base one.
    const defined = Object.entries(props ?? {}).filter(([, value]) => value !== undefined)
    merged[component] = { ...base[component], ...Object.fromEntries(defined) }
  }
  return merged
}

/**
 * Provides defaults to a subtree; a reactive source updates rendered components too. The layer is
 * MERGED over the defaults above (plugin, preset, outer provider): otherwise a `ConfigProvider`
 * added for a single default would wipe the app's whole configuration in its subtree.
 */
export function provideDefaults(
  source: MaybeRefOrGetter<SDefaults | undefined> = {},
): ComputedRef<SDefaults> {
  const inherited = inject<ComputedRef<SDefaults> | null>(DEFAULTS_KEY, null)
  const defaults = computed<SDefaults>(() => mergeDefaults(inherited?.value, toValue(source) ?? {}))
  provide(DEFAULTS_KEY, defaults)
  return defaults
}

/** Provides defaults app-wide. Used by the plugin and the Nuxt module. */
export function installDefaults(app: App, defaults: SDefaults): void {
  app.provide(
    DEFAULTS_KEY,
    computed(() => defaults),
  )
}

/**
 * Mixes provider defaults into a component's props. Priority: explicit prop → default for this
 * component → global → the component's own default. "Explicit" is read from `vnode.props`: the
 * props object already holds the `withDefaults` values and cannot tell them apart.
 */
export function useDefaults<T extends object>(props: T, name: string): T {
  const injected = inject(
    DEFAULTS_KEY,
    computed(() => ({}) as SDefaults),
  )
  const vm = getCurrentInstance()

  /**
   * `vnode.props` is a plain, non-reactive object: when the parent re-renders it is replaced
   * silently. It is kept in a shallowRef and refreshed before the component updates; otherwise
   * computeds reading `p.*` would cache a result based on an "explicitness" that has already
   * changed (the value itself may stay the same, so props do not invalidate them).
   */
  const rawProps = shallowRef<Record<string, unknown> | null>(vm?.vnode.props ?? null)
  if (vm) {
    onBeforeUpdate(() => {
      rawProps.value = vm.vnode.props ?? null
    })
  }

  return new Proxy(props, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      if (typeof key !== 'string') return value

      /**
       * "Explicitly passed" means the value in vnode.props is defined. Checking for the key is
       * not enough: `:size="maybeUndefined"` sets the key to undefined, and the default would
       * silently turn off, exactly in the wrappers that need the configuration.
       */
      const raw = rawProps.value
      const passed = Boolean(
        raw && (raw[key] !== undefined || raw[camelToKebab(key)] !== undefined),
      )
      if (passed) return value

      const defaults = injected.value
      const fromComponent = defaults[name]?.[key]
      if (fromComponent !== undefined) return fromComponent

      const fromGlobal = defaults.global?.[key]
      if (fromGlobal !== undefined) return fromGlobal

      return value
    },
  })
}
