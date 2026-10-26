import type { Metadata } from 'next'
import SereinSpa from '../serein-spa'

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

const pageMetadata: Record<string, { title: string; description: string }> = {
  '': {
    title: 'Serein',
    description: 'Find a thoughtful hotel, villa, or retreat for your next journey.',
  },
  hotels: {
    title: 'Serein',
    description: 'Browse hotels, villas, and retreats selected for their character.',
  },
  about: {
    title: 'Serein',
    description: 'Learn about the people and perspective behind Serein.',
  },
  contact: {
    title: 'Serein',
    description: 'Get in touch with the Serein guest experience team.',
  },
  faq: {
    title: 'Serein',
    description: 'Find answers about bookings, stays, payments, and your Serein account.',
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params
  const metadata = pageMetadata[slug[0] ?? ''] ?? { title: 'Serein', description: pageMetadata[''].description }
  return metadata
}

export default function Page() {
  return <SereinSpa />
}
