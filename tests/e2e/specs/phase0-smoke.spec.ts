import { test } from '@fixtures/testFixtures'

test.describe('Phase 0 smoke checks', () => {
  test('TC001 | App shell loads with core navigation', async ({ appShellPage }) => {
    await appShellPage.gotoDecks()
    await appShellPage.expectCoreShellVisible()
  })
})
