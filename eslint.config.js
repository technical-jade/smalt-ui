import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    name: 'smalt/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'smalt/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-treeshake/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/.data/**',
      '**/test-results/**',
      '**/playwright-report/**',
      // Hidden root folders hold tool state and local caches, not project code.
      '.*/**',
    ],
  },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  skipFormatting,
  {
    // Internal components of the documentation site may have single-word names.
    name: 'smalt/docs-overrides',
    files: ['apps/docs/**/*.{ts,vue}'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
