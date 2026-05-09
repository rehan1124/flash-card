import { isNavigationReload } from './navigation'

describe('isNavigationReload', () => {
  const stubPerformance = (navigationEntries: unknown[]) => {
    Object.defineProperty(globalThis, 'performance', {
      configurable: true,
      value: {
        getEntriesByType: jest.fn().mockReturnValue(navigationEntries),
        navigation: undefined as { type?: number } | undefined,
      },
    })
  }

  afterEach(() => {
    delete (globalThis as { performance?: unknown }).performance
  })

  it('returns true when Navigation Timing reports reload', () => {
    stubPerformance([{ type: 'reload' }])
    expect(isNavigationReload()).toBe(true)
  })

  it('returns false on first navigation', () => {
    stubPerformance([{ type: 'navigate' }])
    expect(isNavigationReload()).toBe(false)
  })

  it('returns false when no navigation entry', () => {
    stubPerformance([])
    expect(isNavigationReload()).toBe(false)
  })

  it('uses legacy performance.navigation when entries empty', () => {
    Object.defineProperty(globalThis, 'performance', {
      configurable: true,
      value: {
        getEntriesByType: jest.fn().mockReturnValue([]),
        navigation: { type: 1 },
      },
    })
    expect(isNavigationReload()).toBe(true)
  })
})
