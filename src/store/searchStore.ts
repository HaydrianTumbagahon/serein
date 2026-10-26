import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SearchSelection {
  destination: string
  checkIn: string | null
  checkOut: string | null
  guests: number
  adults: number
  children: number
  rooms: number
}

interface SearchState extends SearchSelection {
  setSearch: (selection: Partial<SearchSelection>) => void
  resetSearch: () => void
}

const initialSearch: SearchSelection = {
  destination: '',
  checkIn: null,
  checkOut: null,
  guests: 2,
  adults: 2,
  children: 0,
  rooms: 1,
}

export const searchStore = create<SearchState>()(
  persist(
    (set) => ({
      ...initialSearch,
      setSearch: (selection) => set((state) => ({ ...state, ...selection })),
      resetSearch: () => set(initialSearch),
    }),
    { name: 'serein-search' },
  ),
)
