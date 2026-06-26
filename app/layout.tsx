import type { Metadata } from 'next'
import { Instrument_Sans, Newsreader } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: false,
})

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: 'LIVI — Telemedicine & Pharmacy',
  description: 'Book doctors, get prescriptions, delivered to your door.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${newsreader.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
