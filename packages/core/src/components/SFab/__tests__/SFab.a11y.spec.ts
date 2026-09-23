import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SFab } from '../index'
import type { SFabAction } from '../types'

const actions: SFabAction[] = [
  { id: 'note', label: 'New note', icon: 'file-text' },
  { id: 'mail', label: 'New message', icon: 'mail', disabled: true },
]

describe('SFab · a11y', () => {
  it('has no violations as a circular button', async () => {
    const { container } = render(SFab, { props: { icon: 'plus', ariaLabel: 'Create' } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations as an extended button', async () => {
    const { container } = render(SFab, { props: { icon: 'plus', label: 'Compose' } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with the fan closed', async () => {
    const { container } = render(SFab, { props: { icon: 'plus', actions } })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with the fan open', async () => {
    const { container } = render(SFab, { props: { icon: 'plus', actions, open: true } })
    expect(await axe(container)).toHaveNoViolations()
  })
})
