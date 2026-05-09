import { expect, type Locator, type Page } from '@playwright/test'
import { step } from '@support/step'

/**
 * Page object for top-level app shell checks.
 */
export class AppShellPageModel {
  readonly page: Page
  readonly appTitle: Locator
  readonly navDecks: Locator
  readonly themeToggle: Locator

  constructor(page: Page) {
    this.page = page
    this.appTitle = page.getByTestId('af-app-title')
    this.navDecks = page.getByTestId('af-nav-decks')
    this.themeToggle = page.getByTestId('af-theme-toggle')
  }

  @step('Navigate to Decks page')
  async gotoDecks() {
    await this.page.goto('/decks')
  }

  @step('Assert app shell core navigation is visible')
  async expectCoreShellVisible() {
    await expect.soft(this.appTitle).toHaveText('Marathi Flashcards')
    await expect.soft(this.navDecks).toBeVisible()
    await expect.soft(this.themeToggle).toBeVisible()
  }
}
