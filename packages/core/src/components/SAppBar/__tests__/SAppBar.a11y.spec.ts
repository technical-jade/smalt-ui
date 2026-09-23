import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SAppBar } from '../index'

describe('SAppBar · a11y', () => {
  it('has no violations as the page banner', async () => {
    const { container } = render(SAppBar, {
      slots: { prepend: 'Menu', default: 'Dashboard', append: 'Profile' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations without the landmark role', async () => {
    const { container } = render(SAppBar, {
      props: { landmark: false, color: 'teal' },
      slots: { default: 'Panel' },
    })
    expect(await axe(container, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})
