import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { postcssSUILayer } from '../../../packages/core/scripts/postcss-layer.mjs'
import { colorModeScript } from '../../../packages/core/src/color-mode-script'

const coreSrc = (p: string) =>
  fileURLToPath(new URL(`../../../packages/core/src/${p}`, import.meta.url))

/**
 * The version comes from the core manifest instead of being duplicated here: the showcase is always
 * built from this same repository, so the badge updates itself after `changeset version`.
 */
const coreVersion: string = JSON.parse(
  readFileSync(new URL('../../../packages/core/package.json', import.meta.url), 'utf8'),
).version

// One "Guide" sidebar shared by /guide/ and /theming.
const guideSidebar = [
  {
    text: 'Guide',
    items: [
      { text: 'Getting started', link: '/guide/getting-started' },
      { text: 'Architecture', link: '/guide/architecture' },
      { text: 'Isolation and embedding', link: '/guide/isolation' },
      { text: 'Theming', link: '/theming' },
      { text: 'Icons', link: '/guide/icons' },
      { text: 'Internationalization', link: '/guide/i18n' },
      { text: 'Nuxt', link: '/guide/nuxt' },
      { text: 'Auto-import', link: '/guide/auto-import' },
      { text: 'Prop defaults', link: '/guide/defaults' },
      { text: 'Presets', link: '/guide/presets' },
      { text: 'Validation', link: '/guide/validation' },
    ],
  },
]

const styleSidebar = [
  {
    text: 'Style',
    items: [
      { text: 'Palette', link: '/style/palette' },
      { text: 'Typography', link: '/style/typography' },
      { text: 'Spacing', link: '/style/spacing' },
      { text: 'Grid', link: '/style/grid' },
      { text: 'Shape', link: '/style/shape' },
      { text: 'Elevation', link: '/style/elevation' },
    ],
  },
]

/**
 * Site root. GitHub Pages serves the docs from a subfolder (`/smalt-ui/`), so the deploy workflow
 * sets DOCS_BASE; locally and in the Playwright checks the site stays at `/`.
 */
const base = process.env.DOCS_BASE ?? '/'

