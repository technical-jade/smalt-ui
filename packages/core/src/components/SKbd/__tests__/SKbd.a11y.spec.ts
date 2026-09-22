import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SKbd } from '../index'

describe('SKbd · a11y', () => {
  it('has no accessibility violations for a symbol key', async () => {
    const { container } = render(SKbd, { props: { value: 'meta' } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations for plain text', async () => {
    const { container } = render(SKbd, { props: { value: 'K', variant: 'subtle' } })
    expect(await axe(container)).toHaveNoViolations()
  })
})
