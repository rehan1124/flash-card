import { test } from '@fixtures/testFixtures'
import { testCard, testDeck } from '@fixtures/testData'

test.describe('Phase 1 deck workflow', () => {
  test.beforeEach(async ({ decksPage }) => {
    await decksPage.goto()
    await decksPage.resetStorage()
  })

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      window.localStorage.clear()
      window.sessionStorage.clear()
    })
  })

  test('create deck, add card, and persist after reload', async ({ page, decksPage }) => {

    await decksPage.createDeck(testDeck.title, testDeck.description)
    await decksPage.expectDeckWithCount(testDeck.title, '0 cards')

    await decksPage.addCard(
      testDeck.title,
      testCard.marathi,
      testCard.english,
      testCard.transliteration
    )
    await decksPage.expectDeckWithCount(testDeck.title, '1 cards')

    await page.reload()
    await decksPage.expectDeckWithCount(testDeck.title, '1 cards')
  })

  test('loads starter deck through seed button', async ({ decksPage }) => {
    await decksPage.seedStarterDeck()
    await decksPage.expectDeckWithCount('Marathi Starter Deck (100)', '100 cards')
  })
})
