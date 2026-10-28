import { readonly, ref, watch, type Ref } from 'vue'
import { COLOR_MODE_STORAGE_KEY } from '../color-mode-script'
import { devWarn } from '../internal/dev'

export type ColorScheme = 'light' | 'dark'
export type ColorMode = ColorScheme | 'auto'

export interface UseColorModeOptions {
  /** localStorage key. Defaults to `'smalt-color-mode'`. */
  storageKey?: string
  /** Mode on first run when localStorage is empty. Defaults to `'auto'`. */
  initialMode?: ColorMode
}

export interface UseColorModeReturn {
  /** User choice: `'light' | 'dark' | 'auto'`. */
  mode: Ref<ColorMode>
  /** Resulting applied scheme (`'auto'` resolved to `light`/`dark`). Read-only. */
  scheme: Readonly<Ref<ColorScheme>>
  /** Set the mode. */
  setMode: (mode: ColorMode) => void
  /** Toggle between light and dark (based on the currently applied scheme); `auto` is dropped. */
  toggle: () => void
}

const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'

let shared: UseColorModeReturn | null = null

function systemScheme(): ColorScheme {
  if (!isClient) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveScheme(mode: ColorMode): ColorScheme {
  return mode === 'auto' ? systemScheme() : mode
}

function applyScheme(scheme: ColorScheme): void {
  if (!isClient) return
  document.documentElement.setAttribute('data-theme', scheme)
}

function createColorMode(options: UseColorModeOptions): UseColorModeReturn {
  const storageKey = options.storageKey ?? COLOR_MODE_STORAGE_KEY
  const stored = isClient ? (localStorage.getItem(storageKey) as ColorMode | null) : null

  const mode = ref<ColorMode>(stored ?? options.initialMode ?? 'auto')
  const scheme = ref<ColorScheme>(resolveScheme(mode.value))

  function sync(): void {
    scheme.value = resolveScheme(mode.value)
    applyScheme(scheme.value)
  }

  // The listener is never removed: it lives as long as the theme singleton, i.e. the whole app.
  if (isClient) {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', function onSystemSchemeChange() {
      if (mode.value === 'auto') sync()
    })
  }

  watch(
    mode,
    (value) => {
      if (isClient) localStorage.setItem(storageKey, value)
      sync()
    },
    { immediate: true },
  )

  return {
    mode,
    scheme: readonly(scheme),
    setMode: (value) => {
      mode.value = value
    },
    toggle: () => {
      mode.value = scheme.value === 'dark' ? 'light' : 'dark'
    },
  }
}

/**
 * Color theme control (light/dark/auto).
 * App-wide singleton: all calls share one state.
 * Syncs with `localStorage` and the system theme, sets `data-theme` on `<html>`.
 * SSR-safe (does not touch `window`/`document`).
 */
export function useColorMode(options: UseColorModeOptions = {}): UseColorModeReturn {
  /**
   * The singleton is not cached on the server: the module is shared by all requests, and a stored
   * instance would leak one user's choice into other users' responses. Server rendering does not
   * read localStorage anyway and renders the light scheme; on the client the theme is set by an
   * early inline script (Nuxt module) and hydration.
   */
  if (!isClient) return createColorMode(options)

  if (!shared) {
    shared = createColorMode(options)
  } else if (Object.keys(options).length > 0) {
    devWarn(
      '[useColorMode] options (`storageKey`/`initialMode`) are read only on the first ' +
        'initialization of the singleton; the values passed now are ignored.',
    )
  }
  return shared
}
