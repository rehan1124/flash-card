import { expect, test } from '@fixtures/testFixtures'
import { testCard, testDeck } from '@fixtures/testData'

test.describe('Phase 2 study session', () => {
  test('flip, mark wrong/right, navigate, and update stats', async ({ decksPage, studyPage }) => {
    await decksPage.goto()
    await decksPage.resetStorage()
    await decksPage.createDeck(testDeck.title, testDeck.description)
    await decksPage.addCard(testDeck.title, testCard.marathi, testCard.english, testCard.transliteration)
    await decksPage.addCard(testDeck.title, 'आई', 'Mother', 'aai')

    await decksPage.openFirstStudySession()

    await studyPage.startSession()

    await studyPage.flipCard()
    await expect.soft(studyPage.markWrongButton).toBeVisible()
    await studyPage.markWrong()
    await studyPage.expectUnknownCount(1)
    await studyPage.expectMetrics('1', '0', '1')

    await studyPage.flipCard()
    await expect.soft(studyPage.markRightButton).toBeVisible()
    await studyPage.markRight()
    await studyPage.expectMetrics('2', '1', '1')

    await expect.soft(studyPage.previousButton).toBeEnabled()
    await studyPage.goPrevious()
    await expect.soft(studyPage.flipCardButton).toBeVisible()
  })
})
