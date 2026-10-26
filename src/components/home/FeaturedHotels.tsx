import { Container } from '@/components/shared/Container'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { HotelCard } from '@/components/hotels/HotelCard'
import { hotels } from '@/data'

function FeaturedHotels() {
  const featuredHotels = hotels.filter((hotel) => hotel.featured).slice(0, 8)

  return (
    <section className="py-24 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            title="Handpicked stays"
            subtitle="Distinctive places, chosen for the moments they make possible."
            viewAllHref="/hotels"
          />
        </Reveal>
        <Reveal className="mt-10">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export { FeaturedHotels }
