export type UUID = string

export interface Card {
  id: UUID
  marathi: string
  english: string
  transliteration?: string
  examples?: string[]
  tags?: string[]
  wrongCount: number
  seenCount: number
  createdAt: string
}

export interface Deck {
  id: UUID
  title: string
  description?: string
  cards: Card[]
  createdAt: string
  updatedAt?: string
}

export interface SessionStats {
  sessionId: UUID
  startedAt: string
  studied: number
  correct: number
  incorrect: number
}
