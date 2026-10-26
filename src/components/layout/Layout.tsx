import Lenis from 'lenis'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { useTheme } from '@/hooks/useTheme'

function Layout() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const [showBackToTop, setShowBackToTop] = useState(false)
  const isHome = location.pathname === '/'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' })
  }, [location.pathname, reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    const lenis = new Lenis({ autoRaf: true })
    return () => lenis.destroy()
  }, [reduceMotion])

  useEffect(() => {
    const updateVisibility = () => setShowBackToTop(window.scrollY > 600)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className={`flex-1 ${isHome ? '' : 'pt-20'}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
      <Footer />
      <Toaster
        position="bottom-right"
        theme={resolvedTheme}
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            borderColor: 'var(--border)',
          },
        }}
      />
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            key="back-to-top"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.82, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.86, y: 6 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
            className="fixed right-5 bottom-5 z-30"
          >
            <Button
              variant="primary"
              size="icon"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' })}
              className="rounded-full shadow-lg"
            >
              <ArrowUp aria-hidden="true" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Layout }
