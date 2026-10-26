import useEmblaCarousel from 'embla-carousel-react'
import { useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/shared/Container'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { StarRating } from '@/components/shared/StarRating'
import { testimonials } from '@/data'

function Testimonials() {
  const reduceMotion = useReducedMotion()
  const [carouselRef, carouselApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    duration: reduceMotion ? 1 : 25,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!carouselApi) return
    const updateSelected = () => setSelectedIndex(carouselApi.selectedScrollSnap())
    carouselApi.on('select', updateSelected)
    carouselApi.on('reInit', updateSelected)
    updateSelected()
    return () => {
      carouselApi.off('select', updateSelected)
      carouselApi.off('reInit', updateSelected)
    }
  }, [carouselApi])

  return (
    <section className="py-24 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            title="The moments that stay"
            subtitle="A few kind words from travelers who found their place with Serein."
          />
        </Reveal>
        <Reveal className="mt-10">
          <div className="overflow-hidden" ref={carouselRef}>
            <div className="-ml-4 flex touch-pan-y">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_70%] lg:flex-[0_0_50%]"
                >
                  <article className="flex h-full min-h-80 flex-col rounded-2xl border border-border bg-card p-6 sm:p-9">
                    <Quote className="size-7 text-accent/80" aria-hidden="true" />
                    <p className="mt-5 flex-1 font-heading text-2xl leading-snug text-foreground sm:text-3xl">
                      “{testimonial.quote}”
                    </p>
                    <div className="mt-7 flex items-center justify-between gap-4 border-t border-border pt-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt=""
                          loading="lazy"
                          width={88}
                          height={88}
                          className="size-11 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{testimonial.author}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                      <div className="hidden text-right sm:block">
                        <StarRating rating={testimonial.rating} />
                        <p className="mt-1 max-w-36 truncate text-[10px] text-muted-foreground">
                          {testimonial.stay}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 sm:hidden">
                      <StarRating rating={testimonial.rating} />
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              {testimonials.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={selectedIndex === index}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className="relative grid size-11 shrink-0 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className={`h-1.5 rounded-full transition-all ${
                    selectedIndex === index ? 'w-8 bg-accent' : 'w-1.5 bg-border hover:bg-accent/60'
                  }`} />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
                aria-label="Previous testimonial"
                onClick={() => carouselApi?.scrollPrev()}
              >
                <ArrowLeft aria-hidden="true" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
                aria-label="Next testimonial"
                onClick={() => carouselApi?.scrollNext()}
              >
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export { Testimonials }
