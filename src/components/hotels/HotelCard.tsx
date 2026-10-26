import {
  AirVent,
  Bell,
  Coffee,
  Dumbbell,
  Heart,
  MapPin,
  PawPrint,
  Sparkles,
  Trees,
  Utensils,
  Waves,
  Wifi,
  Mountain,
  Car,
  Umbrella,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Price } from '@/components/shared/Price'
import { StarRating } from '@/components/shared/StarRating'
import { amenities } from '@/data'
import type { Hotel } from '@/types'
import { wishlistStore } from '@/store/wishlistStore'

const amenityIcons: Record<string, LucideIcon> = {
  wifi: Wifi,
  pool: Waves,
  spa: Sparkles,
  restaurant: Utensils,
  breakfast: Coffee,
  'ocean-view': Waves,
  'mountain-view': Mountain,
  garden: Trees,
  parking: Car,
  'air-conditioning': AirVent,
  fitness: Dumbbell,
  'pet-friendly': PawPrint,
  'beach-access': Umbrella,
  concierge: Bell,
}

function HotelCard({ hotel, priority = false }: { hotel: Hotel; priority?: boolean }) {
  const saved = wishlistStore((state) => state.savedHotelIds.includes(hotel.id))
  const toggle = wishlistStore((state) => state.toggle)
  const hotelAmenities = hotel.amenities
    .slice(0, 3)
    .map((id) => amenities.find((amenity) => amenity.id === id))
    .filter((amenity) => amenity !== undefined)

  const handleWishlist = () => {
    toggle(hotel.id)
    toast.success(saved ? 'Removed from your wishlist' : 'Saved to your wishlist')
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={hotel.images[0]}
          alt={hotel.name}
          width={800}
          height={600}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[10px] font-medium tracking-wide text-white backdrop-blur-md">
          {hotel.type}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={saved ? `Remove ${hotel.name} from wishlist` : `Save ${hotel.name} to wishlist`}
          aria-pressed={saved}
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 size-9 rounded-full border border-white/50 bg-white/85 text-foreground shadow-sm backdrop-blur-md hover:bg-white dark:bg-black/50 dark:text-white dark:hover:bg-black/70"
        >
          <Heart className={`size-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </Button>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="truncate font-heading text-2xl font-medium text-foreground">{hotel.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
          {hotel.city}, {hotel.country}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <StarRating rating={hotel.rating} />
          <span className="text-xs text-muted-foreground">({hotel.reviewCount} reviews)</span>
        </div>
        <div className="mt-3 flex min-h-6 items-center gap-3 text-muted-foreground">
          {hotelAmenities.map((amenity) => {
            const Icon = amenityIcons[amenity.id]
            return Icon ? (
              <Tooltip key={amenity.id}>
                <TooltipTrigger asChild>
                  <span
                    tabIndex={0}
                    aria-label={amenity.label}
                    className="inline-flex size-7 items-center justify-center rounded-full transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>{amenity.label}</TooltipContent>
              </Tooltip>
            ) : null
          })}
        </div>
        <div className="mt-4 flex items-end justify-between gap-2 border-t border-border pt-4">
          <Price amount={hotel.pricePerNight} className="text-sm" />
          <Button asChild variant="secondary" size="sm">
            <Link to={`/hotels/${hotel.slug}`}>View</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

export { HotelCard }
