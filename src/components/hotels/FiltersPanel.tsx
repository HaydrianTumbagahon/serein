import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { HotelSearchFilters } from '@/types'
import { cn } from '@/lib/utils'
import { amenityOptions, propertyTypes, ratingOptions, starOptions } from './filterOptions'

interface FiltersPanelProps {
  filters: HotelSearchFilters
  onChange: (filters: HotelSearchFilters) => void
  onClear: () => void
  onApply?: () => void
}

function FiltersPanel({ filters, onChange, onClear, onApply }: FiltersPanelProps) {
  const priceRange = filters.priceRange ?? { min: 120, max: 1200 }
  const selectedStarOption =
    starOptions.find(
      ({ values }) =>
        values.length === filters.stars?.length &&
        values.every((value) => filters.stars?.includes(value)),
    )?.value ?? null
  const selectedRating = filters.minRating ?? null

  const toggleValue = <T extends string | number>(
    values: T[] | undefined,
    value: T,
  ): T[] => {
    const current = values ?? []
    return current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
  }

  const selectStarOption = (optionValue: number | null) => {
    const option = starOptions.find((item) => item.value === optionValue)
    onChange({ ...filters, stars: option?.values })
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-heading text-2xl">Filters</h2>
          <p className="mt-1 text-xs text-muted-foreground">Narrow down your stay</p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear all
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-0 overflow-y-auto overscroll-contain py-1">
        <section className="border-b border-border py-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Price per night</h3>
              <p className="mt-1 text-xs text-muted-foreground">Choose your nightly budget</p>
            </div>
            <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">USD</span>
          </div>
          <Slider
            aria-label="Price range"
            min={120}
            max={1200}
            step={20}
            minStepsBetweenThumbs={1}
            value={[priceRange.min, priceRange.max]}
            onValueChange={([min, max]) => {
              if (min !== undefined && max !== undefined) {
                onChange({ ...filters, priceRange: { min, max } })
              }
            }}
          />
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>${priceRange.min}</span>
            <span>${priceRange.max}{priceRange.max === 1200 ? '+' : ''}</span>
          </div>
        </section>

        <FilterGroup title="Star rating">
          <div className="flex flex-wrap gap-2">
            <ChipButton selected={!selectedStarOption} onClick={() => selectStarOption(null)}>
              Any
            </ChipButton>
            {starOptions.map((option) => (
              <ChipButton
                key={option.value}
                selected={selectedStarOption === option.value}
                onClick={() => selectStarOption(option.value)}
              >
                {option.label}
              </ChipButton>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Property type">
          <div className="space-y-3">
            {propertyTypes.map((type) => (
              <label key={type} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                <Checkbox
                  checked={filters.propertyTypes?.includes(type) ?? false}
                  onCheckedChange={() =>
                    onChange({
                      ...filters,
                      propertyTypes: toggleValue(filters.propertyTypes, type),
                    })
                  }
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Amenities">
          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-1">
            {amenityOptions.map(({ id, label, icon: Icon }) => (
              <label key={id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                <Checkbox
                  checked={filters.amenities?.includes(id) ?? false}
                  onCheckedChange={() =>
                    onChange({
                      ...filters,
                      amenities: toggleValue(filters.amenities, id),
                    })
                  }
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} aria-label={label}>
                      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
                <span>{label}</span>
              </label>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title="Guest rating">
          <div className="flex flex-wrap gap-2">
            <ChipButton
              selected={selectedRating === null}
              onClick={() => onChange({ ...filters, minRating: undefined })}
            >
              Any
            </ChipButton>
            {ratingOptions.map(({ label, value }) => (
              <ChipButton
                key={value}
                selected={selectedRating === value}
                onClick={() => onChange({ ...filters, minRating: value })}
              >
                {label}
              </ChipButton>
            ))}
          </div>
        </FilterGroup>
      </div>

      {onApply && (
        <div className="border-t border-border pt-4">
          <Button type="button" className="w-full" onClick={onApply}>
            Apply filters
          </Button>
        </div>
      )}
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border py-5 last:border-0">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {children}
    </section>
  )
}

function ChipButton({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'min-h-11 rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        selected
          ? 'border-foreground bg-foreground text-background'
          : 'border-border text-muted-foreground hover:border-accent hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

export { FiltersPanel }
