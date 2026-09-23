import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { h, ref } from 'vue'
import { SLoadingOverlay } from '../index'

/**
 * The whole point of the overlay is geometric: it has to fill its host and swallow the clicks
 * aimed at what it covers. happy-dom has no layout and no hit testing, so neither can be checked
 * in the unit project.
 */
describe('SLoadingOverlay · browser', () => {
  const clicks = ref(0)

  const host = (props: Record<string, unknown>) =>
    render({
      render: () =>
        h('div', { class: 's-loading-overlay-host', style: 'width: 240px; height: 160px' }, [
          h(
            'button',
            {
              type: 'button',
              style: 'width: 100%; height: 100%',
              onClick: () => (clicks.value += 1),
            },
            'Reload',
          ),
          h(SLoadingOverlay, props),
        ]),
    })

  it('fills the positioned host', () => {
    const { container } = host({ open: true })
    const region = container.querySelector('.s-loading-overlay-host')!.getBoundingClientRect()
    const overlay = container.querySelector('.s-loading-overlay')!.getBoundingClientRect()
    expect(overlay.width).toBeCloseTo(region.width, 0)
    expect(overlay.height).toBeCloseTo(region.height, 0)
    expect(overlay.top).toBeCloseTo(region.top, 0)
  })

  it('takes the pointer instead of the covered control', async () => {
    const { container } = host({ open: true })
    const button = container.querySelector('button')!.getBoundingClientRect()
    const hit = document.elementFromPoint(
      button.left + button.width / 2,
      button.top + button.height / 2,
    )
    expect(hit?.closest('.s-loading-overlay')).not.toBeNull()
    expect(clicks.value).toBe(0)
  })

  it('leaves the control reachable once it is closed', () => {
    const { container } = host({ open: false })
    const button = container.querySelector('button')!.getBoundingClientRect()
    const hit = document.elementFromPoint(
      button.left + button.width / 2,
      button.top + button.height / 2,
    )
    expect(hit?.tagName).toBe('BUTTON')
  })
})
