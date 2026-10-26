import type { Testimonial } from '@/types'

const avatar = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=160&h=160&q=80`

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    author: 'Amelia Hart',
    location: 'London, United Kingdom',
    avatar: avatar('photo-1534528741775-53994a69daeb'),
    quote:
      'The ryokan was even more peaceful than we imagined. Every small detail felt considered, and the garden made it very hard to leave.',
    rating: 5,
    stay: 'A garden ryokan in Kyoto',
  },
  {
    id: 'testimonial-2',
    author: 'Daniel Kim',
    location: 'Seoul, South Korea',
    avatar: avatar('photo-1500648767791-00dcc994a43e'),
    quote:
      'A beautiful, quiet room above the water and a team who somehow remembered how we liked our morning coffee.',
    rating: 5,
    stay: 'A cliffside hideaway in Santorini',
  },
  {
    id: 'testimonial-3',
    author: 'Sofia Laurent',
    location: 'Lyon, France',
    avatar: avatar('photo-1531123897727-8f129e1688ce'),
    quote:
      'We came home feeling rested rather than rushed. The villa was tucked into the greenery, with the sea just beyond the palms.',
    rating: 5,
    stay: 'A private villa in Bali',
  },
  {
    id: 'testimonial-4',
    author: 'Oliver Bennett',
    location: 'Edinburgh, United Kingdom',
    avatar: avatar('photo-1506794778202-cad84cf45f1d'),
    quote:
      'The view from breakfast was unforgettable, but it was the warm welcome and thoughtful local recommendations that made the stay.',
    rating: 5,
    stay: 'A seaside palazzo on the Amalfi Coast',
  },
  {
    id: 'testimonial-5',
    author: 'Priya Shah',
    location: 'Toronto, Canada',
    avatar: avatar('photo-1534528741775-53994a69daeb'),
    quote:
      'Everything felt effortless, from the boat transfer to a long, unhurried dinner by the water. Exactly the reset we needed.',
    rating: 5,
    stay: 'An overwater retreat in the Maldives',
  },
  {
    id: 'testimonial-6',
    author: 'Mateo Ruiz',
    location: 'Madrid, Spain',
    avatar: avatar('photo-1500648767791-00dcc994a43e'),
    quote:
      'We found a calm little base in the middle of the city. At the end of each day, it felt like coming back to our own home.',
    rating: 5,
    stay: 'A restored townhouse in Lisbon',
  },
]
