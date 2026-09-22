/**
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useConfirm } from '../composables/useConfirm'
import { confirmQueue } from '../internal/confirmQueue'

/**
 * The confirmation queue is a module singleton shared by all server requests. An entry would
 * leak into another user's response, so on the server the call resolves as declined.
 */
describe('useConfirm · SSR', () => {
  let warn: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warn.mockRestore()
  })

  it('declines on the server and does not grow the queue', async () => {
    const { confirm } = useConfirm()

    await expect(confirm({ title: 'Delete the project?' })).resolves.toBe(false)
    expect(confirmQueue.value).toHaveLength(0)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('during server rendering'))
  })
})
