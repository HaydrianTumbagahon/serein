import { format, parseISO, startOfDay } from 'date-fns'
import { DayPicker, type DateRange } from 'react-day-picker'
import 'react-day-picker/style.css'
import { CalendarDays, ChevronDown, MapPin, Minus, Plus, Search, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { destinations } from '@/data'
import { cn } from '@/lib/utils'
import { searchStore } from '@/store/searchStore'

interface SearchBarProps {
  variant?: 'hero' | 'compact'
  className?: string
}

function getDate(value: string | null): Date | undefined {
  if (!value) return undefined
  const date = parseISO(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function formatDate(date: Date | undefined): string {
  return date ? format(date, 'MMM d, yyyy') : 'Add date'
}

function SearchBar({ variant = 'hero', className }: SearchBarProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchParamsKey = searchParams.toString()
  const search = searchStore()
  const destinationQuery = searchStore((state) => state.destination)
  const setSearch = searchStore((state) => state.setSearch)
  const compact = variant === 'compact'
  const [destinationOpen, setDestinationOpen] = useState(false)
  const [datesOpen, setDatesOpen] = useState(false)
  const [guestsOpen, setGuestsOpen] = useState(false)
  const [today] = useState(() => new Date())
  const [numberOfMonths, setNumberOfMonths] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 1,
  )
  const range: DateRange | undefined = {
    from: getDate(search.checkIn),
    to: getDate(search.checkOut),
  }

  useEffect(() => {
    if (!compact) return
    const currentSearch = searchStore.getState()
    const adults = Number(searchParams.get('adults'))
    const children = Number(searchParams.get('children'))
    const rooms = Number(searchParams.get('rooms'))
    const nextAdults = Number.isInteger(adults) && adults > 0 ? adults : currentSearch.adults
    const nextChildren =
      Number.isInteger(children) && children >= 0 ? children : currentSearch.children
    const nextRooms = Number.isInteger(rooms) && rooms > 0 ? rooms : currentSearch.rooms
    const nextCheckIn = getDate(searchParams.get('checkIn'))
    const nextCheckOut = getDate(searchParams.get('checkOut'))

    setSearch({
      destination: searchParams.get('destination') ?? currentSearch.destination,
      checkIn: nextCheckIn ? format(nextCheckIn, 'yyyy-MM-dd') : currentSearch.checkIn,
      checkOut: nextCheckOut ? format(nextCheckOut, 'yyyy-MM-dd') : currentSearch.checkOut,
      adults: nextAdults,
      children: nextChildren,
      rooms: nextRooms,
      guests: nextAdults + nextChildren,
    })
  }, [compact, searchParams, searchParamsKey, setSearch])

  useEffect(() => {
    const updateCalendarMonths = () => setNumberOfMonths(window.innerWidth >= 768 ? 2 : 1)
    window.addEventListener('resize', updateCalendarMonths)
    return () => window.removeEventListener('resize', updateCalendarMonths)
  }, [])

  useEffect(() => {
    if (!destinationOpen && !datesOpen && !guestsOpen) return
    const closeWhenPageMoves = (event: Event) => {
      if (
        event.target instanceof Element &&
        event.target.closest('[data-slot="popover-content"], #destination-suggestions')
      ) {
        return
      }
      setDestinationOpen(false)
      setDatesOpen(false)
      setGuestsOpen(false)
    }
    window.addEventListener('scroll', closeWhenPageMoves, { capture: true, passive: true })
    return () => window.removeEventListener('scroll', closeWhenPageMoves, true)
  }, [destinationOpen, datesOpen, guestsOpen])

  const filteredDestinations = useMemo(() => {
    const query = destinationQuery.trim().toLocaleLowerCase()
    return query
      ? destinations.filter(
          ({ city, country }) =>
            city.toLocaleLowerCase().includes(query) ||
            country.toLocaleLowerCase().includes(query),
        )
      : destinations
  }, [destinationQuery])

  const nights =
    range?.from && range.to
      ? Math.max(0, Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000))
      : 0

  const updateCount = (field: 'adults' | 'children' | 'rooms', amount: number) => {
    const minimum = field === 'children' ? 0 : 1
    const value = Math.max(minimum, search[field] + amount)
    const next = { ...search, [field]: value }
    setSearch({ ...next, guests: next.adults + next.children })
  }

  const submitSearch = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const params = new URLSearchParams()
    if (search.destination.trim()) params.set('destination', search.destination.trim())
    if (range?.from) params.set('checkIn', format(range.from, 'yyyy-MM-dd'))
    if (range?.to) params.set('checkOut', format(range.to, 'yyyy-MM-dd'))
    params.set('adults', String(search.adults))
    params.set('children', String(search.children))
    params.set('rooms', String(search.rooms))
    setSearch({
      checkIn: range?.from ? format(range.from, 'yyyy-MM-dd') : null,
      checkOut: range?.to ? format(range.to, 'yyyy-MM-dd') : null,
      guests: search.adults + search.children,
    })
    navigate(`/hotels?${params.toString()}`)
  }

  return (
    <form
      onSubmit={submitSearch}
      className={cn(
        'grid gap-2 rounded-2xl border border-white/35 bg-white/90 p-3 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1b1b1b]/90',
        compact
          ? 'grid-cols-1 items-center lg:grid-cols-[1.25fr_1fr_1fr_1.1fr_auto] lg:rounded-full lg:p-2'
          : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1.1fr_auto] xl:rounded-full xl:p-2',
        className,
      )}
    >
      <div className="relative z-20 min-w-0">
        <label className="flex min-w-0 cursor-text items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-muted/70 xl:py-3">
            <MapPin className="size-4 shrink-0 text-accent" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                Destination
              </span>
              <input
                value={search.destination}
                onChange={(event) => {
                  setSearch({ destination: event.target.value })
                  setDestinationOpen(true)
                }}
                onFocus={() => setDestinationOpen(true)}
                onBlur={() => window.setTimeout(() => setDestinationOpen(false), 120)}
                placeholder="Where to?"
                aria-label="Destination"
                aria-expanded={destinationOpen}
                aria-controls="destination-suggestions"
                aria-autocomplete="list"
                className="w-full truncate bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </label>
        {destinationOpen && (
          <div
            id="destination-suggestions"
            role="listbox"
            className="absolute top-full left-0 z-[70] mt-2 max-h-72 w-[min(21rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-xl"
          >
            <p className="px-3 py-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {filteredDestinations.length ? 'Suggested destinations' : 'No destinations found'}
            </p>
            {filteredDestinations.map((destination) => (
              <button
                key={destination.id}
                type="button"
                role="option"
                aria-selected={search.destination === destination.city}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setSearch({ destination: destination.city })
                  setDestinationOpen(false)
                }}
                className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-foreground dark:text-accent">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-foreground">{destination.city}</span>
                  <span className="block text-xs text-muted-foreground">{destination.country}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Popover open={datesOpen} onOpenChange={setDatesOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex min-w-0 items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-colors hover:bg-muted/70 xl:py-3"
          >
            <CalendarDays className="size-4 shrink-0 text-accent" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                Check-in — Check-out
              </span>
              <span className="block truncate text-sm text-foreground">
                {formatDate(range?.from)} <span className="text-muted-foreground">—</span>{' '}
                {formatDate(range?.to)}
              </span>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-auto max-w-[calc(100vw-2rem)] p-4">
          <div className="mb-2 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Choose your dates</p>
              <p className="text-xs text-muted-foreground">
                {nights ? `${nights} ${nights === 1 ? 'night' : 'nights'}` : 'Select check-in and check-out'}
              </p>
            </div>
          </div>
          <DayPicker
            mode="range"
            selected={range}
            onSelect={(selection) => {
              setSearch({
                checkIn: selection?.from ? format(selection.from, 'yyyy-MM-dd') : null,
                checkOut: selection?.to ? format(selection.to, 'yyyy-MM-dd') : null,
              })
              if (selection?.from && selection.to) setDatesOpen(false)
            }}
            disabled={{ before: startOfDay(today) }}
            numberOfMonths={numberOfMonths}
            classNames={{
              root: 'text-foreground',
              month_caption: 'mb-2 flex h-8 items-center justify-center font-medium',
              nav: 'absolute inset-x-2 top-1 flex justify-between',
              button_previous:
                'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted',
              button_next:
                'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted',
              month_grid: 'w-full border-collapse',
              weekday: 'p-1 text-center text-xs font-normal text-muted-foreground',
              day: 'size-9 p-0 text-center text-sm',
              day_button:
                'size-9 rounded-full transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
              selected: 'bg-foreground text-background',
              range_middle: 'bg-accent/20 text-foreground',
              today: 'font-semibold text-accent-foreground dark:text-accent',
              outside: 'text-muted-foreground/50',
              disabled: 'cursor-not-allowed text-muted-foreground/40',
            }}
          />
        </PopoverContent>
      </Popover>

      <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex min-w-0 items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-colors hover:bg-muted/70 xl:py-3"
          >
            <Users className="size-4 shrink-0 text-accent" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                Guests & rooms
              </span>
              <span className="block truncate text-sm text-foreground">
                {search.adults + search.children} guests · {search.rooms}{' '}
                {search.rooms === 1 ? 'room' : 'rooms'}
              </span>
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end" avoidCollisions={false} className="w-72 p-4">
          <div className="space-y-4">
            <GuestStepper label="Adults" description="Ages 13 or above" value={search.adults} onChange={(amount) => updateCount('adults', amount)} min={1} />
            <GuestStepper label="Children" description="Ages 0–12" value={search.children} onChange={(amount) => updateCount('children', amount)} min={0} />
            <GuestStepper label="Rooms" value={search.rooms} onChange={(amount) => updateCount('rooms', amount)} min={1} />
          </div>
        </PopoverContent>
      </Popover>

      <Button
        type="submit"
        variant="primary"
        size={compact ? 'md' : 'lg'}
        className={cn('w-full rounded-xl xl:w-auto xl:rounded-full', compact && 'lg:px-5')}
      >
        <Search aria-hidden="true" />
        <span>{compact ? 'Search' : 'Find stays'}</span>
      </Button>
    </form>
  )
}

function GuestStepper({
  label,
  description,
  value,
  onChange,
  min,
}: {
  label: string
  description?: string
  value: number
  onChange: (amount: number) => void
  min: number
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="rounded-full border-0 bg-transparent text-foreground shadow-none hover:bg-muted"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(-1)}
        >
          <Minus aria-hidden="true" className="size-3.5" />
        </Button>
        <span className="w-4 text-center text-sm tabular-nums">{value}</span>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="rounded-full border-0 bg-transparent text-foreground shadow-none hover:bg-muted"
          aria-label={`Increase ${label.toLowerCase()}`}
          onClick={() => onChange(1)}
        >
          <Plus aria-hidden="true" className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

export { SearchBar }
