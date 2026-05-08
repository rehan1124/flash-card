import { test as base } from '@playwright/test'
import { DecksPageModel } from '@pages/DecksPageModel'
import { StudyPageModel } from '@pages/StudyPageModel'

type AppFixtures = {
  decksPage: DecksPageModel
  studyPage: StudyPageModel
}

/**
 * Shared Playwright fixture that provides page-object instances.
 * Tests consume these fixtures to avoid manual class construction.
 */
export const test = base.extend<AppFixtures>({
  decksPage: async ({ page }, use) => {
    await use(new DecksPageModel(page))
  },
  studyPage: async ({ page }, use) => {
    await use(new StudyPageModel(page))
  },
})

export { expect } from '@playwright/test'
