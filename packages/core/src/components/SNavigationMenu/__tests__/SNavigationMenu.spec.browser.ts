import { describe, expect, it, onTestFinished } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { SNavigationMenu } from '../index'

const links = [{ label: 'Reports', href: '/reports', description: 'Summaries for a period' }]
const items = [
  { label: 'Products', links },
  { label: 'Business solutions', links },
  { label: 'Company', links },
]

// Reka places the panel by the real geometry of the items, which happy-dom does not have.
describe('SNavigationMenu · browser', () => {
  const open = async (name: string) => {
    await userEvent.click(screen.getByRole('button', { name }))
    await screen.findByRole('link', { name: /Reports/ })
  }

  const container = (style: string) => {
    const el = document.body.appendChild(Object.assign(document.createElement('div'), { style }))
    onTestFinished(() => el.remove())
    return el
  }

  // Reka sets the panel offset after measuring it, a frame or two after it opens.
  const panel = () =>
    document.querySelector('.s-navigation-menu__viewport')!.getBoundingClientRect()

  it('by default the panel lines up with the start of the item that opened it', async () => {
    render(SNavigationMenu, { props: { items } })
    await open('Company')
    const trigger = screen.getByRole('button', { name: 'Company' }).getBoundingClientRect()
    await expect.poll(() => Math.round(panel().left)).toBe(Math.round(trigger.left))
  })

  it('align="end" lines the panel up with the end of the item', async () => {
    render(SNavigationMenu, {
      props: { items, align: 'end' },
      container: container('padding-left: 400px'),
    })
    await open('Company')
    const trigger = screen.getByRole('button', { name: 'Company' }).getBoundingClientRect()
    await expect.poll(() => Math.round(panel().right)).toBe(Math.round(trigger.right))
  })

  it('in a flex parent that stretches the menu, the panel stays under the bar', async () => {
    render(SNavigationMenu, {
      props: { items },
      container: container('display: flex; min-height: 300px'),
    })
    await open('Products')
    const trigger = screen.getByRole('button', { name: 'Products' }).getBoundingClientRect()
    await expect.poll(() => panel().top - trigger.bottom).toBeLessThan(16)
  })

  it('the panel stays above positioned blocks further down the page', async () => {
    render(SNavigationMenu, { props: { items } })
    await open('Products')
    const wrap = document.querySelector('.s-navigation-menu__viewport-wrap')!
    expect(getComputedStyle(wrap).zIndex).toBe('1500')
  })
})
