import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/shared/Container'
import { Reveal } from '@/components/shared/Reveal'

function CTABanner() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-[#292923] px-6 py-16 text-center text-white sm:px-12 sm:py-20 lg:py-24">
            <Image
              src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2200&q=82"
              alt=""
              width={2200}
              height={1000}
              sizes="100vw"
              className="absolute inset-0 -z-20 size-full object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/55 to-black/55" />
            <h2 className="mx-auto mt-4 max-w-3xl font-heading text-4xl leading-tight sm:text-6xl">
              Somewhere wonderful is closer than you think.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
              Find a place that makes getting away feel like coming home.
            </p>
            <Button asChild variant="gold" size="lg" className="mt-8 rounded-full">
              <Link to="/hotels">
                Start Exploring
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export { CTABanner }
