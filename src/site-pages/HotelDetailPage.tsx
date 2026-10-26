import { format, parseISO, startOfDay } from 'date-fns'
import { DayPicker, type DateRange } from 'react-day-picker'
import 'react-day-picker/style.css'
import useEmblaCarousel from 'embla-carousel-react'
import { useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import {
  BedDouble,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  Coffee,
  Heart,
  MapPin,
  Minus,
  Mountain,
  PawPrint,
  Plus,
  Ruler,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Utensils,
  Waves,
  Wifi,
  Trees,
  Car,
  Dumbbell,
  Snowflake,
  Umbrella,
  Bell,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Container } from '@/components/shared/Container'
import { Lightbox } from '@/components/shared/Lightbox'
import { Price } from '@/components/shared/Price'
import { StarRating } from '@/components/shared/StarRating'
import { HotelCard } from '@/components/hotels/HotelCard'
import { hotels, amenities } from '@/data'
import { calculateNights } from '@/lib'
import { bookingStore } from '@/store/bookingStore'
import { searchStore } from '@/store/searchStore'
import { wishlistStore } from '@/store/wishlistStore'
import type { Hotel, Review, Room } from '@/types'

const amenityIconMap: Record<string, LucideIcon> = {
  wifi: Wifi,
  pool: Waves,
  spa: Sparkles,
  restaurant: Utensils,
  breakfast: Coffee,
  'ocean-view': Waves,
  'mountain-view': Mountain,
  garden: Trees,
  parking: Car,
  'air-conditioning': Snowflake,
  fitness: Dumbbell,
  'pet-friendly': PawPrint,
  'beach-access': Umbrella,
  concierge: Bell,
}

const detailTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'location', label: 'Location' },
]

function HotelDetailPage() {
  const { slug = '' } = useParams()
  const hotel = hotels.find((item) => item.slug === slug)
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoadedSlug(slug), 500)
    return () => window.clearTimeout(timeout)
  }, [slug])

  if (loadedSlug !== slug) return <HotelDetailSkeleton />
  if (!hotel) return <HotelNotFound />

  return <HotelDetail hotel={hotel} />
}

