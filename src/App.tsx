import { useAppStore } from './store/useAppStore'

function App() {
  const { theme, toggleTheme } = useAppStore()

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-3xl font-semibold tracking-tight">Marathi Flashcards</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Phase 0 scaffold is ready. Tailwind, Zustand, linting, formatting, and
          testing are configured.
        </p>
        <div className="mt-6 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800">
          <span className="text-sm">
            Current theme:
            <strong className="ml-2 capitalize">{theme}</strong>
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Toggle theme
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
