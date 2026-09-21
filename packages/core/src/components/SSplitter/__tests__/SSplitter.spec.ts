import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { SSplitter } from '../index'
import type { SSplitterPanel } from '../index'

const panels: SSplitterPanel[] = [{ defaultSize: 30 }, { defaultSize: 70 }]

describe('SSplitter', () => {
  it('renders panel content from index slots', () => {
    render(SSplitter, {
      props: { panels },
      slots: { 'panel-0': 'Left', 'panel-1': 'Right' },
    })
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('inserts a handle between two panels', () => {
    const { container } = render(SSplitter, {
      props: { panels },
      slots: { 'panel-0': 'A', 'panel-1': 'B' },
    })
    expect(container.querySelectorAll('.s-splitter__handle')).toHaveLength(1)
  })

  it('three panels get two handles', () => {
    const { container } = render(SSplitter, {
      props: { panels: [{}, {}, {}] },
      slots: { 'panel-0': 'A', 'panel-1': 'B', 'panel-2': 'C' },
    })
    expect(container.querySelectorAll('.s-splitter__handle')).toHaveLength(2)
  })

  it('supports custom slot names', () => {
    render(SSplitter, {
      props: { panels: [{ name: 'sidebar' }, { name: 'main' }] },
      slots: { sidebar: 'Menu', main: 'Content' },
    })
    expect(screen.getByText('Menu')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies the direction class', () => {
    const { container } = render(SSplitter, {
      props: { panels, direction: 'vertical' },
      slots: { 'panel-0': 'A', 'panel-1': 'B' },
    })
    expect(container.querySelector('.s-splitter')).toHaveClass('s-splitter--vertical')
  })

  it('the handle has a name and the orientation across the split', () => {
    render(SSplitter, { props: { panels: [{ defaultSize: 30 }, { defaultSize: 70 }] } })
    const handle = screen.getByRole('separator', { name: 'Resize' })
    expect(handle).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('handleLabel and a vertical split', () => {
    render(SSplitter, {
      props: {
        panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
        direction: 'vertical',
        handleLabel: 'Resize preview',
      },
    })
    const handle = screen.getByRole('separator', { name: 'Resize preview' })
    expect(handle).toHaveAttribute('aria-orientation', 'horizontal')
  })
})