function HotelDetail({ hotel }: { hotel: Hotel }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [mobileBookingOpen, setMobileBookingOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [guestOpen, setGuestOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const navigate = useNavigate()
  const saved = wishlistStore((state) => state.savedHotelIds.includes(hotel.id))
  const toggleWishlist = wishlistStore((state) => state.toggle)
  const search = searchStore()
  const selectedRoom = hotel.rooms.find((room) => room.id === selectedRoomId)
  const [mobileGalleryRef] = useEmblaCarousel({ loop: true })
  const dates: DateRange | undefined = {
    from: search.checkIn ? parseISO(search.checkIn) : undefined,
    to: search.checkOut ? parseISO(search.checkOut) : undefined,
  }
  const nights = useMemo(() => {
    if (!search.checkIn || !search.checkOut) return 1
    try {
      return calculateNights(search.checkIn, search.checkOut)
    } catch {
      return 1
    }
  }, [search.checkIn, search.checkOut])

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? 'instant' : 'smooth',
      block: 'start',
    })
  }, [reduceMotion])

  useEffect(() => {
    const sections = detailTabs
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0]
        if (visible) setActiveTab(visible.target.id)
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.4] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const bookSelectedRoom = (room: Room | undefined) => {
    if (!room) {
      toast.message('Choose a room to continue')
      scrollToSection('rooms')
      return
    }
    bookingStore.getState().setDraft({
      hotelId: hotel.id,
      roomId: room.id,
      dates: {
        checkIn: search.checkIn ?? '',
        checkOut: search.checkOut ?? '',
      },
      guests: search.adults + search.children,
    })
    navigate('/booking')
  }

  const toggleSaved = () => {
    toggleWishlist(hotel.id)
    toast.success(saved ? 'Removed from your wishlist' : 'Saved to your wishlist')
  }

  const shareHotel = async () => {
    const shareData = { title: hotel.name, text: hotel.description, url: window.location.href }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        toast.error('Unable to share this stay right now.')
      }
      return
    }
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Unable to copy the link. Please copy it from your browser.')
    }
  }

  return (
    <>
      <Container className="pb-36 pt-7 lg:pb-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link className="hover:text-foreground" to="/">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link className="hover:text-foreground" to="/hotels">Hotels</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">{hotel.name}</li>
          </ol>
        </nav>

        <header className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-border bg-card px-3 py-1 text-[10px] font-medium tracking-wide text-muted-foreground">
                {hotel.type}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {Array.from({ length: hotel.stars }, (_, index) => (
                  <Star key={index} className="size-3 fill-accent text-accent" aria-hidden="true" />
                ))}
                <span className="ml-1">{hotel.stars}-star property</span>
              </span>
            </div>
            <h1 className="font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {hotel.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4 text-accent" aria-hidden="true" />
                {hotel.city}, {hotel.country}
              </span>
              <span className="inline-flex items-center gap-2">
                <StarRating rating={hotel.rating} />
                <span className="text-xs text-muted-foreground">
                  {hotel.reviewCount} reviews
                </span>
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={shareHotel}>
              <Share2 aria-hidden="true" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={toggleSaved} aria-pressed={saved}>
              <Heart className={`size-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} aria-hidden="true" />
              {saved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </header>

        <HotelGallery hotel={hotel} onOpen={setLightboxIndex} mobileRef={mobileGalleryRef} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div className="min-w-0">
            <nav
              aria-label="Hotel details"
              className="sticky top-20 z-20 -mx-5 mb-8 overflow-x-auto border-b border-border bg-background/95 px-5 backdrop-blur sm:mx-0 sm:px-0"
            >
              <div className="flex min-w-max gap-6">
                {detailTabs.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollToSection(id)}
                    aria-current={activeTab === id ? 'location' : undefined}
                    className={`relative min-h-11 py-4 text-sm transition-colors focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      activeTab === id
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {label}
                    {id === 'reviews' && <span className="ml-1 text-xs text-muted-foreground">({hotel.reviews.length})</span>}
                    {activeTab === id && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
                    )}
                  </button>
                ))}
              </div>
            </nav>

            <section id="overview" className="scroll-mt-36 border-b border-border pb-10">
              <OverviewSection hotel={hotel} />
            </section>
            <section id="amenities" className="scroll-mt-36 border-b border-border py-10">
              <AmenitiesSection hotel={hotel} />
            </section>
            <section id="rooms" className="scroll-mt-36 border-b border-border py-10">
              <RoomsSection
                hotel={hotel}
                selectedRoomId={selectedRoomId}
                onSelect={setSelectedRoomId}
                onBook={bookSelectedRoom}
              />
            </section>
            <section id="reviews" className="scroll-mt-36 border-b border-border py-10">
              <ReviewsSection hotel={hotel} />
            </section>
            <section id="location" className="scroll-mt-36 py-10">
              <LocationSection hotel={hotel} />
            </section>
          </div>

          <aside className="hidden lg:block">
            <BookingCard
              hotel={hotel}
              selectedRoom={selectedRoom}
              dates={dates}
              nights={nights}
              dateOpen={dateOpen}
              onDateOpen={setDateOpen}
              guestOpen={guestOpen}
              onGuestOpen={setGuestOpen}
              onBook={() => bookSelectedRoom(selectedRoom)}
            />
          </aside>
        </div>

        <section className="border-t border-border pt-12">
          <h2 className="font-heading text-3xl sm:text-4xl">Similar stays</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A few other places you might love in {hotel.city} and beyond.
          </p>
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {hotels
              .filter((candidate) => candidate.id !== hotel.id)
              .sort(
                (first, second) =>
                  Number(second.city === hotel.city || second.type === hotel.type) -
                  Number(first.city === hotel.city || first.type === hotel.type),
              )
              .slice(0, 4)
              .map((similar) => <HotelCard key={similar.id} hotel={similar} />)}
          </div>
        </section>
      </Container>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:hidden">
        <Sheet open={mobileBookingOpen} onOpenChange={setMobileBookingOpen}>
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-2">
            <div>
              <Price amount={selectedRoom?.pricePerNight ?? hotel.pricePerNight} />
              <p className="mt-0.5 text-[10px] text-muted-foreground">per night · before taxes</p>
            </div>
            <SheetTrigger asChild>
              <Button size="lg" className="min-h-11 rounded-full px-7">
                Book Now
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="bottom" className="max-h-[88dvh] overflow-y-auto rounded-t-2xl px-5 pb-8">
            <SheetHeader className="px-0">
              <SheetTitle className="font-heading text-2xl">Your stay</SheetTitle>
            </SheetHeader>
            <BookingSelection
              selectedRoom={selectedRoom}
              dates={dates}
              nights={nights}
              onBook={() => {
                setMobileBookingOpen(false)
                bookSelectedRoom(selectedRoom)
              }}
            />
          </SheetContent>
        </Sheet>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={hotel.images}
          activeIndex={lightboxIndex}
          onChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
          alt={hotel.name}
        />
      )}
    </>
  )
}

