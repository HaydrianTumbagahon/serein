import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import {
  ArrowLeft,
  BedDouble,
  Check,
  ChevronDown,
  CreditCard,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Sparkles,
  Headset,
  LoaderCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { addDays, format } from 'date-fns'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Container } from '@/components/shared/Container'
import { hotels } from '@/data'
import {
  calculateNights,
  calculatePriceBreakdown,
  generateBookingReference,
} from '@/lib'
import { bookingStore } from '@/store/bookingStore'
import { searchStore } from '@/store/searchStore'
import type { Booking } from '@/types'

const isFutureExpiry = (value: string) => {
  const [month, yearSuffix] = value.split('/').map(Number)
  const year = 2000 + yearSuffix
  const now = new Date()
  return (
    year > now.getFullYear() ||
    (year === now.getFullYear() && month >= now.getMonth() + 1)
  )
}

const isValidCardNumber = (value: string) => {
  const digits = value.replace(/\s/g, '')
  if (!/^\d{13,19}$/.test(digits)) return false
  let sum = 0
  let doubleDigit = false
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])
    if (doubleDigit) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    doubleDigit = !doubleDigit
  }
  return sum % 10 === 0
}

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.'),
  email: z.email('Enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .regex(/^\+[0-9\s().-]+$/, 'Use international format, including the + prefix.')
    .refine(
      (value) => {
        const digits = value.replace(/\D/g, '')
        return digits.length >= 7 && digits.length <= 15
      },
      'Enter a valid international phone number.',
    ),
  specialRequests: z.string().max(500, 'Keep your request under 500 characters.'),
  acceptTerms: z.boolean().refine(Boolean, 'Please accept the Terms and Privacy Policy.'),
  cardNumber: z
    .string()
    .min(1, 'Enter your card number.')
    .refine(isValidCardNumber, 'Enter a valid card number.'),
  cardName: z.string().trim().min(2, 'Enter the name printed on your card.'),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Enter expiry as MM/YY.')
    .refine(isFutureExpiry, 'Your card has expired.'),
  cvc: z.string().regex(/^\d{3,4}$/, 'Enter a 3- or 4-digit security code.'),
})

