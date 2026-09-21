import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { installDefaults } from '../../../composables'
import { SCollapsible } from '../index'

describe('SCollapsible', () => {
  it('renders the trigger with a title, collapsed by default', () => {
    render(SCollapsible, { props: { title: 'More' }, slots: { default: 'Text' } })
    expect(screen.getByRole('button', { name: /More/ })).toHaveAttribute('aria-expanded', 'false')
  })

  it('expands on click (v-model:open)', async () => {
    const { emitted } = render(SCollapsible, {
      props: { title: 'T' },
      slots: { default: 'Body' },
    })
    await fireEvent.click(screen.getByRole('button'))
    expect(emitted()['update:open'][0]).toEqual([true])
    expect(await screen.findByText('Body')).toBeInTheDocument()
  })

  it('is expanded when open=true', () => {
    render(SCollapsible, { props: { title: 'T', open: true }, slots: { default: 'Body' } })
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('disabled disables the trigger', () => {
    render(SCollapsible, { props: { title: 'T', disabled: true }, slots: { default: 'X' } })
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('supports a custom trigger via the slot', () => {
    render(SCollapsible, { slots: { trigger: 'Custom title', default: 'X' } })
    expect(screen.getByRole('button', { name: /Custom title/ })).toBeInTheDocument()
  })

  it('renders the chevron-down indicator by default', () => {
    const { container } = render(SCollapsible, { props: { title: 'T' }, slots: { default: 'X' } })
    expect(container.querySelector('.s-collapsible__chevron path')).toHaveAttribute(
      'd',
      'm6 9 6 6 6-6',
    )
  })

  it('uses the icon from the expandIcon prop', () => {
    const { container } = render(SCollapsible, {
      props: { title: 'T', expandIcon: 'chevron-up' },
      slots: { default: 'X' },
    })
    expect(container.querySelector('.s-collapsible__chevron path')).toHaveAttribute(
      'd',
      'm18 15-6-6-6 6',
    )
  })

  it('unmount-on-hide=false keeps collapsed content mounted and hidden', () => {
    render(SCollapsible, {
      props: { title: 'T' },
      slots: { default: '<input aria-label="Draft" />' },
      global: {
        plugins: [(app) => installDefaults(app, { SCollapsible: { unmountOnHide: false } })],
      },
    })
    expect(screen.getByLabelText('Draft', { selector: 'input' })).not.toBeVisible()
  })

  it('unmounts collapsed content by default', () => {
    render(SCollapsible, { props: { title: 'T' }, slots: { default: 'Body' } })
    expect(screen.queryByText('Body')).toBeNull()
  })
})
