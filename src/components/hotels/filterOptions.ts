import {
  Coffee,
  Dumbbell,
  PawPrint,
  Sparkles,
  Umbrella,
  Waves,
  Wifi,
  Car,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { HotelType } from '@/types'

export const propertyTypes: HotelType[] = ['Hotel', 'Villa', 'Resort', 'Boutique']

export const starOptions = [
  { label: '3+', value: 3, values: [3, 4, 5] },
  { label: '4+', value: 4, values: [4, 5] },
  { label: '5', value: 5, values: [5] },
]

export const ratingOptions = [
  { label: '7+', value: 3.5 },
  { label: '8+', value: 4 },
  { label: '9+', value: 4.5 },
]

export const amenityOptions: Array<{ id: string; label: string; icon: LucideIcon }> = [
  { id: 'pool', label: 'Pool', icon: Waves },
  { id: 'spa', label: 'Spa', icon: Sparkles },
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'fitness', label: 'Gym', icon: Dumbbell },
  { id: 'beach-access', label: 'Beach access', icon: Umbrella },
  { id: 'pet-friendly', label: 'Pet friendly', icon: PawPrint },
]
