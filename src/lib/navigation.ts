/**
 * True when the current document load was caused by a full page reload (refresh).
 * `sessionStorage` survives reloads by default; we use this to reset ephemeral session stats.
 */
export const isNavigationReload = (): boolean => {
  if (typeof performance === 'undefined') {
    return false
  }

  if (typeof performance.getEntriesByType === 'function') {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (nav?.type === 'reload') {
      return true
    }
  }

  const legacy = performance as Performance & { navigation?: { type?: number } }
  return legacy.navigation?.type === 1
}