function HotelGallery({
  hotel,
  onOpen,
  mobileRef,
}: {
  hotel: Hotel
  onOpen: (index: number) => void
  mobileRef: (node: HTMLDivElement | null) => void
}) {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl md:hidden" ref={mobileRef}>
        <div className="flex touch-pan-y">
          {hotel.images.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() => onOpen(index)}
              aria-label={`Open photo ${index + 1} of ${hotel.name}`}
              className="relative aspect-[4/3] min-w-0 flex-[0_0_100%] bg-muted"
            >
              <Image
                src={image}
                alt={`${hotel.name}, photo ${index + 1}`}
                width={1200}
                height={900}
                priority={index === 0}
                sizes="(min-width: 768px) 75vw, 100vw"
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="hidden h-[440px] grid-cols-4 grid-rows-2 gap-3 overflow-hidden rounded-2xl md:grid lg:h-[520px]">
        {hotel.images.slice(0, 5).map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            onClick={() => onOpen(index)}
            aria-label={`Open photo ${index + 1} of ${hotel.name}`}
            className={`group relative overflow-hidden bg-muted ${
              index === 0 ? 'col-span-2 row-span-2' : ''
            } ${index === 0 ? '' : 'aspect-auto'}`}
          >
            <Image
              src={image}
              alt={`${hotel.name}, photo ${index + 1}`}
              width={1200}
              height={900}
              priority={index === 0}
              sizes="(min-width: 768px) 25vw, 100vw"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/55 px-3 py-1.5 text-xs text-white backdrop-blur md:hidden">
        Swipe to explore
      </span>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => onOpen(0)}
        className="absolute right-3 bottom-3 border-white/40 bg-white/90 text-foreground backdrop-blur hover:bg-white md:right-5 md:bottom-5"
      >
        View all {hotel.images.length} photos
      </Button>
    </div>
  )
}

function OverviewSection({ hotel }: { hotel: Hotel }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <h2 className="font-heading text-3xl">A stay to settle into</h2>
      <p className={`mt-4 text-sm leading-7 text-muted-foreground ${expanded ? '' : 'line-clamp-3'}`}>
        {hotel.description} Each room is prepared with care, and the team is always close by
        when you need a thoughtful recommendation or a little extra time to unwind.
      </p>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="mt-2 text-sm font-medium text-foreground underline decoration-accent underline-offset-4"
      >
        {expanded ? 'Read less' : 'Read more'}
      </button>
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Highlight icon={Star} value={`${hotel.rating}/5`} label="Guest rating" />
        <Highlight icon={BedDouble} value={`${hotel.rooms.length}`} label="Room styles" />
        <Highlight icon={ShieldCheck} value="Flexible" label="Booking options" />
        <Highlight icon={MapPin} value={hotel.type} label="Stay type" />
      </div>
    </>
  )
}

