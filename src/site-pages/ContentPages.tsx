import { zodResolver } from '@hookform/resolvers/zod'
import { useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import {
  ArrowRight,
  Compass,
  Mail,
  MapPin,
  Phone,
  Search,
  Clock3,
} from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Container } from '@/components/shared/Container'
import { PageHeader } from '@/components/shared/PageHeader'
import { Reveal } from '@/components/shared/Reveal'
import { CTABanner } from '@/components/home/CTABanner'

const faqCategories = ['All', 'Booking', 'Payments', 'Cancellations', 'Account', 'Stays'] as const
type FaqCategory = (typeof faqCategories)[number]

const faqItems: Array<{ category: Exclude<FaqCategory, 'All'>; question: string; answer: string }> = [
  { category: 'Booking', question: 'How do I make a reservation?', answer: 'Choose a destination and dates, compare the stays that suit you, then select a room and complete the guest and payment details. Your reference and stay details appear on the confirmation page.' },
  { category: 'Booking', question: 'Can I change the dates after booking?', answer: 'Date changes depend on the property and room availability. Open your booking details and contact our team with the dates you have in mind; we will help you understand the available options.' },
  { category: 'Booking', question: 'When will I receive my confirmation?', answer: 'A confirmation is shown as soon as a reservation is completed. In this demonstration experience, it is saved in your account on the current device.' },
  { category: 'Payments', question: 'Which payment methods can I use?', answer: 'The checkout form demonstrates card entry only. It does not connect to a payment provider and does not process or store real card details.' },
  { category: 'Payments', question: 'Are taxes included in the displayed total?', answer: 'The checkout summary lists the room subtotal separately from a 12% estimate for taxes and fees. Final charges at a real property may differ.' },
  { category: 'Payments', question: 'Is it safe to enter my card details?', answer: 'This is a front-end demo. Do not enter real payment information: card details are validated in your browser and are not saved or transmitted.' },
  { category: 'Cancellations', question: 'How can I cancel a reservation?', answer: 'Sign in, open My Bookings, and choose Cancel booking on an upcoming reservation. Cancellation terms for a real stay would be set by the property.' },
  { category: 'Cancellations', question: 'Will I receive a refund after cancelling?', answer: 'Refund eligibility and timing vary by room rate and property. Review the cancellation policy attached to the stay and contact support if anything is unclear.' },
  { category: 'Cancellations', question: 'Can I cancel a booking from my account?', answer: 'Yes. Upcoming reservations have a cancellation action in the My Bookings area. Cancelled stays remain visible in the Cancelled tab.' },
  { category: 'Account', question: 'How do I update my profile?', answer: 'Open Profile Settings in your account to edit your name, email, and phone number, and to choose your newsletter and appearance preferences.' },
  { category: 'Account', question: 'Where can I find my saved stays?', answer: 'Use the heart on a hotel card to save or remove a stay. Your saved places are collected under Wishlist while signed in.' },
  { category: 'Account', question: 'Can I delete my account?', answer: 'The Profile Settings page includes a confirmation step for deleting your simulated account. Existing local booking records are retained in this demo.' },
  { category: 'Stays', question: 'What time are check-in and check-out?', answer: 'Unless a property states otherwise, the summary uses a 3:00 PM check-in and an 11:00 AM check-out. Ask your property directly about early arrival or a later departure.' },
  { category: 'Stays', question: 'Are all amenities available year-round?', answer: 'Amenity availability can vary by season, maintenance, and room type. Confirm any essential facilities with the property before you travel.' },
  { category: 'Stays', question: 'Can I bring a pet?', answer: 'Pet policies differ between stays. Use the pet-friendly amenity to narrow your search, then confirm the property’s current policy and any applicable fees.' },
]

