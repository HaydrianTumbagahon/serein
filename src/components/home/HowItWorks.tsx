import { CalendarCheck, Compass, Sparkles, TentTree } from 'lucide-react'
import { Container } from '@/components/shared/Container'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'

const steps = [
  {
    title: 'Search',
    description: 'Tell us where you feel like going and when.',
    icon: Compass,
  },
  {
    title: 'Compare',
    description: 'Explore thoughtfully chosen stays and their details.',
    icon: Sparkles,
  },
  {
    title: 'Book',
    description: 'Reserve your place with a few clear, easy steps.',
    icon: CalendarCheck,
  },
  {
    title: 'Enjoy',
    description: 'Arrive, settle in, and let the rest unfold.',
    icon: TentTree,
  },
]

function HowItWorks() {
  return (
    <section className="bg-secondary/55 py-24 dark:bg-secondary/35 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            title="The good part starts here"
            subtitle="A simple way to find a stay worth looking forward to."
          />
        </Reveal>
        <Reveal className="mt-12">
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <div className="absolute top-8 right-[12.5%] left-[12.5%] hidden h-px bg-border lg:block" />
            {steps.map(({ title, description, icon: Icon }) => (
              <article key={title} className="relative">
                <div className="relative z-10 flex size-16 items-center justify-center rounded-full border border-border bg-background text-accent-foreground shadow-sm dark:text-accent">
                  <Icon aria-hidden="true" className="size-6" />
                </div>
                <div className="mt-7">
                  <h3 className="font-heading text-3xl">{title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
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

export { HowItWorks }
