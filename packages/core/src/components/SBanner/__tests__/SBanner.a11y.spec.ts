import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { SBanner } from '../index'
import type { SBannerVariant } from '../types'

const VARIANTS: SBannerVariant[] = ['neutral', 'info', 'positive', 'warning', 'negative']

describe('SBanner · a11y', () => {
  it.each(VARIANTS)('%s has no violations', async (variant) => {
    const { container } = render(SBanner, {
      props: { variant, title: 'A new version is available' },
      slots: { default: 'Reload the page to get it.' },
    })
    expect(await axe(container)).toHaveNoViolations()
  })

  it.each(VARIANTS)('%s has no violations with actions and a close button', async (variant) => {
    const { container } = render(SBanner, {
      props: { variant, title: 'Your trial ends in 3 days', closable: true },
      slots: {
        default: 'Upgrade to keep the workspace.',
        actions: '<button type="button">Upgrade</button>',
      },
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
