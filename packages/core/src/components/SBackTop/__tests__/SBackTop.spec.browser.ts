import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { SBackTop } from '../index'

/** Real scrolling: happy-dom has neither scroll offsets nor a scrollTo that moves anything. */
describe('SBackTop · browser', () => {
  function mount() {
    const { container } = render({
      components: { SBackTop },
      template: `
        <div>
          <div
            id="scroll-box"
            style="height: 200px; overflow: auto"
          >
            <div style="height: 2000px">tall content</div>
          </div>
          <SBackTop
            target="#scroll-box"
            :visibility-height="100"
          />
        </div>
      `,
    })
    const box = container.querySelector<HTMLElement>('#scroll-box')!
    const root = container.querySelector<HTMLElement>('.s-back-top')!
    const control = container.querySelector<HTMLElement>('.s-back-top__control')!
    const button = control.querySelector<HTMLButtonElement>('.s-button')!
    return { box, root, control, button }
  }

  it('appears once the container is scrolled and returns it to the top', async () => {
    const { box, control, button } = mount()
    expect(getComputedStyle(control).display).toBe('none')

    box.scrollTop = 600
    await vi.waitFor(() => expect(getComputedStyle(control).display).not.toBe('none'))
    await vi.waitFor(() => expect(getComputedStyle(control).opacity).toBe('1'))

    button.click()
    await vi.waitFor(() => expect(box.scrollTop).toBe(0), { timeout: 3000 })
  })

  it('hides again below the threshold', async () => {
    const { box, control } = mount()

    box.scrollTop = 600
    await vi.waitFor(() => expect(getComputedStyle(control).display).not.toBe('none'))

    box.scrollTop = 50
    await vi.waitFor(() => expect(getComputedStyle(control).display).toBe('none'), {
      timeout: 3000,
    })
  })

  it('is pinned to the viewport corner by the offset variables', async () => {
    const { box, root, control } = mount()
    root.style.setProperty('--s-back-top-bottom', '40px')
    root.style.setProperty('--s-back-top-right', '40px')

    box.scrollTop = 600
    await vi.waitFor(() => expect(getComputedStyle(control).display).not.toBe('none'))

    expect(getComputedStyle(root).position).toBe('fixed')
    const rect = control.getBoundingClientRect()
    expect(window.innerHeight - rect.bottom).toBeCloseTo(40, 0)
    expect(window.innerWidth - rect.right).toBeCloseTo(40, 0)
  })
})
