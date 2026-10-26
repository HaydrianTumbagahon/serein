export interface BookingGuest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  specialRequests?: string
}

export interface BookingPriceBreakdown {
  roomRate: number
  nights: number
  subtotal: number
  taxesAndFees: number
  total: number
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Booking {
  reference: string
  hotelId: string
  roomId: string
  dates: {
    checkIn: string
    checkOut: string
  }
  guests: number
  guestDetails: BookingGuest
  priceBreakdown: BookingPriceBreakdown
  status: BookingStatus
  createdAt: string
}
