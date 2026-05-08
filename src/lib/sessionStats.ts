import type { SessionStats } from '../types'

const SESSION_STATS_KEY = 'marathi_flash_session_stats'

export const loadSessionStats = (): SessionStats | undefined => {
  const raw = window.sessionStorage.getItem(SESSION_STATS_KEY)
  if (!raw) {
    return undefined
  }

  try {
    return JSON.parse(raw) as SessionStats
  } catch {
    return undefined
  }
}

export const saveSessionStats = (stats: SessionStats) => {
  window.sessionStorage.setItem(SESSION_STATS_KEY, JSON.stringify(stats))
}

export const clearSessionStats = () => {
  window.sessionStorage.removeItem(SESSION_STATS_KEY)
}
