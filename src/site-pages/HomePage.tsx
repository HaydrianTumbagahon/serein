import { CTABanner } from '@/components/home/CTABanner'
import { FeaturedDestinations } from '@/components/home/FeaturedDestinations'
import { FeaturedHotels } from '@/components/home/FeaturedHotels'
import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Testimonials } from '@/components/home/Testimonials'
import { WhySerein } from '@/components/home/WhySerein'

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedDestinations />
      <WhySerein />
      <FeaturedHotels />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </>
  )
}

export { HomePage }
