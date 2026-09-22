import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SButton } from '../../SButton'
import { SButtonGroup } from '../index'

const renderGroup = (props: Record<string, unknown> = {}) =>
  render(
    {
      components: { SButtonGroup, SButton },
      template: `<SButtonGroup v-bind="$attrs"><SButton>Copy</SButton><SButton>Paste</SButton></SButtonGroup>`,
    },
    { attrs: props },
  )

describe('SButtonGroup · a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderGroup({ label: 'Text actions' })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations when detached and disabled', async () => {
    const { container } = renderGroup({ attached: false, disabled: true })
    expect(await axe(container)).toHaveNoViolations()
  })
})
