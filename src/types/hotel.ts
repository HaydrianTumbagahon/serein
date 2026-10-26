export type HotelType = 'Hotel' | 'Villa' | 'Resort' | 'Boutique'

export interface Room {
  id: string
  name: string
  capacity: number
  beds: string
  size: number
  pricePerNight: number
  image: string
  features: string[]
}

export interface Review {
  id: string
  author: string
  avatar: string
  country: string
  rating: number
  date: string
  comment: string
}

export interface Hotel {
  id: string
  slug: string
  destinationId: string
  name: string
  city: string
  country: string
  type: HotelType
  stars: number
  rating: number
  reviewCount: number
  pricePerNight: number
  description: string
  images: string[]
  amenities: string[]
  coordinates: {
    latitude: number
    longitude: number
  }
  featured: boolean
  rooms: Room[]
  reviews: Review[]
}
