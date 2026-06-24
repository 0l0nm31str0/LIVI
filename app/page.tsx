import Link from 'next/link'
import {
  Activity, Calendar, FileText, Package,
  CheckCircle, ArrowRight, Shield, Clock, Video,
  Pill, ChevronRight, Star,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#FFFFFF', color: '#0F172A' }}>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-40 border-b"
        style={{ background: 'rgba(255,255,255,0.95)', borderColor: '#E2E8F0', backdropFilter: 'blur(8px)' }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: '#0891B2' }}>
              <Activity className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold" style={{ color: '#0891B2', fontFamily: 'Figtree, system-ui, sans-serif' }}>LIVI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium transition-colors"
              style={{ color: '#64748B' }}
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{ background: '#0891B2' }}
            >
              Get started
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ background: '#0A1628' }} className="px-6 py-20 md:py-28 overflow-hidden">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* Left: Copy */}
            <div>
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{ background: 'rgba(8,145,178,0.15)', color: '#22D3EE', border: '1px solid rgba(8,145,178,0.3)' }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#22D3EE' }} />
                Telemedicine + Pharmacy, integrated
              </div>

              <h1
                className="mb-6 font-bold leading-[1.08] tracking-tight"
                style={{
                  color: '#F8FAFC',
                  fontFamily: 'Figtree, system-ui, sans-serif',
                  fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                  textWrap: 'balance',
                }}
              >
                Your doctor.<br />
                Your prescription.<br />
                <span style={{ color: '#22D3EE' }}>Your door.</span>
              </h1>

              <p
                className="mb-8 text-base leading-relaxed max-w-md"
                style={{ color: '#94A3B8' }}
              >
                Book a licensed physician in seconds, get a digital prescription, and have your medication delivered same day — no waiting rooms, no paper, no friction.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{ background: '#0891B2' }}
                >
                  Book a doctor
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
                  style={{ color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  For pharmacies
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-5" style={{ color: '#64748B' }}>
                {[
                  { icon: Shield, label: 'HIPAA compliant' },
                  { icon: CheckCircle, label: 'Board-certified physicians' },
                  { icon: Clock, label: 'Confirmed in <60 seconds' },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#94A3B8' }}>
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: '#22D3EE' }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Floating UI Mockup */}
            <div className="relative hidden lg:flex items-center justify-center">
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'radial-gradient(ellipse at 50% 50%, rgba(8,145,178,0.15) 0%, transparent 70%)',
                  filter: 'blur(24px)',
                }}
              />

              {/* Main card */}
              <div
                className="relative w-full max-w-sm rounded-2xl p-5 shadow-2xl"
                style={{ background: '#0F2235', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>Book Appointment</span>
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: 'rgba(34,211,238,0.15)', color: '#22D3EE' }}>Today</span>
                </div>

                {/* Doctor card */}
                <div className="mb-4 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold text-sm" style={{ background: '#0891B2', color: 'white' }}>SC</div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>Dr. Sarah Chen</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>General Practice · 4.9 ★</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-xs" style={{ color: '#4ADE80' }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#4ADE80' }} />
                      Available
                    </div>
                  </div>
                </div>

                {/* Time slots */}
                <p className="mb-2 text-xs font-medium" style={{ color: '#64748B' }}>Select a time</p>
                <div className="space-y-2 mb-4">
                  {[
                    { time: 'Today, 3:00 PM', selected: true },
                    { time: 'Today, 4:30 PM', selected: false },
                    { time: 'Tomorrow, 9:00 AM', selected: false },
                  ].map(({ time, selected }) => (
                    <div
                      key={time}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
                      style={{
                        background: selected ? 'rgba(8,145,178,0.2)' : 'rgba(255,255,255,0.04)',
                        border: selected ? '1px solid rgba(8,145,178,0.5)' : '1px solid rgba(255,255,255,0.06)',
                        color: selected ? '#22D3EE' : '#94A3B8',
                      }}
                    >
                      {time}
                      {selected && <CheckCircle className="h-3.5 w-3.5" style={{ color: '#22D3EE' }} />}
                    </div>
                  ))}
                </div>

                <button
                  className="w-full rounded-xl py-2.5 text-sm font-semibold text-white"
                  style={{ background: '#0891B2' }}
                >
                  Confirm Booking
                </button>
              </div>

              {/* Floating badge */}
              <div
                className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium shadow-lg"
                style={{ background: '#0F2235', border: '1px solid rgba(74,222,128,0.3)', color: '#4ADE80' }}
              >
                <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                Prescription sent to pharmacy
              </div>

              {/* Second floating badge */}
              <div
                className="absolute -top-4 -right-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium shadow-lg"
                style={{ background: '#0F2235', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8' }}
              >
                <Video className="h-3.5 w-3.5 shrink-0" style={{ color: '#22D3EE' }} />
                Video consult · 12 min
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <section className="border-y px-6 py-10" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-3 divide-x" style={{ borderColor: '#E2E8F0' }}>
            {[
              { value: '50k+', label: 'Patients served' },
              { value: '300+', label: 'Licensed physicians' },
              { value: '<60s', label: 'Average booking time' },
            ].map(({ value, label }) => (
              <div key={label} className="px-6 text-center first:pl-0 last:pr-0">
                <p
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: '#0891B2', fontFamily: 'Figtree, system-ui, sans-serif' }}
                >
                  {value}
                </p>
                <p className="mt-1 text-sm" style={{ color: '#64748B' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-xl">
            <h2
              className="mb-3 text-3xl font-bold tracking-tight"
              style={{ color: '#0F172A', fontFamily: 'Figtree, system-ui, sans-serif' }}
            >
              Healthcare that fits your life
            </h2>
            <p className="text-base leading-relaxed" style={{ color: '#64748B' }}>
              Book, consult, prescribe, and deliver — all in one seamless workflow.
            </p>
          </div>

          {/* Asymmetric feature grid */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Large card — spans 3 cols */}
            <div
              className="flex flex-col justify-between rounded-2xl p-8 lg:col-span-3"
              style={{ background: '#0A1628', color: 'white' }}
            >
              <div>
                <div className="mb-6 inline-flex rounded-xl p-3" style={{ background: 'rgba(8,145,178,0.2)' }}>
                  <Calendar className="h-6 w-6" style={{ color: '#22D3EE' }} />
                </div>
                <h3 className="mb-3 text-xl font-semibold" style={{ color: '#F8FAFC', fontFamily: 'Figtree, system-ui, sans-serif' }}>
                  Licensed doctors, available now
                </h3>
                <p className="mb-6 leading-relaxed text-sm" style={{ color: '#94A3B8' }}>
                  Browse physicians by specialty and real-time availability. No hold music, no referrals. Confirmed in under 60 seconds from any device.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Same-day slots',
                  'Secure video consult',
                  'Multi-specialty',
                  'State-licensed',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm" style={{ color: '#CBD5E1' }}>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#22D3EE' }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — 2 stacked cards, spans 2 cols */}
            <div className="flex flex-col gap-5 lg:col-span-2">
              <div
                className="flex flex-1 flex-col rounded-2xl border p-6"
                style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}
              >
                <div className="mb-4 inline-flex self-start rounded-xl p-3" style={{ background: '#ECFEFF' }}>
                  <FileText className="h-5 w-5" style={{ color: '#0891B2' }} />
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: '#0F172A', fontFamily: 'Figtree, system-ui, sans-serif' }}>
                  Digital Prescriptions
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
                  Your doctor issues a digital prescription instantly — routed directly to your pharmacy, no paper required.
                </p>
              </div>

              <div
                className="flex flex-1 flex-col rounded-2xl border p-6"
                style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}
              >
                <div className="mb-4 inline-flex self-start rounded-xl p-3" style={{ background: '#FEF3C7' }}>
                  <Package className="h-5 w-5" style={{ color: '#D97706' }} />
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: '#0F172A', fontFamily: 'Figtree, system-ui, sans-serif' }}>
                  Same-day Delivery
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
                  Order with one tap. Real-time tracking from the pharmacy counter to your front door.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="mx-auto max-w-5xl">
          <h2
            className="mb-16 text-3xl font-bold tracking-tight"
            style={{ color: '#0F172A', fontFamily: 'Figtree, system-ui, sans-serif' }}
          >
            From sign-up to delivery
          </h2>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div
              className="absolute top-6 left-6 right-6 hidden lg:block"
              style={{ height: '1px', background: 'linear-gradient(to right, #0891B2, #22D3EE, #06B6D4, #0891B2)' }}
            />

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Activity,
                  title: 'Create your account',
                  desc: 'Sign up in 2 minutes. Add your medical history and insurance securely.',
                },
                {
                  icon: Video,
                  title: 'Book a consultation',
                  desc: 'Pick a physician, choose a slot, and join your video call from anywhere.',
                },
                {
                  icon: Pill,
                  title: 'Get your prescription',
                  desc: 'Your doctor issues a digital prescription instantly after the consultation.',
                },
                {
                  icon: Package,
                  title: 'Receive your medication',
                  desc: 'Order from a pharmacy and track delivery in real time to your door.',
                },
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col">
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl shadow-md relative z-10"
                    style={{ background: '#0891B2' }}
                  >
                    <step.icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                  </div>
                  <h3
                    className="mb-2 font-semibold"
                    style={{ color: '#0F172A', fontFamily: 'Figtree, system-ui, sans-serif' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial ──────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ borderTop: '1px solid #E2E8F0' }}>
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-center">
            <div>
              <div className="mb-6 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote
                className="mb-6 text-2xl font-semibold leading-snug"
                style={{ color: '#0F172A', fontFamily: 'Figtree, system-ui, sans-serif' }}
              >
                &ldquo;Got my blood pressure medication without leaving home. Took 20 minutes total.&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm text-white"
                  style={{ background: '#0891B2' }}
                >
                  MJ
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#0F172A' }}>Marcus J.</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>Patient since 2024</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Booking to consultation', value: '< 5 min' },
                { label: 'Prescription issued', value: 'Instantly' },
                { label: 'Delivery to door', value: 'Same day' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl border px-5 py-4"
                  style={{ borderColor: '#E2E8F0' }}
                >
                  <span className="text-sm" style={{ color: '#64748B' }}>{label}</span>
                  <span className="text-sm font-semibold" style={{ color: '#0891B2' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ background: '#0A1628' }}>
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2
                className="mb-3 text-3xl font-bold tracking-tight"
                style={{ color: '#F8FAFC', fontFamily: 'Figtree, system-ui, sans-serif' }}
              >
                Take control of your health today
              </h2>
              <p style={{ color: '#94A3B8' }}>
                Join thousands of patients who get care on their schedule, from anywhere.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ background: '#0891B2' }}
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
                style={{ color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer
        className="border-t px-6 py-8"
        style={{ background: '#0A1628', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded" style={{ background: '#0891B2' }}>
              <Activity className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-sm" style={{ color: '#94A3B8' }}>LIVI Health</span>
          </div>
          <p className="text-xs" style={{ color: '#475569' }}>
            &copy; 2026 LIVI Health Inc. &nbsp;·&nbsp; HIPAA compliant &nbsp;·&nbsp; All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}
