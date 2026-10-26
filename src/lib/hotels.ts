import { destinations, hotels } from '@/data'
import type { Hotel, HotelSearchFilters, HotelSort } from '@/types'

function compareHotels(sortBy: HotelSort) {
  switch (sortBy) {
    case 'price-asc':
      return (first: Hotel, second: Hotel) => first.pricePerNight - second.pricePerNight
    case 'price-desc':
      return (first: Hotel, second: Hotel) => second.pricePerNight - first.pricePerNight
    case 'rating':
      return (first: Hotel, second: Hotel) => second.rating - first.rating
    case 'popularity':
      return (first: Hotel, second: Hotel) => second.reviewCount - first.reviewCount
  }
}

export function searchHotels(filters: HotelSearchFilters = {}): Hotel[] {
  const destinationQuery = filters.destination?.trim().toLocaleLowerCase()
  const matchingDestinationIds = destinationQuery
    ? destinations
        .filter(
          ({ city, country }) =>
            city.toLocaleLowerCase().includes(destinationQuery) ||
            country.toLocaleLowerCase().includes(destinationQuery),
        )
        .map(({ id }) => id)
    : []

  const results = hotels.filter((hotel) => {
    if (destinationQuery) {
      const matchesDestination =
        hotel.city.toLocaleLowerCase().includes(destinationQuery) ||
        hotel.country.toLocaleLowerCase().includes(destinationQuery) ||
        hotel.name.toLocaleLowerCase().includes(destinationQuery) ||
        matchingDestinationIds.includes(hotel.destinationId)
      if (!matchesDestination) return false
    }
    if (filters.priceRange) {
      if (
        hotel.pricePerNight < filters.priceRange.min ||
        hotel.pricePerNight > filters.priceRange.max
      ) {
        return false
      }
    }
    if (filters.stars?.length && !filters.stars.includes(hotel.stars)) return false
    if (filters.propertyTypes?.length && !filters.propertyTypes.includes(hotel.type)) {
      return false
    }
    if (
      filters.amenities?.length &&
      !filters.amenities.every((amenity) => hotel.amenities.includes(amenity))
    ) {
      return false
    }
    if (filters.minRating !== undefined && hotel.rating < filters.minRating) return false
    const guests = filters.guests
    if (guests !== undefined && !hotel.rooms.some((room) => room.capacity >= guests)) {
      return false
    }
    return true
  })

  return filters.sortBy ? results.sort(compareHotels(filters.sortBy)) : results
}
