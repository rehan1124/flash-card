import { expect, test } from '@fixtures/testFixtures'

test.describe('Phase 0 smoke checks', () => {
  test('app shell and theme toggle render', async ({ page }) => {
    await page.goto('/decks')

    await expect.soft(page.getByTestId('af-app-title')).toHaveText('Marathi Flashcards')
    await expect.soft(page.getByTestId('af-theme-toggle')).toBeVisible()
    await expect.soft(page.getByTestId('af-nav-decks')).toBeVisible()
  })
})
