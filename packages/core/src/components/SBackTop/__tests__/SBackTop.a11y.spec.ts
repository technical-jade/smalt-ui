import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { nextTick } from 'vue'
import { SBackTop } from '../index'

describe('SBackTop · a11y', () => {
  it('has no violations while hidden', async () => {
    const { container } = render(SBackTop)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations once shown', async () => {
    const { container } = render(SBackTop)
    Object.defineProperty(window, 'scrollY', { value: 400, configurable: true, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with a custom label', async () => {
    const { container } = render(SBackTop, { props: { label: 'To the beginning' } })
    expect(await axe(container)).toHaveNoViolations()
  })
})
