import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

/** Readable typed text + placeholders on white / slate card surfaces (light & dark). */
const formControlClass =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400'

export const DecksPage = () => {
  const { decks, createDeck, addCardToDeck, seedStarterDeck } = useAppStore()
  const [selectedDeckId, setSelectedDeckId] = useState<string>('')

  const [deckTitle, setDeckTitle] = useState('')
  const [deckDescription, setDeckDescription] = useState('')
  const [marathi, setMarathi] = useState('')
  const [english, setEnglish] = useState('')
  const [transliteration, setTransliteration] = useState('')

  const selectedDeck = useMemo(
    () => decks.find((deck) => deck.id === selectedDeckId),
    [decks, selectedDeckId]
  )

  const onCreateDeck = (event: FormEvent) => {
    event.preventDefault()
    if (!deckTitle.trim()) {
      return
    }

    createDeck(deckTitle.trim(), deckDescription.trim() || undefined)
    setDeckTitle('')
    setDeckDescription('')
  }

  const onAddCard = (event: FormEvent) => {
    event.preventDefault()
    if (!selectedDeck || !marathi.trim() || !english.trim()) {
      return
    }

    addCardToDeck(selectedDeck.id, {
      marathi: marathi.trim(),
      english: english.trim(),
      transliteration: transliteration.trim() || undefined,
    })

    setMarathi('')
    setEnglish('')
    setTransliteration('')
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Decks</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Create decks, add cards, and launch study sessions.
        </p>
      </header>

      <button
        data-testid="af-seed-starter-deck"
        type="button"
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        onClick={seedStarterDeck}
      >
        Load Starter Deck
      </button>

      <section className="grid gap-6 lg:grid-cols-2">
        <form
          className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
          onSubmit={onCreateDeck}
        >
          <h3 className="font-semibold">Create Deck</h3>
          <input
            data-testid="af-deck-title-input"
            className={formControlClass}
            placeholder="Deck title"
            value={deckTitle}
            onChange={(event) => setDeckTitle(event.target.value)}
          />
          <textarea
            data-testid="af-deck-description-input"
            className={formControlClass}
            placeholder="Description (optional)"
            value={deckDescription}
            onChange={(event) => setDeckDescription(event.target.value)}
          />
          <button
            data-testid="af-create-deck-submit"
            type="submit"
            className="min-h-11 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
          >
            Create Deck
          </button>
        </form>

        <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-semibold">Deck List</h3>
          {decks.length === 0 && (
            <p className="text-sm text-slate-500">No decks yet. Create one to get started.</p>
          )}
          {decks.map((deck) => (
            <article
              key={deck.id}
              data-testid={`af-deck-item-${deck.id}`}
              className="rounded-md border border-slate-200 p-3 dark:border-slate-700"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p data-testid="af-deck-title" className="font-medium">
                    {deck.title}
                  </p>
                  <p data-testid="af-deck-card-count" className="text-sm text-slate-500">
                    {deck.cards.length} cards
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    data-testid={`af-deck-edit-${deck.id}`}
                    type="button"
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
                    onClick={() => setSelectedDeckId(deck.id)}
                  >
                    Edit
                  </button>
                  <Link
                    data-testid={`af-deck-study-${deck.id}`}
                    className="rounded-md bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-500"
                    to={`/deck/${deck.id}/study`}
                  >
                    Study
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </section>

      <form
        className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        onSubmit={onAddCard}
      >
        <h3 className="font-semibold">Deck Editor</h3>
        <select
          data-testid="af-deck-selector"
          className={`${formControlClass} ${selectedDeckId ? '' : 'text-slate-500 dark:text-slate-400'}`}
          value={selectedDeckId}
          onChange={(event) => setSelectedDeckId(event.target.value)}
        >
          <option value="">Select deck</option>
          {decks.map((deck) => (
            <option key={deck.id} value={deck.id}>
              {deck.title}
            </option>
          ))}
        </select>
        <input
          data-testid="af-card-marathi-input"
          className={formControlClass}
          placeholder="Marathi (Devanagari)"
          value={marathi}
          onChange={(event) => setMarathi(event.target.value)}
        />
        <input
          data-testid="af-card-english-input"
          className={formControlClass}
          placeholder="English meaning"
          value={english}
          onChange={(event) => setEnglish(event.target.value)}
        />
        <input
          data-testid="af-card-transliteration-input"
          className={formControlClass}
          placeholder="Transliteration (optional)"
          value={transliteration}
          onChange={(event) => setTransliteration(event.target.value)}
        />
        <button
          data-testid="af-add-card-submit"
          type="submit"
          className="min-h-11 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Add Card
        </button>
      </form>
    </div>
  )
}
