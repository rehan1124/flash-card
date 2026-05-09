import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'

const APP_URL = process.env.APP_URL ?? 'http://127.0.0.1:5173'
const OUTPUT_DIR = path.resolve('public/screenshots')

const createSeedDeckPayload = () => {
  const now = new Date().toISOString()
  const deckId = 'readme-seed-deck'
  const cards = [
    {
      id: 'readme-card-1',
      marathi: 'नमस्कार',
      english: 'Hello',
      transliteration: 'Namaskar',
      wrongCount: 1,
      seenCount: 3,
      createdAt: now,
    },
    {
      id: 'readme-card-2',
      marathi: 'धन्यवाद',
      english: 'Thank you',
      transliteration: 'Dhanyavaad',
      wrongCount: 0,
      seenCount: 2,
      createdAt: now,
    },
    {
      id: 'readme-card-3',
      marathi: 'कसे आहात?',
      english: 'How are you?',
      transliteration: 'Kase aahat?',
      wrongCount: 2,
      seenCount: 4,
      createdAt: now,
    },
  ]

  return {
    deckId,
    payload: {
      decks: [
        {
          id: deckId,
          title: 'Marathi Basics (Sample)',
          description: 'Seeded for README screenshots.',
          cards,
          createdAt: now,
          updatedAt: now,
        },
      ],
      meta: { version: 1 },
    },
  }
}

const setStorage = async (page) => {
  const { deckId, payload } = createSeedDeckPayload()
  await page.addInitScript(({ seededDeck }) => {
    window.localStorage.setItem('marathi_flash_decks', JSON.stringify(seededDeck))
    window.localStorage.setItem('marathi_flash_theme', 'light')
    window.sessionStorage.removeItem('marathi_flash_session_stats')
  }, { seededDeck: payload })

  return deckId
}

const run = async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1512, height: 982 } })
  const page = await context.newPage()
  const deckId = await setStorage(page)

  await page.goto(`${APP_URL}/decks`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'decks-overview.png'), fullPage: true })

  await page.click(`[data-testid="af-deck-study-${deckId}"]`)
  await page.waitForLoadState('networkidle')
  await page.click('[data-testid="af-start-session"]')
  await page.waitForSelector('[data-testid="af-flip-card"]')
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'study-front.png'), fullPage: true })

  await page.click('[data-testid="af-flip-card"]')
  await page.waitForSelector('[data-testid="af-card-back"]')
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'study-back.png'), fullPage: true })

  await browser.close()
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
