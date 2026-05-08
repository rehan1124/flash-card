import type { Deck } from '../types'

const STORAGE_KEY = 'marathi_flash_decks'
const SCHEMA_VERSION = 1

type DeckStorage = {
  decks: Deck[]
  meta: {
    version: number
  }
}

const isDeckStorage = (value: unknown): value is DeckStorage => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<DeckStorage>
  return Array.isArray(candidate.decks)
}

const migrateStorage = (storage: DeckStorage): DeckStorage => {
  if (!storage.meta || storage.meta.version !== SCHEMA_VERSION) {
    return {
      ...storage,
      meta: { version: SCHEMA_VERSION },
    }
  }

  return storage
}

export const loadDecks = (): Deck[] => {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!isDeckStorage(parsed)) {
      return []
    }

    const migrated = migrateStorage(parsed)
    if (migrated !== parsed) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
    }

    return migrated.decks
  } catch {
    return []
  }
}

export const saveDecks = (decks: Deck[]) => {
  const payload: DeckStorage = {
    decks,
    meta: { version: SCHEMA_VERSION },
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export const clearDecks = () => {
  window.localStorage.removeItem(STORAGE_KEY)
}

export const storageKeys = {
  decks: STORAGE_KEY,
}
