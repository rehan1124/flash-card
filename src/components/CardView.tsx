import { useMemo, useState } from 'react'
import type { Card } from '../types'

type CardViewProps = {
  card: Card
  onMarkRight: () => void
  onMarkWrong: () => void
}

export const CardView = ({ card, onMarkRight, onMarkWrong }: CardViewProps) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showTransliteration, setShowTransliteration] = useState(false)

  const canShowTransliteration = useMemo(
    () => Boolean(card.transliteration?.trim()),
    [card.transliteration]
  )

  return (
    <section className="space-y-4">
      <button
        data-testid="af-flip-card"
        type="button"
        aria-label="Flip card"
        className="w-full rounded-xl border border-slate-200 bg-transparent p-0 dark:border-slate-700"
        onClick={() => setIsFlipped((value) => !value)}
      >
        <div className={`card-3d h-64 w-full ${isFlipped ? 'is-flipped' : ''}`}>
          <div
            data-testid="af-card-front"
            className="card-face card-front flex h-full items-center justify-center rounded-xl bg-white p-6 text-center text-3xl font-semibold shadow-sm dark:bg-slate-900"
          >
            {card.marathi}
          </div>
          <div
            data-testid="af-card-back"
            className="card-face card-back flex h-full flex-col items-center justify-center rounded-xl bg-indigo-50 p-6 text-center dark:bg-indigo-950/60"
          >
            <p
              data-testid="af-card-english"
              className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100"
            >
              {card.english}
            </p>
            {canShowTransliteration && (
              <div className="mt-4">
                <button
                  data-testid="af-toggle-transliteration"
                  type="button"
                  aria-label="Reveal transliteration"
                  className="rounded-md border border-indigo-300 px-3 py-1 text-sm text-indigo-800 hover:bg-indigo-100 dark:border-indigo-700 dark:text-indigo-200 dark:hover:bg-indigo-900"
                  onClick={(event) => {
                    event.stopPropagation()
                    setShowTransliteration((value) => !value)
                  }}
                >
                  {showTransliteration ? 'Hide transliteration' : 'Show transliteration'}
                </button>
                {showTransliteration && (
                  <p
                    data-testid="af-card-transliteration"
                    className="mt-2 text-sm text-indigo-700 dark:text-indigo-300"
                  >
                    {card.transliteration}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </button>

      {isFlipped && (
        <div className="grid grid-cols-2 gap-3">
          <button
            data-testid="af-mark-right"
            type="button"
            aria-label="Mark card right"
            className="min-h-11 rounded-md bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-500"
            onClick={onMarkRight}
          >
            Right
          </button>
          <button
            data-testid="af-mark-wrong"
            type="button"
            aria-label="Mark card wrong"
            className="min-h-11 rounded-md bg-rose-600 px-4 py-3 text-sm font-medium text-white hover:bg-rose-500"
            onClick={onMarkWrong}
          >
            Wrong
          </button>
        </div>
      )}
    </section>
  )
}
