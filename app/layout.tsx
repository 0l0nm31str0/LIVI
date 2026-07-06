import type { Metadata } from 'next'
import { Instrument_Sans, Bricolage_Grotesque, Cormorant_Garamond } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: false,
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: false,
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: 'LIVI — The Longevity Club',
  description: 'Prescription treatments and wellness products, delivered.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${bricolage.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
