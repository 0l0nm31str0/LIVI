import Link from 'next/link'
import {
  Activity, Calendar, FileText, Package,
  CheckCircle, ArrowRight, Star, UserCircle,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-40 border-b"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <Activity className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-primary-700">LIVI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium transition-colors hover:text-primary-600"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Sign in
            </Link>
            <Link href="/login" className="btn-primary min-h-0 px-4 py-2 text-sm">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold text-primary-700 ring-1 ring-primary-100">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            Telemedicine + Pharmacy — one integrated platform
          </div>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
            Healthcare that works<br />
            <span className="text-primary-600">around your life</span>
          </h1>

          <p
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty md:text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Book a licensed physician, receive a digital prescription, and get medication delivered to your door — without the waiting room.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login" className="btn-primary gap-2 px-6 py-3 text-base">
              Book a doctor
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="btn-secondary px-6 py-3 text-base">
              For pharmacies
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {[
              'HIPAA compliant',
              'Licensed physicians',
              'Same-day prescriptions',
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-secondary-600" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features — bento grid ─────────────────────────────── */}
      <section className="px-6 py-20" style={{ background: 'var(--background)' }}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything in one workflow
            </h2>
            <p className="mt-3 text-pretty" style={{ color: 'var(--muted-foreground)' }}>
              From booking to doorstep delivery, LIVI handles every step automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Large feature card */}
            <div className="flex flex-col justify-between rounded-2xl bg-primary-700 p-8 text-white lg:col-span-2">
              <div>
                <div className="mb-6 inline-flex rounded-xl bg-primary-600 p-3">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Book a licensed doctor instantly
                </h3>
                <p className="mb-6 leading-relaxed text-primary-100">
                  Browse physicians by specialty and real-time availability. No hold music, no GP referrals needed. Confirmed in under 60 seconds.
                </p>
              </div>
              <ul className="space-y-2.5">
                {['Same-day appointments available', 'Secure video consultations', 'Board-certified in your state'].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-primary-100">
                    <CheckCircle className="h-4 w-4 shrink-0 text-primary-300" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Two stacked small cards */}
            <div className="flex flex-col gap-5">
              <div
                className="flex flex-1 flex-col rounded-2xl border p-6"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="mb-4 inline-flex self-start rounded-xl bg-secondary-50 p-3">
                  <FileText className="h-6 w-6 text-secondary-600" />
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: 'var(--foreground)' }}>
                  Digital Prescriptions
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  Your doctor writes a digital prescription instantly after the consultation — routed directly to your chosen pharmacy.
                </p>
              </div>

              <div
                className="flex flex-1 flex-col rounded-2xl border p-6"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="mb-4 inline-flex self-start rounded-xl bg-warning-50 p-3">
                  <Package className="h-6 w-6 text-warning-700" />
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: 'var(--foreground)' }}>
                  Same-day Delivery
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  Order medication with one click. Real-time tracking from the pharmacy counter to your front door.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works — clean 4-step grid ─────────────────── */}
      <section className="px-6 py-20 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-16 text-center text-3xl font-bold tracking-tight">
            How it works
          </h2>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: UserCircle,
                title: 'Create your account',
                desc: 'Sign up in under 2 minutes. Add your medical history and allergies securely.',
              },
              {
                icon: Calendar,
                title: 'Book a consultation',
                desc: 'Browse available physicians and pick a time slot. Join your video call from anywhere.',
              },
              {
                icon: FileText,
                title: 'Receive your prescription',
                desc: "Your doctor issues a digital prescription instantly — no paper, no fax, no delay.",
              },
              {
                icon: Package,
                title: 'Order and track',
                desc: 'Select a pharmacy, place your order, and track delivery in real time to your door.',
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 shadow-md">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary-500">
                  Step {i + 1}
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: 'var(--foreground)' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ─────────────────────────────────────── */}
      <section className="border-t px-6 py-16" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-4 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
            &ldquo;Got my blood pressure medication without leaving home. Took 20 minutes total.&rdquo;
          </p>
          <p className="mt-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Marcus J. — Patient since 2024
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-primary-700">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Ready to take control of your health?
          </h2>
          <p className="mt-3 text-primary-200">
            Join thousands of patients who get care on their schedule.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-primary-700 shadow-sm transition-colors hover:bg-primary-50"
          >
            Get started — it&apos;s free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer
        className="border-t px-6 py-8 text-center"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Activity className="h-4 w-4 text-primary-600" />
          <span className="font-semibold text-primary-700">LIVI</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          &copy; 2026 LIVI Health Inc. All rights reserved. HIPAA compliant.
        </p>
      </footer>
    </div>
  )
}
