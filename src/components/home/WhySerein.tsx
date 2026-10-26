import { Container } from '@/components/shared/Container'
import Image from 'next/image'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'

const features = [
  {
    title: 'Curated luxury stays',
    description:
      'Every property is chosen for its character, thoughtful hospitality, and sense of place.',
    className: 'md:col-span-2 md:row-span-2',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=82',
  },
  {
    title: 'Seamless booking',
    description: 'A clear, considered booking journey from first search to welcome.',
    className: '',
  },
  {
    title: 'Exclusive member rates',
    description: 'A little more value for the places you already want to return to.',
    className: '',
  },
  {
    title: 'Personalized recommendations',
    description: 'Stay ideas shaped around the way you like to travel.',
    className: 'md:col-span-2',
  },
]

function WhySerein() {
  return (
    <section className="bg-secondary/55 py-24 dark:bg-secondary/35 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            title="Travel, with more feeling"
            subtitle="We make the search for somewhere special feel just as considered as the stay itself."
          />
        </Reveal>

        <Reveal className="mt-10">
          <div className="grid auto-rows-[minmax(220px,auto)] gap-4 md:grid-cols-4">
            {features.map(({ title, description, className, image }) => (
              <article
                key={title}
                className={`relative isolate flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl border border-border/70 bg-card p-6 sm:p-8 ${className}`}
              >
                {image && (
                  <>
                    <Image
                      src={image}
                      alt=""
                      width={1200}
                      height={900}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="absolute inset-0 -z-20 size-full object-cover"
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />
                  </>
                )}
                <div className={image ? 'text-white' : ''}>
                  <h3 className="font-heading text-2xl font-medium sm:text-3xl">{title}</h3>
                  <p className={`mt-2 max-w-md text-sm leading-6 ${image ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export { WhySerein }
