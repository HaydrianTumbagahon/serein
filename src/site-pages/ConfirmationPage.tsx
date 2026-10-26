import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import {
  CalendarPlus,
  Check,
  Clipboard,
  ClipboardCheck,
  Home,
  MapPin,
  Users,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/shared/Container'
import { hotels } from '@/data'
import { bookingStore } from '@/store/bookingStore'
import type { Booking } from '@/types'

function ConfirmationPage() {
  const { reference = '' } = useParams()
  const booking = bookingStore((state) =>
    state.bookings.find((item) => item.reference === reference),
  )
  const hotel = hotels.find((item) => item.id === booking?.hotelId)
  const room = hotel?.rooms.find((item) => item.id === booking?.roomId)

  if (!booking || !hotel || !room) return <ConfirmationNotFound />
  return <ConfirmationDetails booking={booking} hotel={hotel} room={room} />
}

function ConfirmationDetails({
  booking,
  hotel,
  room,
}: {
  booking: Booking
  hotel: (typeof hotels)[number]
  room: (typeof hotels)[number]['rooms'][number]
}) {
  const reduceMotion = useReducedMotion()
  const [copied, setCopied] = useState(false)

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(booking.reference)
      setCopied(true)
      toast.success('Booking reference copied')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Unable to copy the reference. Please select and copy it manually.')
    }
  }

  const addToCalendar = () => {
    const checkIn = parseISO(booking.dates.checkIn)
    const checkOut = parseISO(booking.dates.checkOut)
    const datePart = (date: Date, hour: number) =>
      `${format(date, 'yyyyMMdd')}T${String(hour).padStart(2, '0')}0000`
    const escapeIcs = (value: string) =>
      value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
    const description = [
      `Booking reference: ${booking.reference}`,
      `Room: ${room.name}`,
      `Guests: ${booking.guests}`,
      `Check-in from 3:00 PM; check-out by 11:00 AM.`,
    ].join('\n')
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Serein//Stay Confirmation//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${booking.reference}@serein`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
      `DTSTART:${datePart(checkIn, 15)}`,
      `DTEND:${datePart(checkOut, 11)}`,
      `SUMMARY:${escapeIcs(`Stay at ${hotel.name}`)}`,
      `LOCATION:${escapeIcs(`${hotel.name}, ${hotel.city}, ${hotel.country}`)}`,
      `DESCRIPTION:${escapeIcs(description)}`,
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join('\r\n')
    const file = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = `serein-${booking.reference.toLowerCase()}.ics`
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    toast.success('Stay added to your calendar')
  }

  return (
    <Container className="py-10 pb-20 sm:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="relative mx-auto flex size-24 items-center justify-center">
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-accent/20"
            initial={{ opacity: 0.55, scale: 0.86 }}
            animate={reduceMotion ? { opacity: 0.2, scale: 1 } : { opacity: [0.45, 0, 0], scale: [0.86, 1.5, 1.8] }}
            transition={reduceMotion ? { duration: 0 } : { duration: 2.4, ease: 'easeOut' }}
          />
          <span className="relative flex size-20 items-center justify-center rounded-full bg-accent/20 ring-8 ring-accent/5">
            <svg viewBox="0 0 48 48" role="img" aria-label="Booking confirmed" className="size-12 overflow-visible">
              <motion.path
                d="M12 25.5 20 33l16-18"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent-foreground dark:text-accent"
                initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
              />
            </svg>
          </span>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.25 }}
        >
          <h1 className="mt-7 font-heading text-4xl sm:text-6xl">
            Your stay is confirmed
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            A confirmation has been sent to {booking.guestDetails.email}. We hope your time away is everything you need.
          </p>

          <div className="mx-auto mt-7 flex max-w-md items-center justify-between gap-4 rounded-2xl border border-accent/30 bg-accent/10 px-5 py-4 text-left">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Booking reference
              </p>
              <p className="mt-1 font-mono text-lg font-semibold tracking-[0.12em] text-foreground sm:text-xl">
                {booking.reference}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="size-9 shrink-0 rounded-full"
              aria-label={copied ? 'Reference copied' : 'Copy booking reference'}
              onClick={copyReference}
            >
              {copied ? <ClipboardCheck aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
            </Button>
          </div>
        </motion.div>

        <motion.section
          aria-labelledby="confirmed-stay-heading"
          className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.4 }}
        >
          <div className="grid sm:grid-cols-[220px_minmax(0,1fr)]">
            <Image
              src={hotel.images[0]}
              alt={hotel.name}
              width={880}
              height={720}
              sizes="(min-width: 640px) 220px, 100vw"
              className="h-52 w-full object-cover sm:h-full sm:min-h-72"
            />
            <div className="p-5 sm:p-7">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">
                Your stay
              </p>
              <h2 id="confirmed-stay-heading" className="mt-2 font-heading text-3xl">
                {hotel.name}
              </h2>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 text-accent" aria-hidden="true" />
                {hotel.city}, {hotel.country}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-border py-5">
                <StayDetail label="Room" value={room.name} />
                <StayDetail label="Guests" value={`${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}`} icon={<Users className="size-3.5" aria-hidden="true" />} />
                <StayDetail
                  label="Check-in · from 3 PM"
                  value={format(parseISO(booking.dates.checkIn), 'EEE, MMM d, yyyy')}
                />
                <StayDetail
                  label="Check-out · until 11 AM"
                  value={format(parseISO(booking.dates.checkOut), 'EEE, MMM d, yyyy')}
                />
                {booking.guestDetails.specialRequests?.trim() && (
                  <div className="col-span-2">
                    <StayDetail label="Special requests" value={booking.guestDetails.specialRequests} />
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">Total paid</span>
                <span className="font-heading text-2xl font-semibold tabular-nums">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(booking.priceBreakdown.total)}
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.div
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.55 }}
        >
          <Button type="button" variant="secondary" size="lg" onClick={addToCalendar}>
            <CalendarPlus aria-hidden="true" />
            Add to calendar
          </Button>
          <Button asChild size="lg">
            <Link to="/account/bookings">View My Bookings</Link>
          </Button>
        </motion.div>
        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Home className="size-4" aria-hidden="true" />
          Back to Home
        </Link>
      </div>
    </Container>
  )
}

function StayDetail({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: ReactNode
}) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium leading-5">
        {icon}
        <span className="break-words">{value}</span>
      </p>
    </div>
  )
}

function ConfirmationNotFound() {
  return (
    <Container className="flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-accent/15 text-accent-foreground dark:text-accent">
        <Check className="size-6" aria-hidden="true" />
      </span>
      <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        Confirmation unavailable
      </p>
      <h1 className="mt-3 font-heading text-4xl sm:text-5xl">We couldn’t find this booking</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        This reference may be incorrect or the booking may not be saved on this device.
      </p>
      <Button asChild className="mt-7">
        <Link to="/">Back to Home</Link>
      </Button>
    </Container>
  )
}

export { ConfirmationPage }
