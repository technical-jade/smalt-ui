import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/vue'
import { SAvatar } from '../index'

const PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

/** Image loading needs a real browser: happy-dom never fires load. */
describe('SAvatar · browser', () => {
  it('the fallback comes back when src is cleared after the image loaded', async () => {
    const { container, rerender } = render(SAvatar, { props: { src: PIXEL, fallback: 'AB' } })
    // Loaded: the fallback is gone (the img itself is mounted at once, hidden until then).
    await waitFor(() => expect(container.querySelector('.s-avatar__fallback')).toBeNull())
    await rerender({ src: undefined, fallback: 'AB' })
    await waitFor(() =>
      expect(container.querySelector('.s-avatar__fallback')).toHaveTextContent('AB'),
    )
  })
})
