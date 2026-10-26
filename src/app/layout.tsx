import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '../index.css'

export const metadata: Metadata = {
  title: 'Serein',
  description:
    'Thoughtfully found stays for the moments you want to keep. Discover considered hotels, villas, and retreats with Serein.',
  openGraph: {
    type: 'website',
    title: 'Serein',
    description: 'Thoughtfully found stays for the moments you want to keep.',
    images: [
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#f8f7f4',
}

function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const saved=JSON.parse(localStorage.getItem('serein-theme')||'null');const theme=saved?.state?.theme||'system';document.documentElement.classList.toggle('dark',theme==='dark'||(theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches))}catch{document.documentElement.classList.toggle('dark',matchMedia('(prefers-color-scheme: dark)').matches)}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
