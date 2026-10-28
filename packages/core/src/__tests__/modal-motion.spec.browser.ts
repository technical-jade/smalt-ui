// The Playwright provider types add `send` to the CDP session returned by `cdp()`.
/// <reference types="@vitest/browser-playwright" />
import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { cdp } from 'vitest/browser'
import type { Component } from 'vue'
import { SAlertDialog, SDialog, SDrawer } from '../index'

const reduceMotion = (on: boolean) =>
  cdp().send('Emulation.setEmulatedMedia', {
    features: on ? [{ name: 'prefers-reduced-motion', value: 'reduce' }] : [],
  })

const OVERLAYS: [string, Component, string, string][] = [
  ['SDialog', SDialog, 'dialog', 's-dialog'],
  ['SAlertDialog', SAlertDialog, 'alertdialog', 's-alert-dialog'],
  ['SDrawer', SDrawer, 'dialog', 's-drawer'],
]

// The media feature is emulated through the DevTools protocol, which only a real browser has.
describe('modal overlays · motion', () => {
  afterEach(() => reduceMotion(false))

  it.each(OVERLAYS)('%s animates its entry by default', async (_, component, role, block) => {
    render(component, { props: { open: true, title: 'Title' } })
    const content = await screen.findByRole(role)
    expect(getComputedStyle(content).animationName).toBe(`${block}-content-in`)
  })

  it.each(OVERLAYS)(
    '%s does not animate with prefers-reduced-motion: reduce',
    async (_, component, role, block) => {
      await reduceMotion(true)
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true)
      render(component, { props: { open: true, title: 'Title' } })
      const content = await screen.findByRole(role)
      expect(getComputedStyle(content).animationName).toBe('none')
      const overlay = document.querySelector(`.${block}__overlay`)!
      expect(getComputedStyle(overlay).animationName).toBe('none')
    },
  )
})
