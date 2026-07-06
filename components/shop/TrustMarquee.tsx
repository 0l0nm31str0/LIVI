'use client'

const BADGES = [
  '503A Compounded Pharmacy',
  'Licensed US Physicians',
  'Discreet Packaging',
  'Free Shipping',
  'HIPAA Compliant',
  'Clinical Review Included',
  'Cancel Anytime',
  'US-Licensed Providers',
]

export function TrustMarquee() {
  const doubled = [...BADGES, ...BADGES]

  return (
    <div className="relative overflow-hidden border-y border-border bg-muted/30 py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((badge, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <span className="h-1 w-1 rounded-full bg-[#E85A2B]" aria-hidden />
            {badge}
          </span>
        ))}
      </div>
    </div>
  )
}
