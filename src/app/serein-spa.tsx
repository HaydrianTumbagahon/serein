'use client'

import dynamic from 'next/dynamic'
import { Container } from '@/components/shared/Container'
import { TooltipProvider } from '@/components/ui/tooltip'

const App = dynamic(() => import('@/App'), {
  ssr: false,
  loading: () => (
    <Container className="flex min-h-[55vh] flex-col items-center justify-center gap-3 py-20 text-center" role="status" aria-label="Loading Serein">
      <span className="flex size-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-heading text-3xl text-accent-foreground dark:text-accent">S</span>
      <p className="font-heading text-2xl">Serein</p>
    </Container>
  ),
})

export default function SereinSpa() {
  return (
    <TooltipProvider>
      <App />
    </TooltipProvider>
  )
}
