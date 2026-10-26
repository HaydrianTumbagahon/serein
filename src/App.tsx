import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Container } from '@/components/shared/Container'

const HomePage = lazy(() => import('@/site-pages/HomePage').then((module) => ({ default: module.HomePage })))
const HotelsPage = lazy(() => import('@/site-pages/HotelsPage').then((module) => ({ default: module.HotelsPage })))
const HotelDetailPage = lazy(() => import('@/site-pages/HotelDetailPage').then((module) => ({ default: module.HotelDetailPage })))
const BookingPage = lazy(() => import('@/site-pages/BookingPage').then((module) => ({ default: module.BookingPage })))
const ConfirmationPage = lazy(() => import('@/site-pages/ConfirmationPage').then((module) => ({ default: module.ConfirmationPage })))
const ContentPages = {
  AboutPage: lazy(() => import('@/site-pages/ContentPages').then((module) => ({ default: module.AboutPage }))),
  ContactPage: lazy(() => import('@/site-pages/ContentPages').then((module) => ({ default: module.ContactPage }))),
  FaqPage: lazy(() => import('@/site-pages/ContentPages').then((module) => ({ default: module.FaqPage }))),
  PrivacyPage: lazy(() => import('@/site-pages/ContentPages').then((module) => ({ default: module.PrivacyPage }))),
  TermsPage: lazy(() => import('@/site-pages/ContentPages').then((module) => ({ default: module.TermsPage }))),
  NotFoundPage: lazy(() => import('@/site-pages/ContentPages').then((module) => ({ default: module.NotFoundPage }))),
}
const AccountPages = {
  Guard: lazy(() => import('@/site-pages/AccountPages').then((module) => ({ default: module.AccountGuard }))),
  Bookings: lazy(() => import('@/site-pages/AccountPages').then((module) => ({ default: module.BookingsPage }))),
  Wishlist: lazy(() => import('@/site-pages/AccountPages').then((module) => ({ default: module.WishlistPage }))),
  Settings: lazy(() => import('@/site-pages/AccountPages').then((module) => ({ default: module.SettingsPage }))),
}

function RouteFallback() {
  return (
    <Container className="flex min-h-[55vh] flex-col items-center justify-center py-20 text-center" role="status" aria-live="polite">
      <span className="flex size-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-heading text-3xl text-accent-foreground dark:text-accent">S</span>
      <p className="mt-4 font-heading text-2xl">Serein</p>
      <p className="mt-1 text-xs text-muted-foreground">Preparing your next stay…</p>
    </Container>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="hotels" element={<HotelsPage />} />
            <Route path="hotels/:slug" element={<HotelDetailPage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="confirmation/:reference" element={<ConfirmationPage />} />
            <Route path="about" element={<ContentPages.AboutPage />} />
            <Route path="contact" element={<ContentPages.ContactPage />} />
            <Route path="faq" element={<ContentPages.FaqPage />} />
            <Route path="account" element={<AccountPages.Guard />}>
              <Route index element={<Navigate to="bookings" replace />} />
              <Route path="bookings" element={<AccountPages.Bookings />} />
              <Route path="wishlist" element={<AccountPages.Wishlist />} />
              <Route path="settings" element={<AccountPages.Settings />} />
            </Route>
            <Route path="privacy" element={<ContentPages.PrivacyPage />} />
            <Route path="terms" element={<ContentPages.TermsPage />} />
            <Route path="*" element={<ContentPages.NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
