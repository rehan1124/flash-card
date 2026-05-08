import { create } from 'zustand'

type Theme = 'light' | 'dark'

type AppStore = {
  theme: Theme
  toggleTheme: () => void
}

const THEME_STORAGE_KEY = 'marathi_flash_theme'

const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return storedTheme === 'dark' ? 'dark' : 'light'
}

const applyThemeClass = (theme: Theme) => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.classList.toggle('dark', theme === 'dark')
}

const initialTheme = getStoredTheme()
applyThemeClass(initialTheme)

export const useAppStore = create<AppStore>((set, get) => ({
  theme: initialTheme,
  toggleTheme: () => {
    const nextTheme: Theme = get().theme === 'light' ? 'dark' : 'light'
    applyThemeClass(nextTheme)
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    set({ theme: nextTheme })
  },
}))
