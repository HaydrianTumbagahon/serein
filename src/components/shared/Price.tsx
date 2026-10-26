import { cn } from '@/lib/utils'

interface PriceProps {
  amount: number
  className?: string
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function Price({ amount, className }: PriceProps) {
  return (
    <span className={cn('inline-flex items-baseline gap-1.5', className)}>
      <span className="font-semibold tabular-nums">{usdFormatter.format(amount)}</span>
      <span className="text-xs font-normal text-muted-foreground">/ night</span>
    </span>
  )
}

export { Price }
