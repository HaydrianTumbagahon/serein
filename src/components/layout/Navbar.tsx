import { motion, useReducedMotion } from 'framer-motion'
import {
  Heart,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { authStore } from '@/store/authStore'
import { wishlistStore } from '@/store/wishlistStore'
import { LoginDialog } from '@/components/layout/LoginDialog'

const primaryLinks = [
  { label: 'Home', to: '/' },
  { label: 'Hotels', to: '/hotels' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(window.scrollY > 40)
  const [mobileOpen, setMobileOpen] = useState(false)
  const savedCount = wishlistStore((state) => state.savedHotelIds.length)
  const isAuthenticated = authStore((state) => state.isAuthenticated)
  const logOut = authStore((state) => state.logOut)
  const setLoginOpen = authStore((state) => state.setLoginOpen)
  const user = authStore((state) => state.user)
  const reduceMotion = useReducedMotion()
  const hasSurface = !isHome || scrolled

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative min-h-11 px-1 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      hasSurface
        ? isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        : isActive ? 'text-white' : 'text-white/90 hover:text-white'
    }`

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logOut()
      return
    }
    setLoginOpen(true)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        hasSurface
          ? 'border-border/70 bg-background/85 backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link
          to="/"
          aria-label="Serein home"
          className={`shrink-0 font-heading text-3xl font-medium tracking-[0.08em] transition-colors ${
            hasSurface ? 'text-foreground' : 'text-white'
          }`}
        >
          Serein
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {primaryLinks.map(({ label, to }) => (
            <NavLink key={to} to={to} end={to === '/'} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-link"
                      className="absolute inset-x-0 -bottom-1 h-px bg-accent"
                      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {!isHome && (
            <Button asChild variant="ghost" size="sm" className="hidden gap-2 sm:inline-flex">
              <Link to="/hotels">
                <Search aria-hidden="true" />
                <span>Search stays</span>
              </Link>
            </Button>
          )}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className={`relative rounded-full ${hasSurface ? '' : 'text-white hover:bg-white/15 hover:text-white'}`}
            aria-label={`Wishlist${savedCount ? `, ${savedCount} saved` : ''}`}
          >
            <Link to="/account/wishlist">
              <Heart aria-hidden="true" />
              {savedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-accent-foreground">
                  {savedCount > 9 ? '9+' : savedCount}
                </span>
              )}
            </Link>
          </Button>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className={`hidden gap-2 sm:inline-flex ${hasSurface ? '' : 'border-white/50 bg-black/25 text-white hover:bg-white/15 hover:text-white'}`}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" loading="lazy" width={20} height={20} className="size-5 rounded-full" />
                  ) : <UserRound aria-hidden="true" />}
                  {user?.name.split(' ')[0] ?? 'Account'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link to="/account/bookings">My Bookings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/wishlist">Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/settings">
                    <Settings aria-hidden="true" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logOut}>
                  <LogOut aria-hidden="true" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className={`hidden sm:inline-flex ${hasSurface ? '' : 'border-white/35 bg-white/15 text-white backdrop-blur-md hover:bg-white/25 hover:text-white'}`}
              onClick={handleAuthAction}
            >
              Account / Login
            </Button>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full md:hidden ${hasSurface ? '' : 'text-white hover:bg-white/15 hover:text-white'}`}
                aria-label="Open navigation menu"
              >
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="h-dvh w-full max-w-sm p-0">
              <SheetHeader className="border-b border-border px-6 py-5">
                <SheetTitle className="font-heading text-3xl font-medium tracking-[0.08em]">
                  Serein
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-6 py-5" aria-label="Mobile navigation">
                {primaryLinks.map(({ label, to }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `border-b border-border/70 py-4 font-heading text-2xl ${
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                {!isHome && (
                  <Link
                    to="/hotels"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 border-b border-border/70 py-4 text-muted-foreground"
                  >
                    <Search aria-hidden="true" className="size-4" />
                    Search stays
                  </Link>
                )}
                <Link
                  to="/account/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 border-b border-border/70 py-4 text-muted-foreground"
                >
                  <Heart aria-hidden="true" className="size-4" />
                  Wishlist{savedCount > 0 ? ` (${savedCount})` : ''}
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      to="/account/bookings"
                      onClick={() => setMobileOpen(false)}
                      className="border-b border-border/70 py-4 text-muted-foreground"
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/account/settings"
                      onClick={() => setMobileOpen(false)}
                      className="border-b border-border/70 py-4 text-muted-foreground"
                    >
                      Profile Settings
                    </Link>
                  </>
                )}
              </nav>
              <div className="mt-auto px-6 pb-8">
                <Button
                  className="w-full"
                  variant={isAuthenticated ? 'secondary' : 'primary'}
                  onClick={() => {
                    handleAuthAction()
                    setMobileOpen(false)
                  }}
                >
                  {isAuthenticated ? 'Log out' : 'Account / Login'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <LoginDialog />
    </header>
  )
}

export { Navbar }
