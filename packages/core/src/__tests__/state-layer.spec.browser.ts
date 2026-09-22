import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SButton } from '../components/SButton'

// A disabled link button must not light up under the pointer: it would look clickable.
describe('state layer', () => {
  it.each(['outline', 'ghost'])(
    '%s link button: no hover layer while disabled',
    async (variant) => {
      const { container } = render({
        components: { SButton },
        setup: () => ({ variant }),
        template: `
        <SButton as="a" href="#a" :variant="variant">Active</SButton>
        <SButton as="a" href="#b" :variant="variant" disabled>Disabled</SButton>
      `,
      })
      const [active, disabled] = container.querySelectorAll<HTMLElement>('.s-button')
      await userEvent.hover(active!)
      expect(getComputedStyle(active!).backgroundImage).not.toBe('none')
      // The disabled button ignores the pointer, so the hover is simulated on the element itself.
      disabled!.style.pointerEvents = 'auto'
      await userEvent.hover(disabled!)
      expect(getComputedStyle(disabled!).backgroundImage).toBe('none')
    },
  )
})
