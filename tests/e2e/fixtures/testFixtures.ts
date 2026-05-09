import { test as base } from '@playwright/test'
import { AppShellPageModel } from '@pages/AppShellPageModel'
import { DecksPageModel } from '@pages/DecksPageModel'
import { StudyPageModel } from '@pages/StudyPageModel'

type AppFixtures = {
  appShellPage: AppShellPageModel
  decksPage: DecksPageModel
  studyPage: StudyPageModel
}

/**
 * Shared Playwright fixture that provides page-object instances.
 * Tests consume these fixtures to avoid manual class construction.
 */
export const test = base.extend<AppFixtures>({
  appShellPage: async ({ page }, use) => {
    await use(new AppShellPageModel(page))
  },
  decksPage: async ({ page }, use) => {
    await use(new DecksPageModel(page))
  },
  studyPage: async ({ page }, use) => {
    await use(new StudyPageModel(page))
  },
})

export { expect } from '@playwright/test'
