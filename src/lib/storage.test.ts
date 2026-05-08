import { clearDecks, loadDecks, saveDecks, storageKeys } from './storage'
import type { Deck } from '../types'

const sampleDecks: Deck[] = [
  {
    id: 'deck-1',
    title: 'Basics',
    cards: [
      {
        id: 'card-1',
        marathi: 'नमस्कार',
        english: 'Hello',
        seenCount: 0,
        wrongCount: 0,
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
]

describe('storage', () => {
  beforeEach(() => {
    clearDecks()
  })

  it('saves and loads decks as a roundtrip', () => {
    saveDecks(sampleDecks)
    const loaded = loadDecks()

    expect(loaded).toEqual(sampleDecks)
  })

  it('returns empty list for invalid payload', () => {
    window.localStorage.setItem(storageKeys.decks, JSON.stringify({ bad: true }))

    const loaded = loadDecks()

    expect(loaded).toEqual([])
  })
})
