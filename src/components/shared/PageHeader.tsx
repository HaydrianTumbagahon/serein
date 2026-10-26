import { Link } from 'react-router-dom'
import { Container } from '@/components/shared/Container'

interface PageHeaderProps {
  title: string
  breadcrumb: Array<{ label: string; href?: string }>
  subtitle?: string
}

function PageHeader({ title, breadcrumb, subtitle }: PageHeaderProps) {
  return (
    <div className="border-b border-border/70 bg-secondary/35">
      <Container className="py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-5 text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumb.map((item, index) => (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden="true">/</span>}
                {item.href ? (
                  <Link to={item.href} className="transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-foreground">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        )}
      </Container>
    </div>
  )
}

export { PageHeader }
