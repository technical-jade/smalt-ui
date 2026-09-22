/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SForm } from '../components/SForm'
import { required } from '../composables/rules'
import { useValidation } from '../composables/useValidation'

// Fields register on mount, which never happens on the server.
describe('SForm · SSR', () => {
  it('renders the validity as unknown', async () => {
    const Field = {
      setup() {
        useValidation({ value: () => '', rules: [required()] })
        return () => h('input')
      },
    }
    const app = createSSRApp({
      render: () =>
        h(SForm, null, {
          default: ({ valid }: { valid: boolean | null }) => [h(Field), h('output', String(valid))],
        }),
    })
    expect(await renderToString(app)).toContain('<output>null</output>')
  })
})