function AboutPage() {
  const values = [
    { title: 'Care over volume', description: 'We choose places for how they make a guest feel, not for how many rooms they can offer.' },
    { title: 'A sense of place', description: 'The best stays let you belong, even briefly, to the streets, landscape, and rhythms around you.' },
    { title: 'Clarity at every step', description: 'Thoughtful details and honest information should make planning feel lighter.' },
    { title: 'Room to breathe', description: 'We believe travel can be considered, unhurried, and generous to the places it touches.' },
  ]

  return (
    <>
      <section className="relative isolate flex min-h-[470px] items-end overflow-hidden bg-[#252724] text-white sm:min-h-[560px]">
        <Image
          src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2200&q=85"
          alt="A quiet mountain lake beneath soft morning light"
          width={2200}
          height={1400}
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        <Container className="pb-14 pt-36 sm:pb-20">
          <Reveal>
            <h1 className="max-w-3xl font-heading text-5xl leading-[1.05] sm:text-7xl">
              Make room for what matters.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
              Serein brings together places with soul and the people who make a stay feel like it was chosen just for you.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h2 className="font-heading text-4xl leading-tight sm:text-5xl">Good travel begins with a feeling.</h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  Serein began with a simple question: what if finding somewhere to stay felt as considered as being there? We wanted a smaller, more human way to discover a place for a pause, a celebration, or a change of scene.
                </p>
                <p>
                  So we started listening—to hosts, returning guests, and the people who know a neighborhood by its first light. The collection grew slowly, guided by warmth, a strong sense of place, and the quiet details that linger after a journey.
                </p>
                <p>
                  Today, Serein is still shaped by that first idea. We make the search feel clear, the choices feel personal, and the journey toward your next stay feel a little more like the beginning of it.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1300&q=82"
                  alt="A warm, intimate hotel courtyard framed by greenery"
                  width={1300}
                  height={975}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="aspect-[4/3] w-full rounded-3xl object-cover"
                />
                <p className="absolute -bottom-5 left-5 max-w-xs rounded-2xl border border-border bg-card px-5 py-4 text-sm leading-6 shadow-lg sm:left-8">
                  “A stay should be more than a place to sleep. It should help you feel somewhere.”
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-secondary/35 py-20 sm:py-24">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-4xl sm:text-5xl">A few things we hold close.</h2>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ title, description }, index) => (
              <Reveal key={title} delay={index * 0.05}>
                <article className="h-full rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-heading text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <StatsSection />

      <CTABanner />
    </>
  )
}

function StatsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.25 })
  const reduceMotion = useReducedMotion()
  const stats = [
    { value: 8, suffix: '', label: 'considered destinations' },
    { value: 24, suffix: '+', label: 'distinctive stays' },
    { value: 50, suffix: 'k+', label: 'travelers inspired' },
    { value: 4.9, suffix: '/5', label: 'average guest rating', decimals: 1 },
  ]
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!inView || reduceMotion) return
    const startedAt = performance.now()
    let frame = 0
    const animate = (now: number) => {
      const next = Math.min((now - startedAt) / 1000, 1)
      setProgress(1 - (1 - next) ** 3)
      if (next < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduceMotion])
  const visibleProgress = reduceMotion && inView ? 1 : progress

  return (
    <section ref={ref} className="py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-border bg-card px-6 py-9 sm:grid-cols-4 sm:px-10">
          {stats.map(({ value, suffix, label, decimals = 0 }) => (
            <div key={label} className="text-center">
              <p className="font-heading text-4xl tabular-nums sm:text-5xl">
                {(value * visibleProgress).toFixed(decimals)}{suffix}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  email: z.email('Please enter a valid email address.'),
  subject: z.string().min(1, 'Choose a subject.'),
  message: z.string().trim().min(10, 'Please share a little more detail.').max(1000, 'Please keep your message under 1,000 characters.'),
})
type ContactValues = z.infer<typeof contactSchema>

function ContactPage() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })
  const submit = handleSubmit(async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 250))
    toast.success('Your note is on its way. We’ll be in touch soon.')
    reset()
  })

  return (
    <>
      <PageHeader
        title="We’re here to help."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        subtitle="A question, a little feedback, or help with a stay—send us a note and a real person will be glad to help."
      />
      <Container className="py-12 sm:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-12">
          <Reveal>
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-8">
              <h2 className="font-heading text-3xl">How can we make things easier?</h2>
              <form onSubmit={submit} noValidate className="mt-6 space-y-5">
                <ContactField id="contact-name" label="Your name" error={errors.name?.message}>
                  <Input id="contact-name" autoComplete="name" placeholder="Your name" className="mt-2 h-10" aria-invalid={Boolean(errors.name)} {...register('name')} />
                </ContactField>
                <ContactField id="contact-email" label="Email address" error={errors.email?.message}>
                  <Input id="contact-email" type="email" autoComplete="email" placeholder="you@example.com" className="mt-2 h-10" aria-invalid={Boolean(errors.email)} {...register('email')} />
                </ContactField>
                <ContactField id="contact-subject" label="Subject" error={errors.subject?.message}>
                  <Controller
                    control={control}
                    name="subject"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="contact-subject" aria-invalid={Boolean(errors.subject)} className="mt-2 h-11 w-full bg-background">
                          <SelectValue placeholder="Choose a subject" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="booking" className="min-h-11">A booking</SelectItem>
                          <SelectItem value="change" className="min-h-11">Changing a stay</SelectItem>
                          <SelectItem value="payment" className="min-h-11">Payment question</SelectItem>
                          <SelectItem value="feedback" className="min-h-11">Feedback</SelectItem>
                          <SelectItem value="other" className="min-h-11">Something else</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </ContactField>
                <ContactField id="contact-message" label="Your message" error={errors.message?.message}>
                  <Textarea id="contact-message" rows={5} placeholder="Tell us a little about how we can help…" className="mt-2 min-h-32 resize-y" aria-invalid={Boolean(errors.message)} {...register('message')} />
                </ContactField>
                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? 'Sending…' : 'Send message'}
                  <ArrowRight aria-hidden="true" />
                </Button>
              </form>
            </section>
          </Reveal>
          <Reveal delay={0.08}>
            <aside className="space-y-5">
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-heading text-3xl">A friendly voice, close by.</h2>
                <div className="mt-5 space-y-4">
                  <ContactDetail icon={Mail} label="Email" value="hello@serein.example" href="mailto:hello@serein.example" />
                  <ContactDetail icon={Phone} label="Phone" value="+1 (800) 555-0148" href="tel:+18005550148" />
                  <ContactDetail icon={MapPin} label="Studio" value="18 Mercer Street, New York, NY 10013" />
                  <ContactDetail icon={Clock3} label="Office hours" value="Monday–Friday, 9 AM–6 PM ET" />
                </div>
              </section>
              <div className="relative flex min-h-52 items-center justify-center overflow-hidden rounded-2xl border border-border bg-[radial-gradient(ellipse_at_50%_45%,rgba(198,168,124,0.24),transparent_60%),linear-gradient(135deg,var(--muted),var(--background))]">
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:32px_32px]" />
                <span className="relative flex flex-col items-center text-center">
                  <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg"><MapPin className="size-5" aria-hidden="true" /></span>
                  <span className="mt-3 rounded-full bg-card/90 px-3 py-1.5 text-xs shadow-sm">Lower Manhattan · New York</span>
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4">
                <span className="text-sm font-medium">Find us elsewhere</span>
                <div className="flex gap-2">
                  <SocialAnchor label="Instagram" href="https://www.instagram.com/" mark="ig" />
                  <SocialAnchor label="Facebook" href="https://www.facebook.com/" mark="f" />
                  <SocialAnchor label="X" href="https://x.com/" mark="𝕏" />
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </Container>
    </>
  )
}

function ContactField({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  )
}

function ContactDetail({ icon: Icon, label, value, href }: { icon: typeof Mail; label: string; value: string; href?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-foreground dark:text-accent"><Icon className="size-4" aria-hidden="true" /></span>
      <span><span className="block text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>{href ? <a href={href} className="mt-1 block text-sm transition-colors hover:text-accent-foreground dark:hover:text-accent">{value}</a> : <span className="mt-1 block text-sm">{value}</span>}</span>
    </div>
  )
}

function SocialAnchor({ label, href, mark }: { label: string; href: string; mark: string }) {
  return <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="flex size-8 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground hover:border-accent hover:text-foreground">{mark}</a>
}

function FaqPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<FaqCategory>('All')
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return faqItems.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category
      const matchesQuery = !normalized || `${item.question} ${item.answer} ${item.category}`.toLowerCase().includes(normalized)
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  return (
    <>
      <PageHeader
        title="Questions, answered."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
        subtitle="A few helpful details for planning, booking, and feeling ready to go."
      />
      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <label htmlFor="faq-search" className="sr-only">Search frequently asked questions</label>
          <div className="relative">
            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="faq-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a question or topic…" className="h-12 rounded-full pl-11 pr-5" />
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Filter questions by category">
            {faqCategories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  category === item
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? 'answer' : 'answers'}</p>
          {filtered.length ? (
            <Accordion type="single" collapsible className="mt-3">
              {filtered.map((item, index) => (
                <AccordionItem key={item.question} value={`question-${index}`} className="border-b border-border">
                  <AccordionTrigger className="py-5 text-left text-sm sm:text-base">{item.question}</AccordionTrigger>
                  <AccordionContent className="max-w-2xl pb-5 text-sm leading-7 text-muted-foreground">
                    <p>{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
              <p className="font-heading text-2xl">No answers found</p>
              <p className="mt-2 text-sm text-muted-foreground">Try another phrase or choose a different topic.</p>
              <Button type="button" variant="secondary" className="mt-4" onClick={() => { setQuery(''); setCategory('All') }}>Clear search</Button>
            </div>
          )}
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-secondary/40 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="mt-2 font-heading text-3xl">Still need help?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tell us what’s on your mind. We’ll help you find the next step.</p>
            </div>
            <Button asChild><Link to="/contact">Contact us<ArrowRight aria-hidden="true" /></Link></Button>
          </div>
        </div>
      </Container>
    </>
  )
}

interface LegalSection {
  title: string
  paragraphs: string[]
}

const privacySections: LegalSection[] = [
  { title: 'Information we collect', paragraphs: ['This sample notice describes, in general terms, the information a travel service may receive when you browse, create an account, save a stay, or make a reservation. It may include contact details, booking preferences, and information you choose to provide.', 'This front-end demonstration stores account and booking examples in your browser. It does not send those details to a Serein server. Do not enter sensitive or real payment information.'] },
  { title: 'How information may be used', paragraphs: ['In a real service, information could be used to present search results, support a reservation, respond to a request, maintain account preferences, and improve the reliability of the experience.', 'Information should only be used for purposes that are explained to you and permitted by applicable law.'] },
  { title: 'Sharing and service providers', paragraphs: ['A real booking service may need to share limited information with a selected property, payment processor, or service provider so a requested stay can be arranged. Providers should be expected to protect information and use it only for agreed purposes.', 'Serein does not transmit information entered in this demonstration.'] },
  { title: 'Cookies and local storage', paragraphs: ['Websites commonly use browser storage to remember preferences and support essential functionality. This demo uses local storage for theme, wishlist, mock account, search, and booking data.', 'You can remove this locally stored information through your browser settings. Clearing it may remove saved demo bookings and preferences.'] },
  { title: 'Data retention and security', paragraphs: ['In a production service, information would be retained only as needed for the disclosed purposes, legal obligations, and service operations. Appropriate technical and organizational safeguards should be used, while recognizing that no online system can promise absolute security.', 'Because this is a local-only prototype, its data remains on the device and browser profile where it was entered.'] },
  { title: 'Your choices and rights', paragraphs: ['Depending on where you live, you may have rights to request access, correction, deletion, portability, or limits on certain uses of personal information. You may also be able to withdraw consent where processing relies on consent.', 'For a real service, a contact channel should be provided to submit such requests and receive a response within applicable time limits.'] },
  { title: 'Children and policy changes', paragraphs: ['This travel experience is intended for adults arranging travel and is not designed to collect information directly from children.', 'A service may update its privacy notice as its practices or legal requirements change. Material changes should be communicated in a suitable way, with an updated date shown here.'] },
  { title: 'Contact', paragraphs: ['Questions about this sample privacy notice can be directed to hello@serein.example. This address is illustrative and is not a production privacy-request channel.'] },
]

const termsSections: LegalSection[] = [
  { title: 'Using this service', paragraphs: ['This sample terms document describes general conditions that might apply to a travel discovery and booking service. By using a real service, visitors would be expected to provide accurate information and use it only for lawful purposes.', 'This website is a front-end demonstration. Listings, availability, prices, accounts, reservations, and payment interactions are illustrative and do not create a real booking contract.'] },
  { title: 'Accounts and eligibility', paragraphs: ['A production account should be used by the person to whom it belongs, with accurate contact information kept current. You would be responsible for activity performed through your account and for protecting access to it.', 'The sign-in experience here is simulated. No password is sent to or stored by a server.'] },
  { title: 'Listings and reservations', paragraphs: ['In a real booking service, property descriptions, room features, availability, and rates are supplied or confirmed by the property and may change. A reservation becomes binding only after the service and property confirm it under the applicable booking terms.', 'The sample stays and confirmation references on this site are mock data and cannot be used to obtain accommodation.'] },
  { title: 'Prices and payment', paragraphs: ['A production checkout would show the applicable price, taxes, fees, currency, and payment timing before the guest confirms. Payment processing would be handled through an appropriately secured payment provider.', 'The checkout in this demo does not charge a payment method. Never enter real card details. Displayed totals and tax estimates are examples only.'] },
  { title: 'Changes and cancellations', paragraphs: ['Changes, cancellations, and refunds for a real stay would be governed by the rate and property policy disclosed before booking. Contact the property or booking service promptly if travel plans change.', 'The cancel action in this demo only changes the locally stored mock booking status.'] },
  { title: 'Acceptable conduct and content', paragraphs: ['Users should not interfere with service operation, misuse another person’s account, submit unlawful content, or attempt to access systems without authorization. Any content you submit should be accurate and should not infringe another person’s rights.', 'A production service may take reasonable steps to protect guests, hosts, and the integrity of its platform.'] },
  { title: 'Availability, liability, and changes', paragraphs: ['A production service would describe its availability commitments and limitations of liability in a way that complies with applicable law. Nothing in a sample notice can limit rights that cannot legally be limited.', 'Terms may be revised from time to time. A real service should publish the effective date and communicate material changes where appropriate.'] },
  { title: 'Contact and governing terms', paragraphs: ['For a real service, the terms should identify the legal entity operating it, its notice address, and the applicable governing law and dispute process. Those details are intentionally not specified in this generic placeholder.', 'Questions about this prototype can be sent to hello@serein.example.'] },
]

function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const sections = type === 'privacy' ? privacySections : termsSections
  const title = type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'
  const updated = 'October 26, 2026'
  return (
    <>
      <PageHeader title={title} breadcrumb={[{ label: 'Home', href: '/' }, { label: title }]} subtitle="A clear, considered guide to how this experience works." />
      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <aside className="h-fit lg:sticky lg:top-28">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">On this page</p>
            <nav aria-label={`${title} contents`} className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
              {sections.map((section, index) => (
                <a key={section.title} href={`#legal-${index + 1}`} className="shrink-0 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  {String(index + 1).padStart(2, '0')} · {section.title}
                </a>
              ))}
            </nav>
          </aside>
          <article className="max-w-prose">
            <p className="mb-8 text-xs text-muted-foreground">Last updated {updated}</p>
            <p className="mb-8 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm leading-6 text-muted-foreground">
              {type === 'privacy'
                ? 'This is generic placeholder text for a design prototype, not legal advice or a complete privacy notice. It does not describe an operating booking service.'
                : 'This is generic placeholder text for a design prototype, not legal advice or a binding agreement. It does not establish terms for a real booking service.'}
            </p>
            <div className="space-y-10">
              {sections.map((section, index) => (
                <section key={section.title} id={`legal-${index + 1}`} className="scroll-mt-28">
                  <h2 className="font-heading text-2xl sm:text-3xl">{String(index + 1).padStart(2, '0')}. {section.title}</h2>
                  <div className="mt-3 space-y-4 text-sm leading-7 text-muted-foreground">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </Container>
    </>
  )
}

function PrivacyPage() {
  return <LegalPage type="privacy" />
}

function TermsPage() {
  return <LegalPage type="terms" />
}

function NotFoundPage() {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,rgba(198,168,124,0.16),transparent_55%)]" />
      <Container className="py-20 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent-foreground dark:text-accent">
          <Compass className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-heading text-5xl sm:text-7xl">This page wandered off.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
          The address may have changed, but somewhere lovely is still waiting.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild><Link to="/">Back to Home</Link></Button>
          <Button asChild variant="secondary"><Link to="/hotels"><Search aria-hidden="true" /> Search hotels</Link></Button>
        </div>
      </Container>
    </section>
  )
}

export { AboutPage, ContactPage, FaqPage, NotFoundPage, PrivacyPage, TermsPage }
