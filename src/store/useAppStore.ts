import { create } from 'zustand'
import { createStarterDeck } from '../data/starterDeck'
import { isNavigationReload } from '../lib/navigation'
import { clearSessionStats, loadSessionStats, saveSessionStats } from '../lib/sessionStats'
import { loadDecks, saveDecks } from '../lib/storage'
import { createId } from '../lib/utils'
import type { Card, Deck, SessionStats, UUID } from '../types'

type Theme = 'light' | 'dark'

type AppStore = {
  decks: Deck[]
  theme: Theme
  sessionStats?: SessionStats
  loadDecksFromStorage: () => void
  createDeck: (title: string, description?: string) => void
  addCardToDeck: (deckId: UUID, input: Omit<Card, 'id' | 'createdAt' | 'seenCount' | 'wrongCount'>) => void
  seedStarterDeck: () => void
  updateDecks: (updater: (decks: Deck[]) => Deck[]) => void
  startSession: () => void
  resetSession: () => void
  recordAnswer: (isCorrect: boolean) => void
  toggleTheme: () => void
}

const THEME_STORAGE_KEY = 'marathi_flash_theme'

const getStoredTheme = (): Theme => {
  // Default to light during SSR/non-browser execution to avoid runtime access errors.
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return storedTheme === 'dark' ? 'dark' : 'light'
}

const applyThemeClass = (theme: Theme) => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.classList.toggle('dark', theme === 'dark')
}

const initialTheme = getStoredTheme()
applyThemeClass(initialTheme)

export const useAppStore = create<AppStore>((set, get) => ({
  decks: [],
  theme: initialTheme,
  sessionStats: undefined,
  loadDecksFromStorage: () => {
    const decks = loadDecks()
    if (isNavigationReload()) {
      clearSessionStats()
      set({ decks, sessionStats: undefined })
      return
    }

    const sessionStats = loadSessionStats()
    set({ decks, sessionStats })
  },
  createDeck: (title, description) => {
    const now = new Date().toISOString()
    const nextDeck: Deck = {
      id: createId(),
      title,
      description,
      cards: [],
      createdAt: now,
      updatedAt: now,
    }

    const nextDecks = [nextDeck, ...get().decks]
    saveDecks(nextDecks)
    set({ decks: nextDecks })
  },
  addCardToDeck: (deckId, input) => {
    get().updateDecks((decks) =>
      decks.map((deck) => {
        if (deck.id !== deckId) {
          return deck
        }

        return {
          ...deck,
          updatedAt: new Date().toISOString(),
          cards: [
            ...deck.cards,
            {
              id: createId(),
              createdAt: new Date().toISOString(),
              seenCount: 0,
              wrongCount: 0,
              ...input,
            },
          ],
        }
      })
    )
  },
  seedStarterDeck: () => {
    // Prevent duplicate starter content when users click seed multiple times.
    const hasStarter = get().decks.some((deck) => deck.title.includes('Starter Deck'))
    if (hasStarter) {
      return
    }

    const nextDecks = [createStarterDeck(), ...get().decks]
    saveDecks(nextDecks)
    set({ decks: nextDecks })
  },
  updateDecks: (updater) => {
    const nextDecks = updater(get().decks)
    saveDecks(nextDecks)
    set({ decks: nextDecks })
  },
  startSession: () => {
    const stats: SessionStats = {
      sessionId: createId(),
      startedAt: new Date().toISOString(),
      studied: 0,
      correct: 0,
      incorrect: 0,
    }

    saveSessionStats(stats)
    set({ sessionStats: stats })
  },
  resetSession: () => {
    clearSessionStats()
    set({ sessionStats: undefined })
  },
  recordAnswer: (isCorrect) => {
    const previousStats = get().sessionStats
    // Recover gracefully if stats were cleared mid-session (e.g., tab/session reset).
    const nextStats: SessionStats = previousStats
      ? {
          ...previousStats,
          studied: previousStats.studied + 1,
          correct: previousStats.correct + (isCorrect ? 1 : 0),
          incorrect: previousStats.incorrect + (isCorrect ? 0 : 1),
        }
      : {
          sessionId: createId(),
          startedAt: new Date().toISOString(),
          studied: 1,
          correct: isCorrect ? 1 : 0,
          incorrect: isCorrect ? 0 : 1,
        }

    saveSessionStats(nextStats)
    set({ sessionStats: nextStats })
  },
  toggleTheme: () => {
    const nextTheme: Theme = get().theme === 'light' ? 'dark' : 'light'
    applyThemeClass(nextTheme)
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    set({ theme: nextTheme })
  },
}))
