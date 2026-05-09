import { expect, test } from '@fixtures/testFixtures'
import { testCard, testDeck } from '@fixtures/testData'

test.describe('Phase 2 study session', () => {
  test('TC004 | Study flow records right/wrong behavior', async ({ decksPage, studyPage }) => {
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
    await studyPage.expectWrongAnswersCount(1)
    await studyPage.expectMetrics('1', '0', '1')

    await studyPage.flipCard()
    await expect.soft(studyPage.markRightButton).toBeVisible()
    await studyPage.markRight()
    await studyPage.expectMetrics('2', '1', '1')

    await expect.soft(studyPage.previousButton).toBeEnabled()
    await studyPage.goPrevious()
    await expect.soft(studyPage.flipCardButton).toBeVisible()
  })

  test('TC005 | Session stats reset after page reload', async ({ page, decksPage, studyPage }) => {
    await decksPage.goto()
    await decksPage.resetStorage()
    await decksPage.createDeck(testDeck.title, testDeck.description)
    await decksPage.addCard(testDeck.title, testCard.marathi, testCard.english, testCard.transliteration)

    await decksPage.openFirstStudySession()
    await studyPage.startSession()

    await studyPage.flipCard()
    await studyPage.markWrong()
    await studyPage.expectMetrics('1', '0', '1')
    await studyPage.expectWrongAnswersCount(1)

    await page.reload({ waitUntil: 'networkidle' })

    await studyPage.expectSessionStatsCleared()
    await studyPage.expectWrongAnswersCount(0)
  })
})
