import { useEffect } from 'react'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { DecksPage } from './pages/DecksPage'
import { StudyPage } from './pages/StudyPage'
import { useAppStore } from './store/useAppStore'

function App() {
  const { theme, toggleTheme, loadDecksFromStorage } = useAppStore()

  useEffect(() => {
    loadDecksFromStorage()
  }, [loadDecksFromStorage])

  return (
    <main
      data-testid="af-app-shell"
      className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100"
    >
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div>
            <h1 data-testid="af-app-title" className="text-3xl font-semibold tracking-tight">
              Marathi Flashcards
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Learn Marathi with decks, study sessions, and session tracking.
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <NavLink
              data-testid="af-nav-decks"
              to="/decks"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`
              }
            >
              Decks
            </NavLink>
            <button
              data-testid="af-theme-toggle"
              type="button"
              onClick={toggleTheme}
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
            >
              Theme: {theme}
            </button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/decks" replace />} />
          <Route path="/decks" element={<DecksPage />} />
          <Route path="/deck/:deckId/study" element={<StudyPage />} />
        </Routes>
      </section>
    </main>
  )
}

export default App
