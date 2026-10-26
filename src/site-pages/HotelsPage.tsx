import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BedDouble, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Container } from '@/components/shared/Container'
import { SearchBar } from '@/components/shared/SearchBar'
import { FiltersPanel } from '@/components/hotels/FiltersPanel'
import {
  amenityOptions,
  propertyTypes,
  ratingOptions,
  starOptions,
} from '@/components/hotels/filterOptions'
import { HotelCard } from '@/components/hotels/HotelCard'
import { HotelCardSkeleton } from '@/components/hotels/HotelCardSkeleton'
import { searchHotels } from '@/lib'
import type { HotelSearchFilters, HotelSort, HotelType } from '@/types'

const sorts: Array<{ value: HotelSort | 'recommended'; label: string }> = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Rating' },
  { value: 'popularity', label: 'Popularity' },
]

function readFilters(params: URLSearchParams): HotelSearchFilters {
  const minParam = params.get('priceMin')
  const maxParam = params.get('priceMax')
  const min = minParam === null ? undefined : Number(minParam)
  const max = maxParam === null ? undefined : Number(maxParam)
  const stars = (params.get('stars') ?? '')
    .split(',')
    .map(Number)
    .filter((value) => [3, 4, 5].includes(value))
  const types = (params.get('types') ?? '')
    .split(',')
    .filter((value): value is HotelType => propertyTypes.includes(value as HotelType))
  const amenities = (params.get('amenities') ?? '')
    .split(',')
    .filter((value) => amenityOptions.some((option) => option.id === value))
  const ratingParam = Number(params.get('rating'))
  const rating = [7, 8, 9].includes(ratingParam) ? ratingParam / 2 : undefined
  const sortValue = params.get('sort') as HotelSort | null
  const adults = Number(params.get('adults'))
  const children = Number(params.get('children'))
  const guests =
    (Number.isInteger(adults) && adults > 0 ? adults : 0) +
    (Number.isInteger(children) && children >= 0 ? children : 0)
  const minPrice =
    Number.isFinite(min) && min !== undefined ? Math.min(Math.max(min, 120), 1200) : 120
  const maxPrice =
    Number.isFinite(max) && max !== undefined ? Math.min(Math.max(max, minPrice), 1200) : 1200
  const priceRange = minParam !== null || maxParam !== null
    ? { min: minPrice, max: maxPrice }
    : undefined

  return {
    destination: params.get('destination') ?? undefined,
    priceRange,
    stars: stars.length ? stars : undefined,
    propertyTypes: types.length ? types : undefined,
    amenities: amenities.length ? amenities : undefined,
    minRating: rating,
    guests: guests || undefined,
    sortBy: sorts.some((sort) => sort.value === sortValue) ? sortValue ?? undefined : undefined,
  }
}

function writeFilters(params: URLSearchParams, filters: HotelSearchFilters): URLSearchParams {
  const next = new URLSearchParams(params)
  const defaultPrice = filters.priceRange?.min === 120 && filters.priceRange.max === 1200

  if (filters.priceRange && !defaultPrice) {
    next.set('priceMin', String(filters.priceRange.min))
    next.set('priceMax', String(filters.priceRange.max))
  } else {
    next.delete('priceMin')
    next.delete('priceMax')
  }
  if (filters.stars?.length) next.set('stars', filters.stars.join(','))
  else next.delete('stars')
  if (filters.propertyTypes?.length) next.set('types', filters.propertyTypes.join(','))
  else next.delete('types')
  if (filters.amenities?.length) next.set('amenities', filters.amenities.join(','))
  else next.delete('amenities')
  if (filters.minRating) next.set('rating', String(filters.minRating * 2))
  else next.delete('rating')
  if (filters.sortBy) next.set('sort', filters.sortBy)
  else next.delete('sort')

  return next
}

function HotelsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const reduceMotion = useReducedMotion()
  const paramsKey = searchParams.toString()
  const filters = useMemo(() => readFilters(searchParams), [searchParams])
  const [mobileFilters, setMobileFilters] = useState<HotelSearchFilters>(filters)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loadedQueryKey, setLoadedQueryKey] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState({ queryKey: paramsKey, count: 9 })
  const loading = loadedQueryKey !== paramsKey
  const currentVisibleCount = visibleCount.queryKey === paramsKey ? visibleCount.count : 9

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoadedQueryKey(paramsKey), 600)
    return () => window.clearTimeout(timeout)
  }, [paramsKey])

  const filteredHotels = useMemo(() => {
    const result = searchHotels(filters)
    if (filters.sortBy) return result
    return result.sort(
      (first, second) =>
        Number(second.featured) - Number(first.featured) || second.rating - first.rating,
    )
  }, [filters])

  const updateFilters = (nextFilters: HotelSearchFilters) => {
    setSearchParams(writeFilters(searchParams, nextFilters), { replace: true })
  }

  const clearFilters = () => {
    updateFilters({ destination: filters.destination })
  }

  const clearOne = (key: 'price' | 'stars' | 'type' | 'amenity' | 'rating', value?: string) => {
    const next = { ...filters }
    if (key === 'price') next.priceRange = undefined
    if (key === 'stars') next.stars = undefined
    if (key === 'type') {
      next.propertyTypes = (next.propertyTypes ?? []).filter((type) => type !== value)
      if (!next.propertyTypes.length) next.propertyTypes = undefined
    }
    if (key === 'amenity') {
      next.amenities = (next.amenities ?? []).filter((amenity) => amenity !== value)
      if (!next.amenities.length) next.amenities = undefined
    }
    if (key === 'rating') next.minRating = undefined
    updateFilters(next)
  }

  const destination = filters.destination?.trim()
  const activeChips = [
    ...(filters.priceRange &&
    (filters.priceRange.min !== 120 || filters.priceRange.max !== 1200)
      ? [
          {
            id: 'price',
            label: `$${filters.priceRange.min}–$${filters.priceRange.max}`,
            remove: () => clearOne('price'),
          },
        ]
      : []),
    ...(filters.stars?.length
      ? [
          {
            id: 'stars',
            label: `${starOptions.find((option) => option.values.join() === filters.stars?.join())?.label ?? 'Star rating'}`,
            remove: () => clearOne('stars'),
          },
        ]
      : []),
    ...(filters.propertyTypes ?? []).map((type) => ({
      id: `type-${type}`,
      label: type,
      remove: () => clearOne('type', type),
    })),
    ...(filters.amenities ?? []).map((amenity) => ({
      id: `amenity-${amenity}`,
      label: amenityOptions.find((option) => option.id === amenity)?.label ?? amenity,
      remove: () => clearOne('amenity', amenity),
    })),
    ...(filters.minRating
      ? [
          {
            id: 'rating',
            label: `${ratingOptions.find((option) => option.value === filters.minRating)?.label ?? `${filters.minRating * 2}+`} guest rating`,
            remove: () => clearOne('rating'),
          },
        ]
      : []),
  ]

  return (
    <Container className="py-10 sm:py-14">
      <div className="relative z-30 mb-8">
        <h1 className="font-heading text-4xl sm:text-5xl">Stays to remember</h1>
        <SearchBar variant="compact" className="mt-6" />
      </div>

      <div className="flex items-start gap-8">
        <aside className="sticky top-24 z-10 hidden max-h-[calc(100vh-7rem)] w-[280px] shrink-0 overflow-y-auto rounded-2xl border border-border bg-card p-5 lg:block">
          <FiltersPanel
            filters={filters}
            onChange={updateFilters}
            onClear={clearFilters}
          />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl">
                {filteredHotels.length} {filteredHotels.length === 1 ? 'stay' : 'stays'}
                {destination ? ` in ${destination}` : ''}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Showing {loading ? 0 : Math.min(currentVisibleCount, filteredHotels.length)} of {filteredHotels.length}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Sheet
                open={mobileOpen}
                onOpenChange={(open) => {
                  setMobileOpen(open)
                  if (open) setMobileFilters(filters)
                }}
              >
                <SheetTrigger asChild>
                  <Button type="button" variant="secondary" size="sm" className="lg:hidden">
                    <SlidersHorizontal aria-hidden="true" />
                    Filters
                    {activeChips.length > 0 && (
                      <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] text-background">
                        {activeChips.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[88dvh] max-h-[88dvh] overflow-hidden rounded-t-2xl px-5 pb-6">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Hotel filters</SheetTitle>
                  </SheetHeader>
                  <FiltersPanel
                    filters={mobileFilters}
                    onChange={setMobileFilters}
                    onClear={() => setMobileFilters({ destination: filters.destination })}
                    onApply={() => {
                      updateFilters(mobileFilters)
                      setMobileOpen(false)
                    }}
                  />
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="hidden sm:inline">Sort by</span>
                <Select
                  value={filters.sortBy ?? 'recommended'}
                  onValueChange={(value) => {
                    const sortValue = value as HotelSort | 'recommended'
                    const next = { ...filters, sortBy: sortValue === 'recommended' ? undefined : sortValue }
                    updateFilters(next)
                  }}
                >
                  <SelectTrigger aria-label="Sort stays" className="h-11 w-[190px] bg-card text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {sorts.map(({ value, label }) => (
                      <SelectItem key={value} value={value} className="min-h-11">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={chip.remove}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {chip.label}
                  <X className="size-3 text-muted-foreground" aria-hidden="true" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="min-h-11 px-2 py-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Clear all
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {Array.from({ length: 6 }, (_, index) => (
                <HotelCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent-foreground dark:text-accent">
                <BedDouble className="size-7" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-3xl">No stays found</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Try adjusting your filters or widening your price range to discover more places.
              </p>
              <Button variant="secondary" className="mt-6" onClick={clearFilters}>
                <Sparkles aria-hidden="true" />
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {filteredHotels.slice(0, currentVisibleCount).map((hotel, index) => (
                    <motion.div
                      key={hotel.id}
                      layout
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: reduceMotion ? 0 : 0.22 }}
                    >
                      <HotelCard hotel={hotel} priority={index === 0} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              {currentVisibleCount < filteredHotels.length && (
                <div className="mt-9 flex flex-col items-center gap-3">
                  <p className="text-xs text-muted-foreground">
                    Showing {currentVisibleCount} of {filteredHotels.length}
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setVisibleCount({
                        queryKey: paramsKey,
                        count: currentVisibleCount + 9,
                      })
                    }
                  >
                    Load more stays
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  )
}

export { HotelsPage }
