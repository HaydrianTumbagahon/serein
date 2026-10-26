import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { useInView } from 'react-intersection-observer'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

function Reveal({ children, className, delay = 0 }: RevealProps) {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px',
  })
  const shouldReduceMotion = useReducedMotion()
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (shouldReduceMotion) {
      gsap.set(element, { clearProps: 'all' })
      return
    }

    gsap.to(element, {
      autoAlpha: inView ? 1 : 0,
      y: inView ? 0 : 20,
      duration: inView ? 0.7 : 0.45,
      delay: inView ? delay : 0,
      ease: inView ? 'power3.out' : 'power2.in',
      overwrite: true,
    })
  }, [delay, inView, shouldReduceMotion])

  return (
    <div
      ref={(node) => {
        elementRef.current = node
        ref(node)
      }}
      className={cn(className)}
      style={shouldReduceMotion ? undefined : { opacity: 0, visibility: 'hidden' }}
    >
      {children}
    </div>
  )
}

export { Reveal }
