import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = Exclude<Theme, 'system'>

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme, systemTheme = getSystemTheme()): void {
  document.documentElement.classList.toggle(
    'dark',
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark'),
  )
}

export const themeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
    }),
    {
      name: 'serein-theme',
      partialize: ({ theme }) => ({ theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
        }
      },
    },
  ),
)
