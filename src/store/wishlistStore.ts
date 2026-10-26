import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  savedHotelIds: string[]
  toggle: (hotelId: string) => void
  isSaved: (hotelId: string) => boolean
}

export const wishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      savedHotelIds: [],
      toggle: (hotelId) => {
        set((state) => ({
          savedHotelIds: state.savedHotelIds.includes(hotelId)
            ? state.savedHotelIds.filter((savedId) => savedId !== hotelId)
            : [...state.savedHotelIds, hotelId],
        }))
      },
      isSaved: (hotelId) => get().savedHotelIds.includes(hotelId),
    }),
    { name: 'serein-wishlist' },
  ),
)
