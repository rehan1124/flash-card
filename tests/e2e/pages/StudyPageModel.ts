import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { step } from '@support/step'

/**
 * Page object for study-session interactions and assertions.
 */
export class StudyPageModel {
  readonly page: Page
  readonly startSessionButton: Locator
  readonly flipCardButton: Locator
  readonly markRightButton: Locator
  readonly markWrongButton: Locator
  readonly previousButton: Locator
  readonly nextButton: Locator
  readonly unknownCount: Locator
  readonly statsStudied: Locator
  readonly statsCorrect: Locator
  readonly statsIncorrect: Locator
  readonly statsEmpty: Locator

  constructor(page: Page) {
    this.page = page
    this.startSessionButton = page.getByTestId('af-start-session')
    this.flipCardButton = page.getByTestId('af-flip-card')
    this.markRightButton = page.getByTestId('af-mark-right')
    this.markWrongButton = page.getByTestId('af-mark-wrong')
    this.previousButton = page.getByTestId('af-previous-card')
    this.nextButton = page.getByTestId('af-next-card')
    this.unknownCount = page.getByTestId('af-unknown-count')
    this.statsStudied = page.getByTestId('af-stats-studied')
    this.statsCorrect = page.getByTestId('af-stats-correct')
    this.statsIncorrect = page.getByTestId('af-stats-incorrect')
    this.statsEmpty = page.getByTestId('af-stats-empty')
  }

  @step('Start study session')
  async startSession() {
    await this.startSessionButton.click()
  }

  @step('Flip current flashcard')
  async flipCard() {
    await this.flipCardButton.click()
  }

  @step('Mark answer as wrong')
  async markWrong() {
    await this.markWrongButton.click()
  }

  @step('Mark answer as right')
  async markRight() {
    await this.markRightButton.click()
  }

  @step('Navigate to previous card')
  async goPrevious() {
    await this.previousButton.click()
  }

  @step('Assert session metrics')
  async expectMetrics(studied: string, correct: string, incorrect: string) {
    await expect(this.statsStudied).toHaveText(studied)
    await expect(this.statsCorrect).toHaveText(correct)
    await expect(this.statsIncorrect).toHaveText(incorrect)
  }

  @step('Assert wrong answers count')
  async expectWrongAnswersCount(count: number) {
    await expect(this.unknownCount).toContainText('Wrong answers:')
    await expect(this.unknownCount).toContainText(String(count))
  }

  @step('Assert session stats cleared after reload')
  async expectSessionStatsCleared() {
    await expect(this.statsEmpty).toBeVisible()
    await expect(this.statsEmpty).toContainText('No active session yet.')
  }
}
