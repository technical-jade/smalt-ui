import { expect, test, type Locator, type Page } from '@playwright/test'

const clearButton = (page: Page, field: Locator) =>
  page.locator('.s-autocomplete__control', { has: field }).getByRole('button', { name: 'Clear' })

/**
 * SAutocomplete scenarios on the built showcase: focus leaving with Tab and the panel behavior
 * depend on real focus delivery and key presses, which happy-dom does not have.
 */
test.describe('SAutocomplete', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/autocomplete')
  })

  test('leaving by keyboard through the clear button validates the field', async ({ page }) => {
    // The "Validation" demo is the last field labeled "City".
    const field = page.getByLabel('City', { exact: true }).last()
    const error = page.getByText('Pick a city from the list', { exact: true })

    await field.click()
    await page.keyboard.type('chi')
    await expect(page.getByRole('listbox')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('listbox')).toBeHidden()

    await page.keyboard.press('Tab')
    await expect(clearButton(page, field)).toBeFocused()
    await expect(error).toBeHidden()

    await page.keyboard.press('Tab')
    await expect(error).toBeVisible()
    await expect(field).toHaveValue('chi')
  })

  test('@blur fires when Tab moves focus out through the clear button', async ({ page }) => {
    const field = page.getByLabel('Departure city')
    const error = page.getByText('Enter the departure city', { exact: true })

    await field.click()
    await page.keyboard.type('chi')
    await page.keyboard.press('Escape')
    await page.keyboard.press('Tab')
    await expect(clearButton(page, field)).toBeFocused()
    await expect(error).toBeHidden()

    await page.keyboard.press('Tab')
    await expect(clearButton(page, field)).not.toBeFocused()
    await expect(error).toBeVisible()
  })

  test('free-text: a suggestion completes the text, leaving the field keeps it', async ({
    page,
  }) => {
    const field = page.getByLabel('Email')

    await field.click()
    await page.keyboard.type('john')
    await expect(page.getByRole('listbox')).toBeHidden()

    await page.keyboard.type('@g')
    await page.getByRole('option', { name: 'john@gmail.com' }).click()
    await expect(field).toHaveValue('john@gmail.com')
    await expect(page.getByRole('listbox')).toBeHidden()
    await expect(field).toBeFocused()

    await page.keyboard.type('.uk')
    await page.keyboard.press('Tab')
    await expect(field).toHaveValue('john@gmail.com.uk')
  })

  test('free-text: the clear button empties the field', async ({ page }) => {
    const field = page.getByLabel('Email')
    await field.fill('john@outlook.com')
    await clearButton(page, field).click()
    await expect(field).toHaveValue('')
    await expect(field).toBeFocused()
  })
})
