import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { SForm, SInput, required } from '../../../index'

describe('SForm · a11y', () => {
  it('has no violations with shown errors', async () => {
    const { container } = render({
      components: { SForm, SInput },
      setup: () => ({ rules: [required()] }),
      template: `<SForm aria-label="Sign up">
        <SInput label="Email" name="email" :rules="rules" />
        <button type="submit">Send</button>
      </SForm>`,
    })
    container.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }))
    await flushPromises()
    expect(await axe(container)).toHaveNoViolations()
  })
})
