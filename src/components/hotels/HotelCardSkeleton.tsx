function HotelCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-border/80 bg-card"
    >
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-7 w-full animate-pulse rounded bg-muted" />
        <div className="flex justify-between border-t border-border pt-4">
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-16 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  )
}

export { HotelCardSkeleton }
