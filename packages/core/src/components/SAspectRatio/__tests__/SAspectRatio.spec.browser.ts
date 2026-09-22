import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { SAspectRatio } from '../index'

// Layout of stretched grid items: happy-dom has no geometry.
describe('SAspectRatio · browser', () => {
  it('next to a taller item the box keeps its ratio and its rounded corners', () => {
    const { container } = render({
      components: { SAspectRatio },
      template: `
        <div style="display: grid; grid-template-columns: 1fr 1fr; width: 400px">
          <SAspectRatio :ratio="1"><div>1:1</div></SAspectRatio>
          <SAspectRatio :ratio="16 / 9"><div>16:9</div></SAspectRatio>
        </div>
      `,
    })
    const wide = container.querySelectorAll<HTMLElement>('.s-aspect-ratio__content')[1]!
    const box = wide.getBoundingClientRect()
    expect(box.height).toBeCloseTo((box.width * 9) / 16, 0)
    const style = getComputedStyle(wide)
    expect(style.overflow).toBe('hidden')
    expect(parseFloat(style.borderBottomLeftRadius)).toBeGreaterThan(0)
  })
})
