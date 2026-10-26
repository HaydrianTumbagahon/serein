import { zodResolver } from '@hookform/resolvers/zod'
import {
  CalendarDays,
  CircleUserRound,
  Heart,
  LogOut,
  Settings,
} from 'lucide-react'
import { format, isBefore, parseISO, startOfDay } from 'date-fns'
import { useEffect, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Container } from '@/components/shared/Container'
import { HotelCard } from '@/components/hotels/HotelCard'
import { hotels } from '@/data'
import { bookingStore } from '@/store/bookingStore'
import { authStore } from '@/store/authStore'
import { themeStore, type Theme } from '@/store/themeStore'
import { wishlistStore } from '@/store/wishlistStore'
import type { Booking } from '@/types'

const accountLinks = [
  { label: 'My Bookings', to: '/account/bookings', icon: CalendarDays },
  { label: 'Wishlist', to: '/account/wishlist', icon: Heart },
  { label: 'Profile Settings', to: '/account/settings', icon: Settings },
]

function AccountLayout() {
  const user = authStore((state) => state.user)
  const logOut = authStore((state) => state.logOut)
  const navigate = useNavigate()

  const handleLogOut = () => {
    logOut()
    toast.success('You have been logged out')
    navigate('/')
  }

  return (
    <Container className="py-8 pb-16 sm:py-12">
      <header className="mb-8">
        <h1 className="mt-2 font-heading text-4xl sm:text-5xl">
          {user?.name ? `Hello, ${user.name.split(' ')[0]}` : 'Your account'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Your stays and preferences, all in one place.</p>
      </header>
      <div className="grid min-w-0 gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
        <aside className="min-w-0">
          <nav aria-label="Account navigation" className="flex w-full min-w-0 gap-2 overflow-x-auto border-b border-border pb-2 lg:flex-col lg:overflow-visible lg:border-0 lg:pb-0">
            {accountLinks.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? 'bg-accent/15 font-medium text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogOut}
              className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Log out
            </button>
          </nav>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </Container>
  )
}

function AccountGuard() {
  const authenticated = authStore((state) => state.isAuthenticated)
  const setLoginOpen = authStore((state) => state.setLoginOpen)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authenticated) {
      setLoginOpen(true)
      navigate('/', { replace: true })
    }
  }, [authenticated, navigate, setLoginOpen])

  return authenticated ? <AccountLayout /> : null
}

type BookingTab = 'upcoming' | 'past' | 'cancelled'

