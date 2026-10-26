import { amenities } from '@/data/amenities'
import { destinations } from '@/data/destinations'
import type { Hotel, HotelType, Review, Room } from '@/types'

const unsplash = (photoId: string, width = 1400) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=82`

interface HotelSeed {
  name: string
  type: HotelType
  stars: number
  rating: number
  price: number
  description: string
  photo: string
  latitude: number
  longitude: number
  featured?: boolean
}

const hotelSeeds: Array<{ destinationId: string; hotels: HotelSeed[] }> = [
  {
    destinationId: 'kyoto',
    hotels: [
      {
        name: 'Gion Hana House',
        type: 'Boutique',
        stars: 4,
        rating: 4.8,
        price: 245,
        description:
          'Set along a quiet Gion lane, this restored townhouse pairs cedar, washi, and a private courtyard with a thoughtful sense of calm.',
        photo: 'photo-1493976040374-85c8e12f0c0e',
        latitude: 35.0037,
        longitude: 135.7788,
        featured: true,
      },
      {
        name: 'Kamo River Ryokan',
        type: 'Hotel',
        stars: 5,
        rating: 4.9,
        price: 680,
        description:
          'A small collection of river-facing suites where quiet mornings, seasonal kaiseki, and attentive hospitality shape the stay.',
        photo: 'photo-1518005020951-eccb494ad742',
        latitude: 35.0123,
        longitude: 135.7712,
        featured: true,
      },
      {
        name: 'Moss Garden Retreat',
        type: 'Villa',
        stars: 5,
        rating: 4.7,
        price: 420,
        description:
          'A secluded residence on the edge of the city, opening onto a moss garden that changes gently with the light and the season.',
        photo: 'photo-1470252649378-9c29740c9fa8',
        latitude: 35.0271,
        longitude: 135.7462,
      },
    ],
  },
  {
    destinationId: 'santorini',
    hotels: [
      {
        name: 'Aster House Oia',
        type: 'Boutique',
        stars: 5,
        rating: 4.9,
        price: 760,
        description:
          'Whitewashed suites follow the curve of the caldera, with shaded terraces made for long afternoons above the Aegean.',
        photo: 'photo-1533105079780-92b9be482077',
        latitude: 36.4618,
        longitude: 25.3753,
        featured: true,
      },
      {
        name: 'Blue Hour Villas',
        type: 'Villa',
        stars: 5,
        rating: 4.8,
        price: 980,
        description:
          'Private plunge pools and quiet, sun-warmed interiors make these hillside villas a considered place to watch the island settle.',
        photo: 'photo-1571896349842-33c89424de2d',
        latitude: 36.4296,
        longitude: 25.4244,
        featured: true,
      },
      {
        name: 'Caldera Quiet Resort',
        type: 'Resort',
        stars: 4,
        rating: 4.6,
        price: 540,
        description:
          'A low-key retreat above the water, balancing open views with generous suites, a discreet spa, and unhurried dining.',
        photo: 'photo-1540541338287-41700207dee6',
        latitude: 36.3851,
        longitude: 25.4812,
      },
    ],
  },
  {
    destinationId: 'bali',
    hotels: [
      {
        name: 'Sundara Ubud Villas',
        type: 'Villa',
        stars: 5,
        rating: 4.9,
        price: 520,
        description:
          'Tucked among palms and rice terraces, each private villa has an open-air living space and its own pocket of stillness.',
        photo: 'photo-1537996194471-e657df975ab4',
        latitude: -8.5069,
        longitude: 115.2625,
        featured: true,
      },
      {
        name: 'Tide & Palm House',
        type: 'Boutique',
        stars: 4,
        rating: 4.7,
        price: 310,
        description:
          'A small coastal hideaway with natural textures, a shaded garden, and an easy walk to the softer stretches of the shore.',
        photo: 'photo-1530789253388-582c481c54b0',
        latitude: -8.6805,
        longitude: 115.1544,
      },
      {
        name: 'The Canopy Sanctuary',
        type: 'Resort',
        stars: 5,
        rating: 4.8,
        price: 890,
        description:
          'Above a forested valley, this intimate resort offers quiet suites, restorative treatments, and a deep connection to its setting.',
        photo: 'photo-1445019980597-93fa8acb246c',
        latitude: -8.4321,
        longitude: 115.2528,
        featured: true,
      },
    ],
  },
  {
    destinationId: 'amalfi-coast',
    hotels: [
      {
        name: 'Casa dei Limoni',
        type: 'Boutique',
        stars: 4,
        rating: 4.7,
        price: 390,
        description:
          'An intimate Positano residence softened by lemon trees, hand-finished tile, and terraces looking toward the Tyrrhenian Sea.',
        photo: 'photo-1516483638261-f4dbaf036963',
        latitude: 40.6281,
        longitude: 14.4845,
        featured: true,
      },
      {
        name: 'Palazzo Marina',
        type: 'Hotel',
        stars: 5,
        rating: 4.9,
        price: 1120,
        description:
          'A gracious palazzo above the waterfront, where original details meet discreet service and a beautiful, unhurried breakfast.',
        photo: 'photo-1534237710431-e2fc698436d0',
        latitude: 40.6283,
        longitude: 14.4841,
        featured: true,
      },
      {
        name: 'Olive Terrace Villa',
        type: 'Villa',
        stars: 5,
        rating: 4.8,
        price: 850,
        description:
          'A private home among olive trees with open-air dining, a generous terrace, and room to settle into the rhythm of the coast.',
        photo: 'photo-1613490493576-7fde63acd811',
        latitude: 40.6157,
        longitude: 14.5218,
      },
    ],
  },
  {
    destinationId: 'maldives',
    hotels: [
      {
        name: 'Lagoon House No. 8',
        type: 'Villa',
        stars: 5,
        rating: 4.9,
        price: 1200,
        description:
          'An overwater hideaway with a ladder into the lagoon, a wide timber deck, and the rare luxury of nowhere else to be.',
        photo: 'photo-1514282401047-d79a71a590e8',
        latitude: 4.1755,
        longitude: 73.5093,
        featured: true,
      },
      {
        name: 'Serein Atoll Resort',
        type: 'Resort',
        stars: 5,
        rating: 4.8,
        price: 940,
        description:
          'Set on a quiet ribbon of sand, this island resort keeps its footprint gentle and its days wonderfully open.',
        photo: 'photo-1573843981267-be1999ff37cd',
        latitude: 3.2028,
        longitude: 73.2207,
      },
      {
        name: 'Coral Garden Retreat',
        type: 'Hotel',
        stars: 4,
        rating: 4.6,
        price: 610,
        description:
          'A relaxed island stay close to the house reef, with breezy rooms, a small spa, and evenings lit softly by the water.',
        photo: 'photo-1510414842594-a61c69b5ae57',
        latitude: 5.1124,
        longitude: 73.0708,
      },
    ],
  },
  {
    destinationId: 'lisbon',
    hotels: [
      {
        name: 'Rua das Flores House',
        type: 'Boutique',
        stars: 4,
        rating: 4.8,
        price: 220,
        description:
          'A restored townhouse in the old quarter, layered with original stone, considered modern comforts, and a welcoming courtyard.',
        photo: 'photo-1555881400-74d7acaacd8b',
        latitude: 38.7102,
        longitude: -9.1423,
        featured: true,
      },
      {
        name: 'Miradouro Grand Hotel',
        type: 'Hotel',
        stars: 5,
        rating: 4.7,
        price: 460,
        description:
          'A quietly elegant city address with a rooftop outlook, generous rooms, and a thoughtful sense of place in every detail.',
        photo: 'photo-1566073771259-6a8506099945',
        latitude: 38.7206,
        longitude: -9.1378,
      },
      {
        name: 'Alfama Garden Suites',
        type: 'Boutique',
        stars: 4,
        rating: 4.6,
        price: 120,
        description:
          'A peaceful collection of suites tucked into Alfama, with tiled thresholds, a leafy patio, and the city close at hand.',
        photo: 'photo-1601918774946-25832a4be0d6',
        latitude: 38.7118,
        longitude: -9.1309,
      },
    ],
  },
  {
    destinationId: 'marrakech',
    hotels: [
      {
        name: 'Riad Dar Serein',
        type: 'Boutique',
        stars: 5,
        rating: 4.9,
        price: 360,
        description:
          'Behind a modest medina doorway, a still courtyard, carved cedar, and the gentle sound of a fountain create a welcome pause.',
        photo: 'photo-1539020140153-e479b8c22e70',
        latitude: 31.6295,
        longitude: -7.9891,
        featured: true,
      },
      {
        name: 'Atlas Courtyard Hotel',
        type: 'Hotel',
        stars: 4,
        rating: 4.7,
        price: 285,
        description:
          'A calm base at the edge of the old city, with a sunlit pool, local craft, and a rooftop view toward the Atlas Mountains.',
        photo: 'photo-1542314831-068cd1dbfeeb',
        latitude: 31.6314,
        longitude: -7.9956,
      },
      {
        name: 'Palmeraie Dune Resort',
        type: 'Resort',
        stars: 5,
        rating: 4.8,
        price: 730,
        description:
          'A garden retreat beyond the medina where palms, quiet pathways, and generous private spaces shape a slower stay.',
        photo: 'photo-1571896349842-33c89424de2d',
        latitude: 31.6694,
        longitude: -7.9587,
      },
    ],
  },
  {
    destinationId: 'swiss-alps',
    hotels: [
      {
        name: 'Alpine Stillness Lodge',
        type: 'Hotel',
        stars: 5,
        rating: 4.9,
        price: 640,
        description:
          'A timber-and-stone lodge framed by the peaks, with deep window seats, a warming spa, and an easy closeness to the trails.',
        photo: 'photo-1519681393784-d120267933ba',
        latitude: 46.0207,
        longitude: 7.7491,
        featured: true,
      },
      {
        name: 'Edelweiss Chalet',
        type: 'Villa',
        stars: 4,
        rating: 4.8,
        price: 480,
        description:
          'A private chalet with a wood-burning stove, a broad mountain balcony, and all the quiet comforts of a home in the Alps.',
        photo: 'photo-1464822759023-fed622ff2c3b',
        latitude: 46.6863,
        longitude: 7.8632,
      },
      {
        name: 'Glacier View House',
        type: 'Boutique',
        stars: 4,
        rating: 4.5,
        price: 320,
        description:
          'A welcoming alpine house where simple natural materials and thoughtful hosts let the landscape take the lead.',
        photo: 'photo-1500530855697-b586d89ba3ee',
        latitude: 46.5581,
        longitude: 8.5617,
      },
    ],
  },
]

const roomNames = ['Classic Room', 'Garden Room', 'Deluxe Suite', 'Signature Suite']
const roomBeds = ['Queen bed', 'King bed', 'King bed and daybed', 'Two queen beds']
const roomFeatures = [
  ['Rain shower', 'Linen robes', 'Reading nook'],
  ['Private balcony', 'Deep soaking tub', 'Evening turndown'],
  ['Separate sitting area', 'Welcome refreshments', 'Premium linens'],
  ['Panoramic windows', 'Lounge area', 'Personalized minibar'],
]
const reviewAuthors = [
  { name: 'Clara Wilson', country: 'United States', avatar: 'photo-1534528741775-53994a69daeb' },
  { name: 'Theo Martin', country: 'France', avatar: 'photo-1500648767791-00dcc994a43e' },
  { name: 'Mina Tanaka', country: 'Japan', avatar: 'photo-1544005313-94ddf0286df2' },
  { name: 'Lucas Meyer', country: 'Germany', avatar: 'photo-1506794778202-cad84cf45f1d' },
  { name: 'Aisha Rahman', country: 'Singapore', avatar: 'photo-1531123897727-8f129e1688ce' },
  { name: 'Sofia Costa', country: 'Portugal', avatar: 'photo-1534528741775-53994a69daeb' },
]
const reviewComments = [
  'A lovely sense of calm from the moment we arrived. The room was beautifully prepared and the team made everything feel easy.',
  'The setting was even more special than the photographs. We especially appreciated the thoughtful local recommendations.',
  'A very comfortable stay, with excellent breakfasts and small details that made us feel genuinely welcome.',
  'We found it difficult to leave the terrace. The service was warm, discreet, and consistently thoughtful.',
  'A peaceful room, a beautiful view, and a memorable dinner. We would happily return for a longer stay.',
  'Everything felt considered without being formal. It was exactly the kind of place we hoped to find.',
]
const amenityIds = amenities.map(({ id }) => id)
const destinationPhotos: Record<string, string> = {
  kyoto: 'photo-1493976040374-85c8e12f0c0e',
  santorini: 'photo-1533105079780-92b9be482077',
  bali: 'photo-1537996194471-e657df975ab4',
  'amalfi-coast': 'photo-1516483638261-f4dbaf036963',
  maldives: 'photo-1514282401047-d79a71a590e8',
  lisbon: 'photo-1555881400-74d7acaacd8b',
  marrakech: 'photo-1539020140153-e479b8c22e70',
  'swiss-alps': 'photo-1519681393784-d120267933ba',
}

function createRooms(
  hotelId: string,
  pricePerNight: number,
  images: string[],
  hotelIndex: number,
): Room[] {
  const roomCount = 2 + (hotelIndex % 3)

  return Array.from({ length: roomCount }, (_, index) => {
    const roomIndex = (index + hotelIndex) % roomNames.length
    const multiplier = [0.82, 1, 1.35, 1.7][index]

    return {
      id: `${hotelId}-room-${index + 1}`,
      name: roomNames[roomIndex],
      capacity: index === 3 ? 4 : index === 2 ? 3 : 2,
      beds: roomBeds[roomIndex],
      size: 28 + roomIndex * 12 + (hotelIndex % 3) * 3,
      pricePerNight: Math.round((pricePerNight * multiplier) / 5) * 5,
      image: images[index % images.length],
      features: roomFeatures[roomIndex],
    }
  })
}

function createReviews(hotelId: string, rating: number, hotelIndex: number): Review[] {
  const reviewCount = 3 + (hotelIndex % 4)

  return Array.from({ length: reviewCount }, (_, index) => {
    const reviewer = reviewAuthors[(hotelIndex + index) % reviewAuthors.length]
    const date = new Date(Date.UTC(2025, (hotelIndex + index) % 12, 8 + index * 3))

    return {
      id: `${hotelId}-review-${index + 1}`,
      author: reviewer.name,
      avatar: unsplash(reviewer.avatar, 160),
      country: reviewer.country,
      rating: Math.max(4, Math.min(5, Math.round((rating - (index % 3) * 0.1) * 10) / 10)),
      date: date.toISOString().slice(0, 10),
      comment: reviewComments[(hotelIndex + index) % reviewComments.length],
    }
  })
}

export const hotels: Hotel[] = hotelSeeds.flatMap(({ destinationId, hotels: seedHotels }, destinationIndex) => {
  const destination = destinations.find((item) => item.id === destinationId)
  if (!destination) {
    throw new Error(`Missing destination data for ${destinationId}`)
  }

  return seedHotels.map((seed, localIndex) => {
    const hotelIndex = destinationIndex * 3 + localIndex
    const id = `${destinationId}-${localIndex + 1}`
    const slug = seed.name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const images = [
      unsplash(seed.photo),
      unsplash(destinationPhotos[destinationId]),
      unsplash('photo-1582719508461-905c673771fd'),
    ]
    const selectedAmenities = Array.from(
      { length: 5 + (hotelIndex % 4) },
      (_, offset) => amenityIds[(hotelIndex * 2 + offset) % amenityIds.length],
    )

    return {
      id,
      slug,
      destinationId,
      name: seed.name,
      city: destination.city,
      country: destination.country,
      type: seed.type,
      stars: seed.stars,
      rating: seed.rating,
      reviewCount: 86 + hotelIndex * 37,
      pricePerNight: seed.price,
      description: seed.description,
      images,
      amenities: selectedAmenities,
      coordinates: {
        latitude: seed.latitude + localIndex * 0.0012,
        longitude: seed.longitude - localIndex * 0.0011,
      },
      featured: seed.featured ?? false,
      rooms: createRooms(id, seed.price, images, hotelIndex),
      reviews: createReviews(id, seed.rating, hotelIndex),
    }
  })
})
