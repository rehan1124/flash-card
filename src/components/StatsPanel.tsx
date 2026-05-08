import type { SessionStats } from '../types'

type StatsPanelProps = {
  stats?: SessionStats
}

export const StatsPanel = ({ stats }: StatsPanelProps) => {
  if (!stats) {
    return (
      <div
        data-testid="af-stats-empty"
        className="rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900"
      >
        No active session yet.
      </div>
    )
  }

  const accuracy = stats.studied === 0 ? 0 : Math.round((stats.correct / stats.studied) * 100)

  return (
    <div
      data-testid="af-stats-panel"
      className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
    >
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Session Stats</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <p>
          <span className="block text-slate-500">Studied</span>
          <strong data-testid="af-stats-studied">{stats.studied}</strong>
        </p>
        <p>
          <span className="block text-slate-500">Correct</span>
          <strong data-testid="af-stats-correct">{stats.correct}</strong>
        </p>
        <p>
          <span className="block text-slate-500">Incorrect</span>
          <strong data-testid="af-stats-incorrect">{stats.incorrect}</strong>
        </p>
        <p>
          <span className="block text-slate-500">Accuracy</span>
          <strong data-testid="af-stats-accuracy">{accuracy}%</strong>
        </p>
      </div>
    </div>
  )
}
