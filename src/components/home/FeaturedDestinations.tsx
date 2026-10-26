import useEmblaCarousel from 'embla-carousel-react'
import { useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/shared/Container'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { destinations } from '@/data'

function FeaturedDestinations() {
  const reduceMotion = useReducedMotion()
  const [carouselRef, carouselApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    duration: reduceMotion ? 1 : 25,
  })

  const cards = destinations.map((destination) => (
    <Link
      key={destination.id}
      to={`/hotels?destination=${encodeURIComponent(destination.city)}`}
      className="group relative block h-[390px] overflow-hidden rounded-2xl bg-muted sm:h-[440px] lg:h-[500px]"
    >
      <Image
        src={destination.image}
        alt={`${destination.city}, ${destination.country}`}
        width={900}
        height={1200}
        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 90vw"
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute right-5 bottom-5 left-5 text-white sm:right-6 sm:bottom-6 sm:left-6">
        <p className="mb-2 flex items-center gap-1.5 text-xs text-white/80">
          <MapPin className="size-3.5" aria-hidden="true" />
          {destination.country}
        </p>
        <h3 className="font-heading text-3xl leading-tight sm:text-4xl">{destination.city}</h3>
        <p className="mt-1 text-xs text-white/80">{destination.propertyCount} properties</p>
      </div>
    </Link>
  ))

  return (
    <section className="py-24 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            title="A world of quiet escapes"
            subtitle="From storied city lanes to secluded shores, find a place that feels like your own."
          />
        </Reveal>

        <Reveal className="mt-10">
          <div className="relative xl:hidden">
            <div className="overflow-hidden" ref={carouselRef}>
              <div className="-ml-4 flex touch-pan-y">
                {cards.map((card, index) => (
                  <div
                    key={destinations[index].id}
                    className="min-w-0 flex-[0_0_84%] pl-4 sm:flex-[0_0_48%]"
                  >
                    {card}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Previous destinations"
                onClick={() => carouselApi?.scrollPrev()}
                className="rounded-full"
              >
                <ArrowLeft aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Next destinations"
                onClick={() => carouselApi?.scrollNext()}
                className="rounded-full"
              >
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="hidden grid-cols-4 auto-rows-[220px] gap-4 xl:grid">
            {cards.map((card, index) => (
              <div
                key={destinations[index].id}
                className={
                  index === 0 || index === 5
                    ? 'row-span-2'
                    : index === 3 || index === 6
                      ? 'col-span-2'
                      : ''
                }
              >
                {card}
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export { FeaturedDestinations }
