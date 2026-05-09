import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CardView } from '../components/CardView'
import { StatsPanel } from '../components/StatsPanel'
import { shuffle } from '../lib/utils'
import { useAppStore } from '../store/useAppStore'
import type { UUID } from '../types'

export const StudyPage = () => {
  const { deckId = '' } = useParams()
  const { decks, sessionStats, startSession, recordAnswer, updateDecks } = useAppStore()
  const [queue, setQueue] = useState<UUID[]>([])
  const [index, setIndex] = useState(0)
  const [redoQueue, setRedoQueue] = useState<UUID[]>([])

  const deck = useMemo(() => decks.find((item) => item.id === deckId), [decks, deckId])

  const activeCard = useMemo(() => {
    if (!deck || queue.length === 0) {
      return undefined
    }

    const cardId = queue[index]
    return deck.cards.find((card) => card.id === cardId)
  }, [deck, index, queue])

  if (!deck) {
    return (
      <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <p>Deck not found.</p>
        <Link className="text-indigo-600 underline dark:text-indigo-300" to="/decks">
          Back to decks
        </Link>
      </section>
    )
  }

  const updateCardCounters = (cardId: UUID, isCorrect: boolean) => {
    // Persist card-level learning signals so future sessions can prioritize weak cards.
    updateDecks((existingDecks) =>
      existingDecks.map((existingDeck) => {
        if (existingDeck.id !== deck.id) {
          return existingDeck
        }

        return {
          ...existingDeck,
          updatedAt: new Date().toISOString(),
          cards: existingDeck.cards.map((card) => {
            if (card.id !== cardId) {
              return card
            }

            return {
              ...card,
              seenCount: card.seenCount + 1,
              wrongCount: card.wrongCount + (isCorrect ? 0 : 1),
            }
          }),
        }
      })
    )
  }

  const moveToNext = () => {
    setIndex((previous) => Math.min(previous + 1, Math.max(queue.length - 1, 0)))
  }

  const moveToPrevious = () => {
    setIndex((previous) => Math.max(previous - 1, 0))
  }

  const handleMark = (isCorrect: boolean) => {
    if (!activeCard) {
      return
    }

    updateCardCounters(activeCard.id, isCorrect)
    recordAnswer(isCorrect)
    if (!isCorrect) {
      // Keep a simple session-level tally for UX visibility ("Wrong answers: N").
      setRedoQueue((previous) => [...previous, activeCard.id])
    }

    moveToNext()
  }

  const isAtLast = index >= queue.length - 1
  const isSessionReady = queue.length > 0

  const initializeSession = () => {
    // Session order is randomized to reduce positional memorization.
    setQueue(shuffle(deck.cards.map((card) => card.id)))
    setIndex(0)
    setRedoQueue([])
    startSession()
  }

  return (
    <div className="space-y-5">
      <header data-testid="af-study-header" className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">{deck.title}</h2>
          <p className="text-sm text-slate-500">
            Card {queue.length === 0 ? 0 : index + 1} of {queue.length}
          </p>
        </div>
        <Link
          data-testid="af-back-to-decks"
          className="text-sm text-indigo-600 underline dark:text-indigo-300"
          to="/decks"
        >
          Back to decks
        </Link>
      </header>

      <StatsPanel stats={sessionStats} />

      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        {isSessionReady && activeCard ? (
          <CardView
            key={`${activeCard.id}-${index}`}
            card={activeCard}
            onMarkRight={() => handleMark(true)}
            onMarkWrong={() => handleMark(false)}
          />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-500">
              {deck.cards.length === 0
                ? 'No cards in this deck yet.'
                : 'Start a session to build a shuffled study queue.'}
            </p>
            {deck.cards.length > 0 && (
              <button
                data-testid="af-start-session"
                type="button"
                className="min-h-11 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                onClick={initializeSession}
              >
                Start Session
              </button>
            )}
          </div>
        )}
      </div>

      <footer className="flex flex-wrap gap-3">
        <button
          data-testid="af-previous-card"
          type="button"
          className="min-h-11 rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-800"
          disabled={index === 0 || !isSessionReady}
          onClick={moveToPrevious}
        >
          Previous
        </button>
        <button
          data-testid="af-next-card"
          type="button"
          className="min-h-11 rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-800"
          disabled={isAtLast || !isSessionReady}
          onClick={moveToNext}
        >
          Next
        </button>
        {isSessionReady && (
          <button
            data-testid="af-restart-session"
            type="button"
            className="min-h-11 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            onClick={initializeSession}
          >
            Restart Session
          </button>
        )}
        <span
          data-testid="af-unknown-count"
          className="ml-auto rounded-md bg-amber-100 px-3 py-2 text-sm text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
        >
          Wrong answers: {redoQueue.length}
        </span>
      </footer>
    </div>
  )
}
