import { useEffect, useState } from 'react'
import {
  applyTheme,
  getSystemTheme,
  themeStore,
  type ResolvedTheme,
} from '@/store/themeStore'

export function useTheme() {
  const theme = themeStore((state) => state.theme)
  const setTheme = themeStore((state) => state.setTheme)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)
  const resolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      const nextTheme = event.matches ? 'dark' : 'light'
      setSystemTheme(nextTheme)
      if (themeStore.getState().theme === 'system') {
        applyTheme('system', nextTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    applyTheme(theme, systemTheme)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [systemTheme, theme])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return { theme, resolvedTheme, setTheme, toggleTheme }
}
