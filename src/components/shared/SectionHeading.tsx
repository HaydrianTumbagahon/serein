import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  id?: string
  title: string
  subtitle?: string
  viewAllHref?: string
  viewAllLabel?: string
  className?: string
}

function SectionHeading({
  id,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = 'View all',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-5', className)}>
      <div className="max-w-2xl">
        <h2 id={id} className="text-4xl leading-tight text-foreground sm:text-5xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {viewAllHref && (
        <Link
          className="inline-flex items-center gap-2 pb-1 text-sm font-medium text-foreground transition-colors hover:text-accent-foreground dark:hover:text-accent"
          to={viewAllHref}
        >
          {viewAllLabel}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      )}
    </div>
  )
}

export { SectionHeading }
