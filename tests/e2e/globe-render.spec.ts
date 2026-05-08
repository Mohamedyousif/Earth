import { test, expect } from '@playwright/test'

test('globe renders on load', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Wonder Earth')
  // Loading screen should appear first
  await expect(page.locator('text=Discovering Earth')).toBeVisible()
  // Canvas (WebGL globe) should appear
  await expect(page.locator('canvas')).toBeVisible({ timeout: 10000 })
})

test('page has correct metadata', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Wonder Earth')
})
