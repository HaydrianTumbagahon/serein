import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  className?: string
}

function StarRating({ rating, className }: StarRatingProps) {
  const filledStars = Math.max(0, Math.min(5, Math.round(rating)))

  return (
    <span
      className={cn('inline-flex items-center gap-1.5', className)}
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      <span className="inline-flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(
              'size-3.5',
              index < filledStars ? 'fill-accent text-accent' : 'text-border',
            )}
          />
        ))}
      </span>
      <span className="text-xs font-medium text-foreground">{rating.toFixed(1)}</span>
    </span>
  )
}

export { StarRating }
