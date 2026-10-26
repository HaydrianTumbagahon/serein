import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Booking } from '@/types'

interface BookingState {
  draft: Partial<Booking> | null
  bookings: Booking[]
  setDraft: (draft: Partial<Booking> | null) => void
  updateDraft: (updates: Partial<Booking>) => void
  clearDraft: () => void
  addBooking: (booking: Booking) => void
  cancelBooking: (reference: string) => void
}

export const bookingStore = create<BookingState>()(
  persist(
    (set) => ({
      draft: null,
      bookings: [],
      setDraft: (draft) => set({ draft }),
      updateDraft: (updates) =>
        set((state) => ({ draft: { ...state.draft, ...updates } })),
      clearDraft: () => set({ draft: null }),
      addBooking: (booking) =>
        set((state) => ({
          bookings: [
            { ...booking, status: 'confirmed' },
            ...state.bookings.filter((item) => item.reference !== booking.reference),
          ],
          draft: null,
        })),
      cancelBooking: (reference) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.reference === reference
              ? { ...booking, status: 'cancelled' }
              : booking,
          ),
        })),
    }),
    { name: 'serein-bookings' },
  ),
)
