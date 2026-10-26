import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
const currentYear = new Date().getFullYear()

const quickLinks = [
  { label: 'Hotels', to: '/hotels' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
]

const supportLinks = [
  { label: 'Help Center', to: '/faq' },
  { label: 'Cancellation Policy', to: '/faq' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
]

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.9fr] lg:px-10 lg:py-16">
        <div>
          <Link to="/" className="font-heading text-3xl font-medium tracking-[0.08em]">
            Serein
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
            Thoughtfully found stays for the moments you want to keep.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <SocialLink label="Instagram" href="https://www.instagram.com/">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className="size-4">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="18" cy="6" r="0.8" fill="currentColor" stroke="none" />
              </svg>
            </SocialLink>
            <SocialLink label="Facebook" href="https://www.facebook.com/">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
                <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
              </svg>
            </SocialLink>
            <SocialLink label="X" href="https://x.com/">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
                <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 13.8 4.8 22H1.7l7.3-8.4L1.2 2h6.5l4.5 7.5L18.9 2Zm-1.1 18h1.7L6.7 3.9H4.9L17.8 20Z" />
              </svg>
            </SocialLink>
            <SocialLink label="YouTube" href="https://www.youtube.com/">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
              </svg>
            </SocialLink>
          </div>
        </div>

        <FooterLinks title="Quick Links" links={quickLinks} />
        <FooterLinks title="Support" links={supportLinks} />

      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>© {currentYear} Serein. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

interface FooterLink {
  label: string
  to: string
}

function FooterLinks({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link
              to={to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({
  label,
  href,
  children,
}: {
  label: string
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {children}
    </a>
  )
}

export { Footer }
