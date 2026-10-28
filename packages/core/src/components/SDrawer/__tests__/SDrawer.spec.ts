import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { SDrawer } from '../index'
import { createSUI } from '../../../plugin'
import { compact } from '../../../presets'

const triggerBtn = '<button type="button">Open</button>'

describe('SDrawer', () => {
  it('renders the trigger, the drawer is closed', () => {
    render(SDrawer, { props: { title: 'Menu' }, slots: { trigger: triggerBtn, default: 'Body' } })
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
    expect(screen.queryByText('Body')).toBeNull()
  })

  it('is open with open=true and attached to the given side', async () => {
    render(SDrawer, {
      props: { open: true, title: 'Settings', side: 'left' },
      slots: { default: 'Content' },
    })
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(document.querySelector('.s-drawer__content')).toHaveClass('s-drawer__content--left')
  })

  it('defaults to the right side', async () => {
    render(SDrawer, { props: { open: true, title: 'X' }, slots: { default: 'body' } })
    await screen.findByRole('dialog')
    expect(document.querySelector('.s-drawer__content')).toHaveClass('s-drawer__content--right')
  })

  const content = () => document.querySelector<HTMLElement>('.s-drawer__content')!

  it('width sizes a side drawer; a number means pixels', async () => {
    const { rerender } = render(SDrawer, {
      props: { open: true, title: 'Menu', width: 480, height: 160 },
      slots: { default: 'Body' },
    })
    await screen.findByRole('dialog')
    expect(content().style.getPropertyValue('--s-drawer-size')).toBe('480px')

    await rerender({ open: true, title: 'Menu', width: '100%', height: 160 })
    expect(content().style.getPropertyValue('--s-drawer-size')).toBe('100%')
  })

  it('height sizes a top or bottom drawer; width does not apply there', async () => {
    const { rerender } = render(SDrawer, {
      props: { open: true, title: 'Menu', side: 'bottom', width: 480 },
      slots: { default: 'Body' },
    })
    await screen.findByRole('dialog')
    expect(content().style.getPropertyValue('--s-drawer-size')).toBe('')

    await rerender({ open: true, title: 'Menu', side: 'bottom', width: 480, height: '50vh' })
    expect(content().style.getPropertyValue('--s-drawer-size')).toBe('50vh')
  })

  it('a density preset does not change the drawer size', async () => {
    render(SDrawer, {
      props: { open: true, title: 'Menu' },
      slots: { default: 'Body' },
      global: { plugins: [createSUI({ preset: compact })] },
    })
    await screen.findByRole('dialog')
    expect(content().style.getPropertyValue('--s-drawer-size')).toBe('')
  })

  it('closes with the close button (v-model:open)', async () => {
    const { emitted } = render(SDrawer, {
      props: { open: true, title: 'X' },
      slots: { default: 'body' },
    })
    await screen.findByRole('dialog')
    await fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(emitted()['update:open']).toBeTruthy()
    expect(emitted()['update:open'].at(-1)).toEqual([false])
  })
})