function Highlight({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon
  value: string
  label: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Icon className="size-4 text-accent" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium">{value}</p>
      <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}

function AmenitiesSection({ hotel }: { hotel: Hotel }) {
  return (
    <>
      <h2 className="font-heading text-3xl">Thoughtful comforts</h2>
      <p className="mt-2 text-sm text-muted-foreground">A few details to make your stay feel effortless.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {hotel.amenities.map((amenityId) => {
          const amenity = amenities.find((item) => item.id === amenityId)
          const Icon = amenityIconMap[amenityId] ?? CircleCheck
          if (!amenity) return null
          return (
            <Tooltip key={amenityId}>
              <TooltipTrigger asChild>
                <div
                  tabIndex={0}
                  aria-label={amenity.label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-foreground dark:text-accent">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs leading-5">{amenity.label}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>{amenity.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </>
  )
}

function RoomsSection({
  hotel,
  selectedRoomId,
  onSelect,
  onBook,
}: {
  hotel: Hotel
  selectedRoomId: string | null
  onSelect: (id: string) => void
  onBook: (room: Room) => void
}) {
  return (
    <>
      <h2 className="font-heading text-3xl">Choose your room</h2>
      <p className="mt-2 text-sm text-muted-foreground">Each room has its own quiet character.</p>
      <div className="mt-6 space-y-4">
        {hotel.rooms.map((room) => {
          const selected = selectedRoomId === room.id
          return (
            <article
              key={room.id}
              className={`overflow-hidden rounded-2xl border bg-card transition-colors ${
                selected ? 'border-accent ring-1 ring-accent' : 'border-border'
              }`}
            >
              <div className="grid sm:grid-cols-[190px_minmax(0,1fr)]">
                <Image
                  src={room.image}
                  alt={room.name}
                  width={760}
                  height={540}
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="h-48 w-full object-cover sm:h-full"
                />
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-heading text-2xl">{room.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Users className="size-3.5" /> Up to {room.capacity} guests</span>
                        <span className="inline-flex items-center gap-1"><BedDouble className="size-3.5" /> {room.beds}</span>
                        <span className="inline-flex items-center gap-1"><Ruler className="size-3.5" /> {room.size} m²</span>
                      </div>
                    </div>
                    {selected && <Check className="mt-1 size-5 shrink-0 text-accent" aria-label="Selected room" />}
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                    {room.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check className="size-3.5 text-accent" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-4">
                    <Price amount={room.pricePerNight} />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={selected ? 'gold' : 'secondary'}
                        size="sm"
                        onClick={() => {
                          onSelect(room.id)
                          onBook(room)
                        }}
                        aria-pressed={selected}
                      >
                        {selected ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}

function ReviewsSection({ hotel }: { hotel: Hotel }) {
  const [ratingFilter, setRatingFilter] = useState<'all' | 'five' | 'four' | 'low'>('all')
  const [sortOrder, setSortOrder] = useState<'recent' | 'highest' | 'lowest'>('recent')
  const reviews = hotel.reviews
    .filter((review) => {
      if (ratingFilter === 'five') return review.rating >= 5
      if (ratingFilter === 'four') return review.rating >= 4 && review.rating < 5
      if (ratingFilter === 'low') return review.rating < 4
      return true
    })
    .sort((first, second) => {
      if (sortOrder === 'highest') return second.rating - first.rating
      if (sortOrder === 'lowest') return first.rating - second.rating
      return second.date.localeCompare(first.date)
    })
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: hotel.reviews.filter((review) => Math.floor(review.rating) === rating).length,
  }))
  const filters = [
    { label: 'All', value: 'all' },
    { label: '5 stars', value: 'five' },
    { label: '4 stars', value: 'four' },
    { label: '3 and below', value: 'low' },
  ] as const

  return (
    <>
      <h2 className="font-heading text-3xl">Guest reviews</h2>
      <div className="mt-5 grid gap-6 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[180px_1fr] sm:p-6">
        <div className="flex flex-col justify-center">
          <p className="font-heading text-5xl">{hotel.rating.toFixed(1)}</p>
          <StarRating rating={hotel.rating} className="mt-2" />
          <p className="mt-2 text-xs text-muted-foreground">{hotel.reviewCount} guest reviews</p>
        </div>
        <div className="space-y-2">
          {distribution.map(({ rating, count }) => (
            <div key={rating} className="flex items-center gap-3 text-xs">
              <span className="w-12 shrink-0 text-muted-foreground">{rating} star{rating === 1 ? '' : 's'}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${hotel.reviews.length ? (count / hotel.reviews.length) * 100 : 0}%` }}
                />
              </div>
              <span className="w-4 text-right text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRatingFilter(value)}
              aria-pressed={ratingFilter === value}
              className={`rounded-full border px-3 py-1.5 text-xs ${
                ratingFilter === value
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Sort
          <select
            aria-label="Sort reviews"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as typeof sortOrder)}
            className="h-8 rounded-lg border border-border bg-card px-2 text-foreground"
          >
            <option value="recent">Most recent</option>
            <option value="highest">Highest rated</option>
            <option value="lowest">Lowest rated</option>
          </select>
        </label>
      </div>
      <div className="mt-5 divide-y divide-border">
        {reviews.length ? reviews.map((review) => <ReviewCard key={review.id} review={review} />) : (
          <p className="py-8 text-sm text-muted-foreground">No reviews in this rating range.</p>
        )}
      </div>
    </>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="py-5 first:pt-0">
      <div className="flex items-start gap-3">
        <img src={review.avatar} alt={`${review.author} profile`} loading="lazy" width={80} height={80} className="size-10 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium">{review.author}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{review.country}</p>
            </div>
            <time dateTime={review.date} className="text-xs text-muted-foreground">
              {format(parseISO(review.date), 'MMM d, yyyy')}
            </time>
          </div>
          <StarRating rating={review.rating} className="mt-2" />
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>
        </div>
      </div>
    </article>
  )
}

function LocationSection({ hotel }: { hotel: Hotel }) {
  const nearby = [
    { place: `Historic centre of ${hotel.city}`, distance: '0.8 km' },
    { place: 'Local dining and cafés', distance: '0.4 km' },
    { place: 'Scenic walking route', distance: '1.2 km' },
  ]
  return (
    <>
      <h2 className="font-heading text-3xl">A lovely place to begin</h2>
      <p className="mt-2 text-sm text-muted-foreground">{hotel.city}, {hotel.country}</p>
      <div className="relative mt-5 flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-border bg-[radial-gradient(ellipse_at_50%_45%,rgba(198,168,124,0.2),transparent_60%),linear-gradient(135deg,var(--muted),var(--background))]">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg">
            <MapPin className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-3 rounded-full bg-card/90 px-3 py-1 text-xs shadow">{hotel.name}</p>
          <p className="mt-2 text-[10px] text-muted-foreground">
            {hotel.coordinates.latitude.toFixed(4)}°, {hotel.coordinates.longitude.toFixed(4)}°
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-semibold">Around the neighborhood</h3>
        <ul className="mt-3 divide-y divide-border">
          {nearby.map(({ place, distance }) => (
            <li key={place} className="flex items-center justify-between py-3 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 text-accent" aria-hidden="true" />
                {place}
              </span>
              <span className="text-xs text-muted-foreground">{distance}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

function BookingCard({
  hotel,
  selectedRoom,
  dates,
  nights,
  dateOpen,
  onDateOpen,
  guestOpen,
  onGuestOpen,
  onBook,
}: {
  hotel: Hotel
  selectedRoom?: Room
  dates?: DateRange
  nights: number
  dateOpen: boolean
  onDateOpen: (open: boolean) => void
  guestOpen: boolean
  onGuestOpen: (open: boolean) => void
  onBook: () => void
}) {
  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/[0.03]">
      <p className="text-xs text-muted-foreground">From</p>
      <Price amount={selectedRoom?.pricePerNight ?? hotel.pricePerNight} className="mt-1 text-lg" />
      <p className="mt-1 text-xs text-muted-foreground">per night, before taxes and fees</p>
      <BookingSelection
        selectedRoom={selectedRoom}
        dates={dates}
        nights={nights}
        dateOpen={dateOpen}
        onDateOpen={onDateOpen}
        guestOpen={guestOpen}
        onGuestOpen={onGuestOpen}
        onBook={onBook}
      />
    </div>
  )
}

function BookingSelection({
  selectedRoom,
  dates,
  nights,
  dateOpen,
  onDateOpen,
  guestOpen,
  onGuestOpen,
  onBook,
}: {
  selectedRoom?: Room
  dates?: DateRange
  nights: number
  dateOpen?: boolean
  onDateOpen?: (open: boolean) => void
  guestOpen?: boolean
  onGuestOpen?: (open: boolean) => void
  onBook: () => void
}) {
  const search = searchStore()
  const setSearch = searchStore((state) => state.setSearch)
  const [today] = useState(() => new Date())
  const start = dates?.from ? format(dates.from, 'MMM d, yyyy') : 'Add dates'
  const end = dates?.to ? format(dates.to, 'MMM d, yyyy') : 'Add dates'

  const adjust = (field: 'adults' | 'children' | 'rooms', delta: number) => {
    const minimum = field === 'children' ? 0 : 1
    const value = Math.max(minimum, search[field] + delta)
    const next = { ...search, [field]: value }
    setSearch({ ...next, guests: next.adults + next.children })
  }

  return (
    <div className="mt-5 space-y-3">
      <Popover open={dateOpen} onOpenChange={onDateOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left hover:bg-muted/60"
          >
            <CalendarDays className="size-4 text-accent" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Dates</span>
              <span className="block truncate text-xs">{start} — {end}</span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-auto max-w-[calc(100vw-2rem)] p-3">
          <p className="mb-2 text-xs text-muted-foreground">
            {dates?.from && dates.to ? `${nights} ${nights === 1 ? 'night' : 'nights'}` : 'Select your dates'}
          </p>
          <DayPicker
            mode="range"
            selected={dates}
            disabled={{ before: startOfDay(today) }}
            numberOfMonths={1}
            onSelect={(range) => {
              setSearch({
                checkIn: range?.from ? format(range.from, 'yyyy-MM-dd') : null,
                checkOut: range?.to ? format(range.to, 'yyyy-MM-dd') : null,
              })
              if (range?.from && range.to) onDateOpen?.(false)
            }}
            classNames={{
              month_caption: 'mb-2 flex h-8 items-center justify-center font-medium',
              nav: 'absolute inset-x-2 top-1 flex justify-between',
              button_previous: 'inline-flex size-8 items-center justify-center rounded-md hover:bg-muted',
              button_next: 'inline-flex size-8 items-center justify-center rounded-md hover:bg-muted',
              weekday: 'p-1 text-center text-xs text-muted-foreground',
              day: 'size-9 p-0 text-center text-sm',
              day_button: 'size-9 rounded-full hover:bg-muted',
              selected: 'bg-foreground text-background',
              range_middle: 'bg-accent/20 text-foreground',
              disabled: 'cursor-not-allowed text-muted-foreground/40',
              outside: 'text-muted-foreground/50',
            }}
          />
        </PopoverContent>
      </Popover>

      <Popover open={guestOpen} onOpenChange={onGuestOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left hover:bg-muted/60"
          >
            <Users className="size-4 text-accent" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Guests</span>
              <span className="block text-xs">{search.adults + search.children} guests · {search.rooms} {search.rooms === 1 ? 'room' : 'rooms'}</span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-4">
          <GuestControls search={search} adjust={adjust} />
        </PopoverContent>
      </Popover>

      {selectedRoom && (
        <div className="flex items-center justify-between rounded-xl bg-muted/70 px-3 py-2 text-xs">
          <span className="truncate text-muted-foreground">{selectedRoom.name}</span>
          <span className="font-medium">${selectedRoom.pricePerNight} / night</span>
        </div>
      )}
      <Button type="button" size="lg" className="w-full" onClick={onBook}>
        Book Now
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 text-accent" aria-hidden="true" />
        Free cancellation · No payment today
      </p>
      {selectedRoom && (
        <p className="border-t border-border pt-3 text-center text-xs text-muted-foreground">
          {nights} {nights === 1 ? 'night' : 'nights'} · estimated from ${selectedRoom.pricePerNight * nights}
        </p>
      )}
    </div>
  )
}

function GuestControls({
  search,
  adjust,
}: {
  search: ReturnType<typeof searchStore.getState>
  adjust: (field: 'adults' | 'children' | 'rooms', delta: number) => void
}) {
  return (
    <div className="space-y-4">
      <GuestRow label="Adults" helper="Ages 13 or above" value={search.adults} min={1} onChange={(delta) => adjust('adults', delta)} />
      <GuestRow label="Children" helper="Ages 0–12" value={search.children} min={0} onChange={(delta) => adjust('children', delta)} />
      <GuestRow label="Rooms" value={search.rooms} min={1} onChange={(delta) => adjust('rooms', delta)} />
    </div>
  )
}

function GuestRow({
  label,
  helper,
  value,
  min,
  onChange,
}: {
  label: string
  helper?: string
  value: number
  min: number
  onChange: (delta: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" variant="secondary" size="icon" className="rounded-full" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(-1)}>
          <Minus className="size-3.5" />
        </Button>
        <span className="w-4 text-center text-sm tabular-nums">{value}</span>
        <Button type="button" variant="secondary" size="icon" className="rounded-full" aria-label={`Increase ${label}`} onClick={() => onChange(1)}>
          <Plus className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

function HotelNotFound() {
  return (
    <Container className="flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent-foreground dark:text-accent">
        <MapPin className="size-7" aria-hidden="true" />
      </span>
      <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-accent uppercase">Stay not found</p>
      <h1 className="mt-3 font-heading text-5xl">This place slipped away</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        We couldn’t find that stay. Explore our collection and find another place to call your own.
      </p>
      <Button asChild className="mt-7"><Link to="/hotels">Explore stays</Link></Button>
    </Container>
  )
}

function HotelDetailSkeleton() {
  return (
    <Container className="animate-pulse py-8">
      <div className="h-3 w-48 rounded bg-muted" />
      <div className="mt-8 h-10 w-2/3 rounded bg-muted" />
      <div className="mt-3 h-4 w-1/3 rounded bg-muted" />
      <div className="mt-7 h-[420px] rounded-2xl bg-muted" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="h-10 rounded bg-muted" />
          <div className="h-32 rounded-2xl bg-muted" />
          <div className="h-48 rounded-2xl bg-muted" />
        </div>
        <div className="hidden h-80 rounded-2xl bg-muted lg:block" />
      </div>
    </Container>
  )
}

export { HotelDetailPage }
