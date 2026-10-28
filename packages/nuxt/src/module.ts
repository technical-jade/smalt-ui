import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  addComponent,
  addPlugin,
  addPluginTemplate,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'
import { colorModeScript } from '@smalt-ui/core/color-mode-script'
import { COMPONENT_NAMES, EXPLICIT_ONLY_PROVIDERS, PROVIDER_NAMES } from './component-names'

export interface ModuleOptions {
  /** Component name prefix for auto-import. Defaults to `''` (e.g. `SButton`). */
  prefix: string
  /** Auto-import components. Defaults to `true`. */
  components: boolean
  /** Include the global `@smalt-ui/core/styles.css` styles. Defaults to `true`. */
  css: boolean
  /**
   * Manage the theme: an early inline script in `<head>` sets `data-theme` before the first
   * paint, and a client plugin keeps it in sync after hydration. Defaults to `true`.
   */
  colorMode: boolean
  /**
   * Add the `.s-root .s-root--app` container classes to the app root (`#__nuxt`) for CSS isolation
   * and base typography. Defaults to `true`.
   */
  container: boolean
  /**
   * Base locale of the library strings (`aria-label`, visually hidden labels, etc.). Defaults to
   * `'en'`, the only built-in locale; other languages are provided through `messages`. With
   * `locale`/`messages` set, the module provides the dictionary to the whole application. The
   * strings type is `SMessages` from `@smalt-ui/core` (a loose `Record` here keeps the module's
   * types portable).
   */
  locale?: 'en'
  /** Partial override of individual strings on top of the locale (`SMessages` keys). */
  messages?: Record<string, string>
  /**
   * App-level prop defaults (keys are `global` and component names), layered on top of the preset
   * prop by prop. Functions in the values do not survive JSON serialization and are reported with
   * a warning at build time. The type is a loose `Record` to keep the module's types portable; in
   * core it is `SDefaults`.
   */
  defaults?: Record<string, Record<string, unknown>>
  /** Built-in preset name (`compact`/`comfortable`): "theme + defaults" in one value. */
  preset?: 'compact' | 'comfortable'
  /**
   * Include the Inter font: the `@font-face` rules and serving the files from the package.
   * Defaults to `true`: the `--s-font-sans` token starts with `Inter`, and without the font files
   * the app silently falls back to the system font.
   *
   * Turn it off if the app already includes Inter itself: otherwise the same font is declared
   * twice and preload downloads an extra copy.
   */
  fonts:
    | boolean
    | {
        /** Include the CSS with `@font-face`. Defaults to `true`. */
        css?: boolean
        /**
         * Subsets for `<link rel="preload">`. Defaults to basic Latin (`['latin']`), the one
         * the first screen is set in.
         */
        preload?: boolean | readonly SFontFace[]
        /** Base URL Nitro serves the files from. Defaults to `'/_fonts/smalt'`. */
        baseURL?: string
      }
}

/** Subset of the vendored font, a key for the `fonts.preload` option. */
export type SFontFace = 'latin' | 'latin-ext' | 'cyrillic' | 'cyrillic-ext'

/** `preload` option keys → file names in `@smalt-ui/core/dist/fonts`. */
const FONT_FILES: Record<SFontFace, string> = {
  latin: 'Inter-Latin.woff2',
  'latin-ext': 'Inter-LatinExt.woff2',
  cyrillic: 'Inter-Cyrillic.woff2',
  'cyrillic-ext': 'Inter-CyrillicExt.woff2',
}

/**
 * What is preloaded without an explicit list: basic Latin only. The other subsets are left to
 * unicode-range: the browser downloads them only when the page has such characters, while
 * preload would force the download every time.
 */
const DEFAULT_PRELOAD: readonly SFontFace[] = ['latin']

/**
 * Names come from the generated component-names.ts (the source shared with the
 * @smalt-ui/core/resolver resolver), so a new component does not need to be added here by hand.
 * Providers with an "explicit import only" policy (ConfigProvider) are not auto-imported.
 */
const explicitOnly: readonly string[] = EXPLICIT_ONLY_PROVIDERS

const COMPONENTS = [
  ...COMPONENT_NAMES,
  ...PROVIDER_NAMES.filter((name) => !explicitOnly.includes(name)),
]

/**
 * Explicit type annotation: without it the inferred module type references @nuxt/schema in a way
 * that cannot be named (TS2742), and rollup-plugin-dts fails when generating .d.ts.
 */
