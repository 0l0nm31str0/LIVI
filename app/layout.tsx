import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LIVI - Telemedicine & Pharmacy',
  description: 'Book doctors, get prescriptions, delivered to your door.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
