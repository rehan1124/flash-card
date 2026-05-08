import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { step } from '@support/step'

/**
 * Page object for deck creation, deck seeding, and card editing workflows.
 */
export class DecksPageModel {
  readonly page: Page
  readonly seedStarterButton: Locator
  readonly deckTitleInput: Locator
  readonly deckDescriptionInput: Locator
  readonly createDeckButton: Locator
  readonly deckSelector: Locator
  readonly cardMarathiInput: Locator
  readonly cardEnglishInput: Locator
  readonly cardTransliterationInput: Locator
  readonly addCardButton: Locator

  constructor(page: Page) {
    this.page = page
    this.seedStarterButton = page.getByTestId('af-seed-starter-deck')
    this.deckTitleInput = page.getByTestId('af-deck-title-input')
    this.deckDescriptionInput = page.getByTestId('af-deck-description-input')
    this.createDeckButton = page.getByTestId('af-create-deck-submit')
    this.deckSelector = page.getByTestId('af-deck-selector')
    this.cardMarathiInput = page.getByTestId('af-card-marathi-input')
    this.cardEnglishInput = page.getByTestId('af-card-english-input')
    this.cardTransliterationInput = page.getByTestId('af-card-transliteration-input')
    this.addCardButton = page.getByTestId('af-add-card-submit')
  }

  @step('Navigate to Decks page')
  async goto() {
    await this.page.goto('/decks')
  }

  @step('Reset browser local/session storage')
  async resetStorage() {
    await this.page.evaluate(() => {
      window.localStorage.clear()
      window.sessionStorage.clear()
    })
    await this.page.reload()
  }

  @step('Create deck')
  async createDeck(title: string, description: string) {
    await this.deckTitleInput.fill(title)
    await this.deckDescriptionInput.fill(description)
    await this.createDeckButton.click()
  }

  @step('Add card to selected deck')
  async addCard(deckTitle: string, marathi: string, english: string, transliteration: string) {
    await this.deckSelector.selectOption({ label: deckTitle })
    await this.cardMarathiInput.fill(marathi)
    await this.cardEnglishInput.fill(english)
    await this.cardTransliterationInput.fill(transliteration)
    await this.addCardButton.click()
  }

  @step('Seed starter deck')
  async seedStarterDeck() {
    await this.seedStarterButton.click()
  }

  @step('Assert deck title and card count are visible')
  async expectDeckWithCount(title: string, countLabel: string) {
    await expect(this.page.getByTestId('af-deck-title').filter({ hasText: title })).toBeVisible()
    await expect(this.page.getByTestId('af-deck-card-count').filter({ hasText: countLabel })).toBeVisible()
  }

  @step('Open first study session from deck list')
  async openFirstStudySession() {
    await this.page.getByRole('link', { name: 'Study' }).first().click()
  }
}