type CheckoutValues = z.infer<typeof checkoutSchema>

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function getCardBrand(cardNumber: string) {
  const digits = cardNumber.replace(/\s/g, '')
  if (/^4/.test(digits)) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard'
  if (/^3[47]/.test(digits)) return 'American Express'
  if (/^6(?:011|5)/.test(digits)) return 'Discover'
  return 'Card'
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

function BookingPage() {
  const navigate = useNavigate()
  const draft = bookingStore((state) => state.draft)
  const search = searchStore()
  const [summaryOpen, setSummaryOpen] = useState(true)
  const hotel = hotels.find((item) => item.id === draft?.hotelId)
  const room = hotel?.rooms.find((item) => item.id === draft?.roomId)

  const dates = useMemo(() => {
    if (draft?.dates?.checkIn && draft.dates.checkOut) {
      try {
        calculateNights(draft.dates.checkIn, draft.dates.checkOut)
        return draft.dates
      } catch {
        // Use the search dates or a one-night default if the saved selection is stale.
      }
    }
    if (search.checkIn && search.checkOut) {
      try {
        calculateNights(search.checkIn, search.checkOut)
        return { checkIn: search.checkIn, checkOut: search.checkOut }
      } catch {
        // Use the default below when search dates are no longer valid.
      }
    }
    const checkIn = addDays(new Date(), 1)
    return {
      checkIn: format(checkIn, 'yyyy-MM-dd'),
      checkOut: format(addDays(checkIn, 1), 'yyyy-MM-dd'),
    }
  }, [draft?.dates, search.checkIn, search.checkOut])

  useEffect(() => {
    if (draft && (draft.dates?.checkIn !== dates.checkIn || draft.dates?.checkOut !== dates.checkOut)) {
      bookingStore.getState().updateDraft({ dates })
    }
  }, [dates, draft])

  const nights = useMemo(
    () => calculateNights(dates.checkIn, dates.checkOut),
    [dates],
  )
  const priceBreakdown = room
    ? calculatePriceBreakdown(room.pricePerNight, nights)
    : null
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      specialRequests: '',
      acceptTerms: false,
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvc: '',
    },
  })
  const cardNumber = watch('cardNumber')
  const cardBrand = getCardBrand(cardNumber ?? '')

  const submitBooking = handleSubmit(async (values) => {
    if (!draft || !hotel || !room || !priceBreakdown) {
      toast.error('Your stay details are unavailable. Please choose a stay again.')
      return
    }

    await new Promise((resolve) => window.setTimeout(resolve, 1500))

    const [firstName, ...lastNameParts] = values.fullName.trim().split(/\s+/)
    const booking: Booking = {
      reference: generateBookingReference(),
      hotelId: hotel.id,
      roomId: room.id,
      dates,
      guests: draft.guests ?? search.adults + search.children,
      guestDetails: {
        firstName,
        lastName: lastNameParts.join(' '),
        email: values.email,
        phone: values.phone,
        specialRequests: values.specialRequests,
      },
      priceBreakdown,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }

    bookingStore.getState().addBooking(booking)
    toast.success('Your stay is confirmed. We look forward to welcoming you.')
    navigate(`/confirmation/${booking.reference}`)
  })

  if (!draft) {
    return (
      <Container className="flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-accent/15 text-accent-foreground dark:text-accent">
          <BedDouble className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-3 font-heading text-4xl sm:text-5xl">
          Nothing booked just yet
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          Choose a place that feels right, and we’ll be here to help you finish the details.
        </p>
        <Button asChild className="mt-7">
          <Link to="/hotels">Explore stays</Link>
        </Button>
      </Container>
    )
  }

  if (!hotel || !room || !priceBreakdown) {
    return (
      <Container className="flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          Booking details unavailable
        </p>
        <h1 className="mt-3 font-heading text-4xl">Let’s find your stay again</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          We couldn’t match this saved selection to a stay. Please choose a hotel and room to continue.
        </p>
        <Button asChild className="mt-7">
          <Link to="/hotels">Browse stays</Link>
        </Button>
      </Container>
    )
  }

  return (
    <Container className="py-8 pb-16 sm:py-12">
      <Link
        to={`/hotels/${hotel.slug}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to {hotel.name}
      </Link>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          Almost there
        </p>
        <h1 className="mt-2 font-heading text-4xl sm:text-5xl">Complete your stay</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A few details, then your time away is taken care of.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        <form
          id="checkout-form"
          onSubmit={submitBooking}
          noValidate
          className="order-2 space-y-5 lg:order-1"
        >
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                01 / Guest details
              </p>
              <h2 className="mt-2 font-heading text-2xl">Who’s joining the stay?</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="checkout-full-name"
                label="Full name"
                error={errors.fullName?.message}
              >
                <Input
                  id="checkout-full-name"
                  autoComplete="name"
                  placeholder="Your full name"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'checkout-full-name-error' : undefined}
                  {...register('fullName')}
                />
              </FormField>
              <FormField id="checkout-email" label="Email address" error={errors.email?.message}>
                <Input
                  id="checkout-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'checkout-email-error' : undefined}
                  {...register('email')}
                />
              </FormField>
              <FormField id="checkout-phone" label="Phone (international format)" error={errors.phone?.message}>
                <Input
                  id="checkout-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 555 010 1234"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
                  {...register('phone')}
                />
              </FormField>
              <div className="sm:col-span-2">
                <Label htmlFor="checkout-requests">Special requests <span className="font-normal text-muted-foreground">(optional)</span></Label>
                <Textarea
                  id="checkout-requests"
                  rows={3}
                  maxLength={500}
                  placeholder="Anything you’d like us to know before you arrive?"
                  aria-invalid={Boolean(errors.specialRequests)}
                  aria-describedby={errors.specialRequests ? 'checkout-special-requests-error' : 'checkout-requests-count'}
                  className="mt-2 min-h-24 resize-y"
                  {...register('specialRequests')}
                />
                <div className="mt-1 flex justify-between gap-3 text-xs text-muted-foreground">
                  {errors.specialRequests ? (
                    <FieldError id="checkout-special-requests-error" message={errors.specialRequests.message} />
                  ) : <span />}
                  <span id="checkout-requests-count">{(watch('specialRequests') ?? '').length}/500</span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="checkout-terms"
                    checked={watch('acceptTerms')}
                    onCheckedChange={(checked) =>
                      setValue('acceptTerms', checked === true, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    aria-invalid={Boolean(errors.acceptTerms)}
                    aria-describedby={errors.acceptTerms ? 'checkout-terms-error' : undefined}
                    className="mt-0.5"
                  />
                  <Label htmlFor="checkout-terms" className="items-start text-xs leading-5 text-muted-foreground">
                    I agree to the{' '}
                    <Link to="/terms" className="font-medium text-foreground underline decoration-accent underline-offset-4">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="font-medium text-foreground underline decoration-accent underline-offset-4">Privacy Policy</Link>.
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <FieldError id="checkout-terms-error" message={errors.acceptTerms.message} className="mt-2" />
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                  02 / Payment
                </p>
                <h2 className="mt-2 font-heading text-2xl">Payment details</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-medium text-accent-foreground dark:text-accent">
                <CreditCard className="size-3.5" aria-hidden="true" />
                Demo payment. No real charges.
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField id="checkout-card-number" label="Card number" error={errors.cardNumber?.message}>
                  <div className="relative">
                    <Input
                      id="checkout-card-number"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 5678 9012 3456"
                      aria-invalid={Boolean(errors.cardNumber)}
                      aria-describedby={errors.cardNumber ? 'checkout-card-number-error' : 'checkout-card-brand'}
                      className="pr-32"
                      {...register('cardNumber')}
                      onChange={(event) =>
                        setValue('cardNumber', formatCardNumber(event.target.value), {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                    <span id="checkout-card-brand" className="pointer-events-none absolute inset-y-0 right-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CreditCard className="size-4" aria-hidden="true" />
                      {cardBrand}
                    </span>
                  </div>
                </FormField>
              </div>
              <FormField id="checkout-card-name" label="Name on card" error={errors.cardName?.message}>
                <Input
                  id="checkout-card-name"
                  autoComplete="cc-name"
                  placeholder="Name as it appears on card"
                  aria-invalid={Boolean(errors.cardName)}
                  aria-describedby={errors.cardName ? 'checkout-card-name-error' : undefined}
                  {...register('cardName')}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField id="checkout-expiry" label="Expiry" error={errors.expiry?.message}>
                  <Input
                    id="checkout-expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    aria-invalid={Boolean(errors.expiry)}
                    aria-describedby={errors.expiry ? 'checkout-expiry-error' : undefined}
                    {...register('expiry')}
                    onChange={(event) =>
                      setValue('expiry', formatExpiry(event.target.value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </FormField>
                <FormField id="checkout-cvc" label="CVC" error={errors.cvc?.message}>
                  <Input
                    id="checkout-cvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    maxLength={4}
                    aria-invalid={Boolean(errors.cvc)}
                    aria-describedby={errors.cvc ? 'checkout-cvc-error' : undefined}
                    {...register('cvc')}
                    onChange={(event) =>
                      setValue('cvc', event.target.value.replace(/\D/g, '').slice(0, 4), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </FormField>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-secondary/40 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent/15 text-accent-foreground dark:text-accent">
                <LockKeyhole className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-semibold">Your details stay protected</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  This is a secure demo checkout. Payment information is never saved.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <TrustBadge icon={ShieldCheck} label="Secure checkout" />
              <TrustBadge icon={Check} label="Free cancellation" />
              <TrustBadge icon={Headset} label="24/7 support" />
            </div>
          </section>

        </form>

        <aside className="order-1 lg:sticky lg:top-24 lg:order-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between p-5 lg:hidden">
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
                aria-expanded={summaryOpen}
                aria-controls="booking-summary-details"
                onClick={() => setSummaryOpen((open) => !open)}
              >
                <span>
                  <span className="block text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                    Your reservation
                  </span>
                  <span className="mt-1 block font-heading text-2xl">Booking summary</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{currency.format(priceBreakdown.total)}</span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform ${summaryOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </span>
              </button>
            </div>
            <div className="hidden p-5 lg:block">
              <span>
                <span className="block text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                  Your reservation
                </span>
                <span className="mt-1 block font-heading text-2xl">Booking summary</span>
              </span>
            </div>
            <div
              id="booking-summary-details"
              className={`${summaryOpen ? 'block' : 'hidden'} border-t border-border p-5 pt-4 lg:block`}
            >
              <div className="flex gap-4">
                <Image
                  src={hotel.images[0]}
                  alt={hotel.name}
                  width={800}
                  height={600}
                  sizes="96px"
                  className="size-24 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 py-1">
                  <h2 className="font-heading text-xl leading-tight">{hotel.name}</h2>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 text-accent" aria-hidden="true" />
                    {hotel.city}, {hotel.country}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <BedDouble className="size-3.5 text-accent" aria-hidden="true" />
                    {room.name}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-muted/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-xs">
                    <SummaryDate label="Check-in" date={dates.checkIn} />
                    <SummaryDate label="Check-out" date={dates.checkOut} />
                    <span>
                      <span className="block text-muted-foreground">Length of stay</span>
                      <span className="mt-1 block font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                    </span>
                    <span>
                      <span className="block text-muted-foreground">Guests</span>
                      <span className="mt-1 block font-medium">
                        {draft.guests ?? search.adults + search.children} {((draft.guests ?? search.adults + search.children) === 1) ? 'guest' : 'guests'}
                      </span>
                    </span>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="shrink-0 px-2">
                    <Link to={`/hotels/${hotel.slug}`}>Edit</Link>
                  </Button>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <h3 className="text-xs font-semibold tracking-wide uppercase">Price details</h3>
                <div className="flex justify-between gap-4 text-sm text-muted-foreground">
                  <span>{currency.format(room.pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span className="text-foreground">{currency.format(priceBreakdown.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4 text-sm text-muted-foreground">
                  <span>Taxes and fees</span>
                  <span className="text-foreground">{currency.format(priceBreakdown.taxesAndFees)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-heading text-2xl font-semibold tabular-nums">
                    {currency.format(priceBreakdown.total)}
                  </span>
                </div>
              </div>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
                Free cancellation · No payment today
              </p>
            </div>
            <div className="border-t border-border p-5 pt-0">
              <Button
                type="submit"
                form="checkout-form"
                size="lg"
                disabled={!isValid || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                    Confirming your stay…
                  </>
                ) : (
                  <>
                    <LockKeyhole aria-hidden="true" />
                    Confirm Booking
                  </>
                )}
              </Button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Demo checkout · no real charges
              </p>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  )
}

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="min-w-0">
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2">{children}</div>
      {error && <FieldError id={`${id}-error`} message={error} className="mt-1.5" />}
    </div>
  )
}

function FieldError({
  id,
  message,
  className,
}: {
  id: string
  message?: string
  className?: string
}) {
  if (!message) return null
  return <p id={id} role="alert" className={`text-xs text-destructive ${className ?? ''}`}>{message}</p>
}

function SummaryDate({ label, date }: { label: string; date: string }) {
  return (
    <span>
      <span className="block text-muted-foreground">{label}</span>
      <time dateTime={date} className="mt-1 block font-medium">
        {format(new Date(`${date}T12:00:00`), 'EEE, MMM d')}
      </time>
    </span>
  )
}

function TrustBadge({
  icon: Icon,
  label,
}: {
  icon: LucideIcon
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-[11px] text-muted-foreground">
      <Icon className="size-3.5 text-accent" aria-hidden="true" />
      {label}
    </span>
  )
}

export { BookingPage }
