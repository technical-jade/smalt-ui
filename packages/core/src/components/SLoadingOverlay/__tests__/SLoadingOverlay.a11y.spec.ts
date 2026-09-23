import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { h } from 'vue'
import { SLoadingOverlay } from '../index'

describe('SLoadingOverlay · a11y', () => {
  it('has no violations over a region', async () => {
    const { container } = render({
      render: () =>
        h('div', { class: 's-loading-overlay-host' }, [
          h('div', { inert: true }, 'Monthly report'),
          h(SLoadingOverlay, { open: true }),
        ]),
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations in fullscreen', async () => {
    const { container } = render(SLoadingOverlay, {
      props: { open: true, fullscreen: true, label: 'Publishing' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with custom content in the slot', async () => {
    const { container } = render(SLoadingOverlay, {
      props: { open: true },
      slots: { default: '<div role="status">Uploading, 42%</div>' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
