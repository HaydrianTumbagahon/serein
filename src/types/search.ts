import type { HotelType } from './hotel'

export type HotelSort = 'price-asc' | 'price-desc' | 'rating' | 'popularity'

export interface HotelSearchFilters {
  destination?: string
  priceRange?: {
    min: number
    max: number
  }
  stars?: number[]
  propertyTypes?: HotelType[]
  amenities?: string[]
  minRating?: number
  sortBy?: HotelSort
  guests?: number
}