function BookingsPage() {
  const bookings = bookingStore((state) => state.bookings)
  const cancelBooking = bookingStore((state) => state.cancelBooking)
  const [tab, setTab] = useState<BookingTab>('upcoming')
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [today] = useState(() => startOfDay(new Date()))
  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 350)
    return () => window.clearTimeout(timeout)
  }, [])
  const categorized = {
    upcoming: bookings.filter(
      (booking) => booking.status !== 'cancelled' && !isBefore(parseISO(booking.dates.checkOut), today),
    ),
    past: bookings.filter(
      (booking) => booking.status !== 'cancelled' && isBefore(parseISO(booking.dates.checkOut), today),
    ),
    cancelled: bookings.filter((booking) => booking.status === 'cancelled'),
  }

  const confirmCancel = () => {
    if (!cancelTarget) return
    cancelBooking(cancelTarget.reference)
    toast.success('Booking cancelled')
    setCancelTarget(null)
    setActiveBooking(null)
  }

  return (
    <section>
      <div className="mb-5">
        <h2 className="font-heading text-3xl">My bookings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Keep track of the places you’ve chosen.</p>
      </div>
      <Tabs value={tab} onValueChange={(value) => setTab(value as BookingTab)} className="w-full min-w-0">
        <TabsList className="mb-5 w-full justify-start sm:w-fit">
          <TabsTrigger value="upcoming">Upcoming ({categorized.upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({categorized.past.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({categorized.cancelled.length})</TabsTrigger>
        </TabsList>
        {(['upcoming', 'past', 'cancelled'] as const).map((key) => (
          <TabsContent key={key} value={key} className="mt-0 w-full min-w-0">
            {loading ? (
              <div className="space-y-4" aria-label="Loading bookings" aria-busy="true">
                {Array.from({ length: 2 }, (_, index) => (
                  <div key={index} className="grid animate-pulse overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-[180px_minmax(0,1fr)]">
                    <div className="h-44 bg-muted sm:h-48" />
                    <div className="space-y-4 p-5">
                      <div className="h-5 w-24 rounded bg-muted" />
                      <div className="h-7 w-2/3 rounded bg-muted" />
                      <div className="h-4 w-1/2 rounded bg-muted" />
                      <div className="h-10 w-36 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : categorized[key].length ? (
              <div className="space-y-4">
                {categorized[key].map((booking) => (
                  <BookingCard
                    key={booking.reference}
                    booking={booking}
                    onDetails={() => setActiveBooking(booking)}
                    onCancel={() => setCancelTarget(booking)}
                    canCancel={key === 'upcoming'}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
                <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-accent/15 text-accent-foreground dark:text-accent">
                  <CalendarDays className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-2xl">No {key} stays</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {key === 'upcoming'
                    ? 'When you book your next escape, it will appear here.'
                    : key === 'past'
                      ? 'Your completed stays will be remembered here.'
                      : 'You have no cancelled bookings.'}
                </p>
                {key === 'upcoming' && (
                  <Button asChild className="mt-5">
                    <Link to="/hotels">Find a stay</Link>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <BookingDetailsDialog
        booking={activeBooking}
        onClose={() => setActiveBooking(null)}
        onCancel={() => setCancelTarget(activeBooking)}
      />
      <Dialog open={Boolean(cancelTarget)} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Cancel this stay?</DialogTitle>
            <DialogDescription>
              This will mark booking {cancelTarget?.reference} as cancelled in your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setCancelTarget(null)}>Keep booking</Button>
            <Button type="button" variant="primary" onClick={confirmCancel}>Cancel booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function BookingCard({
  booking,
  onDetails,
  onCancel,
  canCancel,
}: {
  booking: Booking
  onDetails: () => void
  onCancel: () => void
  canCancel: boolean
}) {
  const hotel = hotels.find((item) => item.id === booking.hotelId)
  const room = hotel?.rooms.find((item) => item.id === booking.roomId)
  if (!hotel || !room) return null
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="grid sm:grid-cols-[180px_minmax(0,1fr)]">
        <img src={hotel.images[0]} alt={hotel.name} loading="lazy" width={720} height={540} className="h-44 w-full object-cover sm:h-full sm:min-h-48" />
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${
                booking.status === 'cancelled'
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-accent/15 text-accent-foreground dark:text-accent'
              }`}>{booking.status}</span>
              <h3 className="mt-2 font-heading text-2xl">{hotel.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{hotel.city}, {hotel.country} · {room.name}</p>
            </div>
            <p className="text-sm font-semibold tabular-nums">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(booking.priceBreakdown.total)}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span>{format(parseISO(booking.dates.checkIn), 'MMM d, yyyy')} — {format(parseISO(booking.dates.checkOut), 'MMM d, yyyy')}</span>
            <span>Ref. {booking.reference}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={onDetails}>View details</Button>
            {canCancel && <Button type="button" size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={onCancel}>Cancel booking</Button>}
          </div>
        </div>
      </div>
    </article>
  )
}

function BookingDetailsDialog({
  booking,
  onClose,
  onCancel,
}: {
  booking: Booking | null
  onClose: () => void
  onCancel: () => void
}) {
  const hotel = hotels.find((item) => item.id === booking?.hotelId)
  const room = hotel?.rooms.find((item) => item.id === booking?.roomId)
  return (
    <Dialog open={Boolean(booking)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        {booking && hotel && room && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-3xl">{hotel.name}</DialogTitle>
              <DialogDescription>{hotel.city}, {hotel.country} · {room.name}</DialogDescription>
            </DialogHeader>
            <img src={hotel.images[0]} alt={hotel.name} loading="lazy" width={760} height={540} className="h-48 w-full rounded-xl object-cover" />
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/60 p-4 text-sm">
              <Detail label="Check-in" value={`${format(parseISO(booking.dates.checkIn), 'EEE, MMM d')} · from 3 PM`} />
              <Detail label="Check-out" value={`${format(parseISO(booking.dates.checkOut), 'EEE, MMM d')} · until 11 AM`} />
              <Detail label="Guests" value={`${booking.guests}`} />
              <Detail label="Booking reference" value={booking.reference} />
              <Detail label="Status" value={booking.status} />
              <Detail label="Guest" value={`${booking.guestDetails.firstName} ${booking.guestDetails.lastName}`} />
              <Detail label="Email" value={booking.guestDetails.email} />
              {booking.guestDetails.phone && <Detail label="Phone" value={booking.guestDetails.phone} />}
              <Detail label="Room subtotal" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(booking.priceBreakdown.subtotal)} />
              <Detail label="Taxes and fees" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(booking.priceBreakdown.taxesAndFees)} />
              <Detail label="Total" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(booking.priceBreakdown.total)} />
              {booking.guestDetails.specialRequests && (
                <div className="col-span-2"><Detail label="Special requests" value={booking.guestDetails.specialRequests} /></div>
              )}
            </div>
            {booking.status === 'confirmed' && (
              <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" onClick={onCancel}>
                Cancel booking
              </Button>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-medium capitalize">{value}</p></div>
}

function WishlistPage() {
  const savedIds = wishlistStore((state) => state.savedHotelIds)
  const savedHotels = hotels.filter((hotel) => savedIds.includes(hotel.id))
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 350)
    return () => window.clearTimeout(timeout)
  }, [])
  return (
    <section>
      <div className="mb-5">
        <h2 className="font-heading text-3xl">Your wishlist</h2>
        <p className="mt-1 text-sm text-muted-foreground">Places you’ve saved for another day.</p>
      </div>
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading wishlist" aria-busy="true">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-[4/3] bg-muted" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-2/3 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
                <div className="h-10 w-full rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : savedHotels.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {savedHotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-accent/15 text-accent-foreground dark:text-accent">
            <Heart className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-heading text-2xl">Your wishlist is waiting</h3>
          <p className="mt-2 text-sm text-muted-foreground">Save the stays that catch your eye and find them here.</p>
          <Button asChild className="mt-5"><Link to="/hotels">Browse hotels</Link></Button>
        </div>
      )}
    </section>
  )
}

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter at least 2 characters.'),
  email: z.email('Enter a valid email address.'),
  phone: z.string().refine((value) => !value || /^\+[0-9\s().-]{7,20}$/.test(value), 'Use an international number starting with +.'),
})
type ProfileValues = z.infer<typeof profileSchema>

function SettingsPage() {
  const user = authStore((state) => state.user)
  const updateUser = authStore((state) => state.updateUser)
  const deleteAuthAccount = authStore((state) => state.deleteAccount)
  const theme = themeStore((state) => state.theme)
  const setTheme = themeStore((state) => state.setTheme)
  const [newsletter, setNewsletter] = useState(user?.newsletter ?? false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '' },
  })

  const saveProfile = handleSubmit(async (values) => {
    await new Promise((resolve) => window.setTimeout(resolve, 250))
    updateUser({ ...values, newsletter })
    toast.success('Your profile has been updated')
  })

  const deleteAccount = () => {
    deleteAuthAccount()
    toast.success('Your simulated account has been deleted')
    setDeleteOpen(false)
    navigate('/')
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl">Profile settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your details and travel preferences.</p>
      </div>
      <form onSubmit={saveProfile} noValidate className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h3 className="font-heading text-2xl">Personal details</h3>
          <div className="mt-5 flex items-center gap-4">
            {user?.avatar ? (
              <img src={user.avatar} alt="" loading="lazy" width={64} height={64} className="size-16 rounded-full border border-border bg-muted" />
            ) : (
              <span className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground"><CircleUserRound className="size-8" /></span>
            )}
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Member since {user?.memberSince ? format(parseISO(user.memberSince), 'MMMM yyyy') : 'today'}
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <ProfileField id="profile-name" label="Full name" error={errors.name?.message}>
            <Input id="profile-name" autoComplete="name" className="mt-2 h-10" aria-invalid={Boolean(errors.name)} {...register('name')} />
            </ProfileField>
            <ProfileField id="profile-email" label="Email address" error={errors.email?.message}>
            <Input id="profile-email" type="email" autoComplete="email" className="mt-2 h-10" aria-invalid={Boolean(errors.email)} {...register('email')} />
            </ProfileField>
            <ProfileField id="profile-phone" label="Phone number" error={errors.phone?.message}>
            <Input id="profile-phone" type="tel" autoComplete="tel" placeholder="+1 555 010 1234" className="mt-2 h-10" aria-invalid={Boolean(errors.phone)} {...register('phone')} />
            </ProfileField>
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h3 className="font-heading text-2xl">Preferences</h3>
          <div className="mt-5 divide-y divide-border">
            <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
              <div><p className="text-sm font-medium">Currency display</p><p className="mt-1 text-xs text-muted-foreground">Prices are shown in US dollars.</p></div>
              <span className="rounded-lg border border-border px-3 py-2 text-sm font-medium">USD · $</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <div><p className="text-sm font-medium">Travel notes</p><p className="mt-1 text-xs text-muted-foreground">Receive occasional travel inspiration by email.</p></div>
              <Checkbox id="account-newsletter" checked={newsletter} onCheckedChange={(checked) => setNewsletter(checked === true)} aria-label="Receive travel notes" />
            </div>
            <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
              <div><p className="text-sm font-medium">Appearance</p><p className="mt-1 text-xs text-muted-foreground">Choose how Serein looks on this device.</p></div>
              <Select value={theme} onValueChange={(value) => setTheme(value as Theme)}>
                <SelectTrigger className="w-32" aria-label="Theme preference"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </Button>
      </form>

      <section className="rounded-2xl border border-destructive/30 bg-destructive/[0.03] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-heading text-2xl">Delete account</h3>
            <p className="mt-1 text-sm text-muted-foreground">Remove this simulated profile from this device. Your saved bookings remain on this device.</p>
            <Button type="button" variant="secondary" className="mt-4 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setDeleteOpen(true)}>
              Delete account
            </Button>
          </div>
        </div>
      </section>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Delete your account?</DialogTitle>
            <DialogDescription>This will sign you out and remove your profile details from this device. Saved bookings will remain available.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDeleteOpen(false)}>Keep account</Button>
            <Button type="button" variant="primary" onClick={deleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function ProfileField({
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
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p role="alert" className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  )
}

export { AccountGuard, AccountLayout, BookingsPage, SettingsPage, WishlistPage }
