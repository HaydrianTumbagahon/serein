import type { Destination } from '@/types'

const unsplash = (photoId: string, width = 900) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`

export const destinations: Destination[] = [
  {
    id: 'kyoto',
    city: 'Kyoto',
    country: 'Japan',
    image: unsplash('photo-1493976040374-85c8e12f0c0e'),
    propertyCount: 3,
  },
  {
    id: 'santorini',
    city: 'Santorini',
    country: 'Greece',
    image: unsplash('photo-1533105079780-92b9be482077'),
    propertyCount: 3,
  },
  {
    id: 'bali',
    city: 'Bali',
    country: 'Indonesia',
    image: unsplash('photo-1537996194471-e657df975ab4'),
    propertyCount: 3,
  },
  {
    id: 'amalfi-coast',
    city: 'Amalfi Coast',
    country: 'Italy',
    image: unsplash('photo-1516483638261-f4dbaf036963'),
    propertyCount: 3,
  },
  {
    id: 'maldives',
    city: 'Maldives',
    country: 'Maldives',
    image: unsplash('photo-1514282401047-d79a71a590e8'),
    propertyCount: 3,
  },
  {
    id: 'lisbon',
    city: 'Lisbon',
    country: 'Portugal',
    image: unsplash('photo-1555881400-74d7acaacd8b'),
    propertyCount: 3,
  },
  {
    id: 'marrakech',
    city: 'Marrakech',
    country: 'Morocco',
    image: unsplash('photo-1539020140153-e479b8c22e70'),
    propertyCount: 3,
  },
  {
    id: 'swiss-alps',
    city: 'Swiss Alps',
    country: 'Switzerland',
    image: unsplash('photo-1531366936337-7c912a4589a7'),
    propertyCount: 3,
  },
]
