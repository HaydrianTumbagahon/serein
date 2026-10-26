import type { BookingPriceBreakdown } from '@/types'

function toUtcDate(value: string | Date): Date {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) throw new RangeError('Date must be valid.')
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()))
  }

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const date = dateOnly
    ? new Date(Date.UTC(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])))
    : new Date(value)

  if (Number.isNaN(date.getTime())) throw new RangeError('Date must be valid.')
  if (
    dateOnly &&
    (date.getUTCFullYear() !== Number(dateOnly[1]) ||
      date.getUTCMonth() !== Number(dateOnly[2]) - 1 ||
      date.getUTCDate() !== Number(dateOnly[3]))
  ) {
    throw new RangeError('Date must be valid.')
  }
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

export function calculateNights(checkIn: string | Date, checkOut: string | Date): number {
  const start = toUtcDate(checkIn).getTime()
  const end = toUtcDate(checkOut).getTime()
  const nights = (end - start) / 86_400_000

  if (nights <= 0) {
    throw new RangeError('Check-out must be after check-in.')
  }
  return nights
}

export function calculatePriceBreakdown(
  roomRate: number,
  nights: number,
): BookingPriceBreakdown {
  if (!Number.isFinite(roomRate) || roomRate < 0) {
    throw new RangeError('Room rate must be a non-negative number.')
  }
  if (!Number.isInteger(nights) || nights < 1) {
    throw new RangeError('Number of nights must be a positive integer.')
  }

  const subtotal = Math.round(roomRate * nights * 100) / 100
  const taxesAndFees = Math.round(subtotal * 0.12 * 100) / 100

  return {
    roomRate,
    nights,
    subtotal,
    taxesAndFees,
    total: Math.round((subtotal + taxesAndFees) * 100) / 100,
  }
}

export function generateBookingReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  const code = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')
  return `SRN-${code}`
}