export default defineConfig({
  base,
  title: 'Smalt UI',
  description: 'UI library for Vue 3 and Nuxt',
  lang: 'en-US',
  cleanUrls: true,
  head: [
    /**
     * The Smalt UI theme is applied before the first paint, otherwise the page flashes the system
     * theme: until `data-theme` is set, the media fallback of the tokens applies. The key matches
     * the VitePress toggle, so both mechanisms read the same stored choice.
     */
    ['script', {}, colorModeScript({ storageKey: 'vitepress-theme-appearance' })],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${base}favicon-32x32.png` }],
    ['link', { rel: 'apple-touch-icon', href: `${base}apple-touch-icon.png` }],
  ],
  themeConfig: {
    logo: { light: '/logo-mark.svg', dark: '/logo-mark-dark.svg' },
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Components', link: '/components/' },
      { text: 'Style', link: '/style/typography' },
      { text: 'Theming', link: '/theming' },
    ],
    sidebar: {
      '/guide/': guideSidebar,
      '/theming': guideSidebar,
      '/style/': styleSidebar,
      '/components/': [
        {
          text: 'Basics',
          items: [
            { text: 'Button', link: '/components/button' },
            { text: 'Icon', link: '/components/icon' },
            { text: 'Badge', link: '/components/badge' },
            { text: 'Tag', link: '/components/tag' },
            { text: 'Avatar', link: '/components/avatar' },
          ],
        },
        {
          text: 'Forms',
          items: [
            { text: 'Autocomplete', link: '/components/autocomplete' },
            { text: 'Form', link: '/components/form' },
            { text: 'Form Field', link: '/components/form-field' },
            { text: 'Input', link: '/components/input' },
            { text: 'Textarea', link: '/components/textarea' },
            { text: 'Number Field', link: '/components/number-field' },
            { text: 'Pin Input', link: '/components/pin-input' },
            { text: 'Select', link: '/components/select' },
            { text: 'Color Field', link: '/components/color-field' },
            { text: 'Color Picker', link: '/components/color-picker' },
            { text: 'Checkbox', link: '/components/checkbox' },
            { text: 'Radio', link: '/components/radio' },
            { text: 'Switch', link: '/components/switch' },
            { text: 'Toggle', link: '/components/toggle' },
            { text: 'Slider', link: '/components/slider' },
            { text: 'Rating', link: '/components/rating' },
          ],
        },
        {
          text: 'Date and time',
          items: [
            { text: 'Calendar', link: '/components/calendar' },
            { text: 'Date Field', link: '/components/date-field' },
            { text: 'Time Field', link: '/components/time-field' },
            { text: 'Date Picker', link: '/components/date-picker' },
            { text: 'Date Range Picker', link: '/components/date-range-picker' },
          ],
        },
        {
          text: 'Navigation and menus',
          items: [
            { text: 'Breadcrumb', link: '/components/breadcrumb' },
            { text: 'Pagination', link: '/components/pagination' },
            { text: 'Tabs', link: '/components/tabs' },
            { text: 'Stepper', link: '/components/stepper' },
            { text: 'Navigation Menu', link: '/components/navigation-menu' },
            { text: 'Dropdown Menu', link: '/components/dropdown-menu' },
            { text: 'Context Menu', link: '/components/context-menu' },
            { text: 'Menubar', link: '/components/menubar' },
            { text: 'Toolbar', link: '/components/toolbar' },
          ],
        },
        {
          text: 'Overlays',
          items: [
            { text: 'Dialog', link: '/components/dialog' },
            { text: 'Alert Dialog', link: '/components/alert-dialog' },
            { text: 'Drawer', link: '/components/drawer' },
            { text: 'Popover', link: '/components/popover' },
            { text: 'Hover Card', link: '/components/hover-card' },
            { text: 'Tooltip', link: '/components/tooltip' },
          ],
        },
        {
          text: 'Feedback',
          items: [
            { text: 'Alert', link: '/components/alert' },
            { text: 'Toast', link: '/components/toast' },
            { text: 'Progress', link: '/components/progress' },
            { text: 'Spinner', link: '/components/spinner' },
            { text: 'Skeleton', link: '/components/skeleton' },
          ],
        },
        {
          text: 'Other',
          items: [
            { text: 'Card', link: '/components/card' },
            { text: 'Separator', link: '/components/separator' },
            { text: 'Aspect Ratio', link: '/components/aspect-ratio' },
            { text: 'Splitter', link: '/components/splitter' },
            { text: 'Accordion', link: '/components/accordion' },
            { text: 'Collapsible', link: '/components/collapsible' },
            { text: 'Tree', link: '/components/tree' },
          ],
        },
      ],
    },
    outline: { level: [2, 3] },
  },
  vite: {
    css: {
      /**
       * The same layer as in the package build: the showcase resolves @smalt-ui/core to sources,
       * and without the plugin the cascade here would differ from what package consumers get.
       */
      postcss: { plugins: [postcssSUILayer()] },
      preprocessorOptions: {
        /**
         * Vite 5.4 from VitePress 1.6 calls the legacy Sass JS API by default (removed in
         * Dart Sass 2.0) and prints a deprecation warning on every run.
         */
        scss: { api: 'modern-compiler' },
      },
    },
    // The version goes into the theme bundle as a constant: the browser cannot read package.json.
    define: { __SMALT_VERSION__: JSON.stringify(coreVersion) },
    resolve: {
      /**
       * By default @smalt-ui/core resolves to sources, for HMR without rebuilding the package.
       * With SMALT_TARGET=dist the aliases are dropped and the showcase uses the built dist
       * through `exports`: this checks the published artifact, since build defects are invisible
       * in dev mode.
       */
      alias:
        process.env.SMALT_TARGET === 'dist'
          ? []
          : [
              /**
               * fonts.css points at _index.scss, not _bundled.scss: the default $font-path of the
               * former is correct in the source tree, the latter's is relative to the dist root.
               */
              {
                find: '@smalt-ui/core/fonts.css',
                replacement: coreSrc('styles/fonts/_index.scss'),
              },
              { find: '@smalt-ui/core/styles.css', replacement: coreSrc('styles/index.scss') },
              { find: '@smalt-ui/core', replacement: coreSrc('index.ts') },
            ],
    },
  },
})
