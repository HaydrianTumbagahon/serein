import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface LightboxProps {
  images: string[]
  activeIndex: number
  onChange: (index: number) => void
  onClose: () => void
  alt: string
}

function Lightbox({ images, activeIndex, onChange, onClose, alt }: LightboxProps) {
  const count = images.length
  const dialogRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const previous = useCallback(
    () => onChange((activeIndex - 1 + count) % count),
    [activeIndex, count, onChange],
  )
  const next = useCallback(
    () => onChange((activeIndex + 1) % count),
    [activeIndex, count, onChange],
  )
  const actionsRef = useRef({ next, onClose, previous })

  useEffect(() => {
    actionsRef.current = { next, onClose, previous }
  }, [next, onClose, previous])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') actionsRef.current.onClose()
      if (event.key === 'ArrowLeft') actionsRef.current.previous()
      if (event.key === 'ArrowRight') actionsRef.current.next()
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          ),
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Hotel photo gallery"
        aria-describedby="lightbox-counter"
        tabIndex={-1}
        ref={dialogRef}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white"
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-8">
          <p id="lightbox-counter" aria-live="polite" className="text-sm text-white/75">
            {activeIndex + 1} <span className="text-white/40">/</span> {count}
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close gallery"
            className="rounded-full text-white hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-4 sm:px-16">
          <Button
            variant="ghost"
            size="icon"
            onClick={previous}
            aria-label="Previous image"
            className="absolute left-2 z-10 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white sm:left-6"
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <motion.img
            key={images[activeIndex]}
            src={images[activeIndex]}
            alt={`${alt}, photo ${activeIndex + 1}`}
            width={1600}
            height={1200}
            initial={reduceMotion ? false : { opacity: 0.6, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="max-h-full max-w-full rounded-sm object-contain"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 z-10 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white sm:right-6"
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>

        <div className="flex shrink-0 justify-center gap-2 overflow-x-auto px-4 py-4">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => onChange(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={activeIndex === index}
              className={`size-14 shrink-0 overflow-hidden rounded-md border-2 transition-opacity sm:size-16 ${
                activeIndex === index
                  ? 'border-accent opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-90'
              }`}
            >
              <img src={image} alt="" loading="lazy" width={128} height={128} className="size-full object-cover" />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export { Lightbox }
