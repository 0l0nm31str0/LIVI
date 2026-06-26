import Link from 'next/link'

const footerLinks = {
  Product: [
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Services', href: '/#services' },
    { label: 'Sign in', href: '/login' },
  ],
  Company: [
    { label: 'About', href: '/' },
    { label: 'Careers', href: '/' },
    { label: 'Contact', href: '/' },
  ],
  Legal: [
    { label: 'Privacy', href: '/' },
    { label: 'Terms', href: '/' },
    { label: 'HIPAA', href: '/' },
  ],
}

export function SiteFooter() {
  return (
    <footer className="section-ink border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="font-display text-2xl font-semibold text-on-ink">
              LIVI
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-on-ink-muted">
              Telemedicine and pharmacy delivery — one connected journey from consult to doorstep.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-on-ink-muted">
                {heading}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-on-ink-muted transition-colors hover:text-on-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-on-ink-muted">
            &copy; {new Date().getFullYear()} LIVI Health. All rights reserved.
          </p>
          <p className="text-xs text-on-ink-muted">HIPAA compliant · Licensed providers</p>
        </div>
      </div>
    </footer>
  )
}