const module: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@smalt-ui/nuxt',
    configKey: 'sui',
    compatibility: { nuxt: '>=3.0.0' },
  },
  defaults: {
    prefix: '',
    components: true,
    css: true,
    colorMode: true,
    container: true,
    fonts: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // ESM dependencies are transpiled for SSR/Nitro (otherwise import fails in the server bundle).
    nuxt.options.build.transpile.push('reka-ui', '@smalt-ui/core')

    /**
     * Fonts: Nitro serves the files from stable URLs, not the bundler. Through `nuxt.options.css`
     * the names would be hashed and the preload href would be unknown at setup time, so the
     * browser would download each font file twice. A stable name is cached with a one-year
     * max-age, so a font update requires a new file name (see copy-fonts.mjs).
     */
    const fonts = options.fonts === true ? {} : options.fonts
    if (fonts) {
      const baseURL = (fonts.baseURL ?? '/_fonts/smalt').replace(/\/$/, '')
      const cssFile = fileURLToPath(import.meta.resolve('@smalt-ui/core/fonts.css'))

      nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets ?? []
      nuxt.options.nitro.publicAssets.push({
        dir: join(dirname(cssFile), 'fonts'),
        baseURL,
        maxAge: 60 * 60 * 24 * 365,
      })

      if (fonts.css !== false) {
        // Relative url()s from dist/fonts.css are rewritten to the public Nitro base.
        const source = readFileSync(cssFile, 'utf8')
        const css = source.replaceAll('./fonts/', `${baseURL}/`)
        if (css === source) {
          throw new Error(
            '[@smalt-ui/nuxt] no url("./fonts/…") found in @smalt-ui/core/fonts.css: ' +
              'the core version is incompatible with the module',
          )
        }
        addTemplate({ filename: 'smalt-fonts.css', write: true, getContents: () => css })
        nuxt.options.css.push(join(nuxt.options.buildDir, 'smalt-fonts.css'))
      }

      const preload = fonts.preload ?? true
      const faces = preload === true ? DEFAULT_PRELOAD : preload === false ? [] : preload
      nuxt.options.app.head.link = nuxt.options.app.head.link ?? []
      for (const face of faces) {
        /**
         * crossorigin is required even on the same domain: font requests always use CORS mode,
         * and without the attribute the preload is not reused, so the file downloads twice.
         */
        nuxt.options.app.head.link.push({
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
          href: `${baseURL}/${FONT_FILES[face]}`,
        })
      }
    }

    if (options.css) {
      nuxt.options.css.push('@smalt-ui/core/styles.css')
    }

    /**
     * Container isolation: a class on the app root (#__nuxt). Portals outside it are covered by
     * reset-inherited on the components' own overlay/content roots.
     */
    if (options.container) {
      const rootAttrs = (nuxt.options.app.rootAttrs ??= {})
      rootAttrs.class = [rootAttrs.class, 's-root', 's-root--app'].filter(Boolean).join(' ')
    }

    if (options.components) {
      for (const name of COMPONENTS) {
        addComponent({
          name: `${options.prefix}${name}`,
          export: name,
          filePath: '@smalt-ui/core',
        })
      }
    }

    // Without locale/messages the plugin is unnecessary: components use the built-in dictionary.
    if (options.locale || options.messages) {
      const localeOptions = JSON.stringify({ locale: options.locale, messages: options.messages })
      addPluginTemplate({
        filename: 'smalt-locale.mjs',
        getContents: () =>
          `import { defineNuxtPlugin } from '#app'\n` +
          `import { installLocale } from '@smalt-ui/core'\n` +
          `export default defineNuxtPlugin((nuxtApp) => {\n` +
          `  installLocale(nuxtApp.vueApp, ${localeOptions})\n` +
          `})\n`,
      })
    }

    if (options.defaults || options.preset) {
      /**
       * Defaults reach the generated plugin through JSON, and functions in them silently vanish:
       * `SCalendar: { isDateDisabled: fn }` turns into `{}`, and the calendar allows every date.
       */
      for (const [component, props] of Object.entries(options.defaults ?? {})) {
        for (const [prop, value] of Object.entries(props ?? {})) {
          if (typeof value === 'function') {
            console.warn(
              `[@smalt-ui/nuxt] default ${component}.${prop} is a function; module options ` +
                'cannot serialize it, so it will be dropped. Set it with installDefaults ' +
                'in your own plugin.',
            )
          }
        }
      }
      const defaultsOption = JSON.stringify(options.defaults ?? {})
      const presetOption = JSON.stringify(options.preset ?? null)
      addPluginTemplate({
        filename: 'smalt-defaults.mjs',
        getContents: () =>
          `import { defineNuxtPlugin } from '#app'\n` +
          `import { installDefaults, injectTheme, createTheme, mergeDefaults, BUILTIN_PRESETS } from '@smalt-ui/core'\n` +
          `export default defineNuxtPlugin((nuxtApp) => {\n` +
          `  const presetName = ${presetOption}\n` +
          `  const preset = presetName ? BUILTIN_PRESETS[presetName] : undefined\n` +
          `  if (preset?.tokens) injectTheme(createTheme(preset.tokens), preset.name)\n` +
          `  installDefaults(nuxtApp.vueApp, mergeDefaults(preset?.defaults, ${defaultsOption}))\n` +
          `})\n`,
      })
    }

    if (options.colorMode) {
      // Early inline script in <head>: sets data-theme BEFORE the first paint (no FOUC).
      nuxt.options.app.head.script = nuxt.options.app.head.script ?? []
      nuxt.options.app.head.script.push({ innerHTML: colorModeScript(), tagPosition: 'head' })

      // Reactive sync after hydration.
      addPlugin({ src: resolver.resolve('./runtime/color-mode.client'), mode: 'client' })
    }
  },
})

export default module
