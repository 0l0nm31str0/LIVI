import Link from 'next/link'
import { Activity, Calendar, FileText, Package, CheckCircle, ArrowRight, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <nav className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-primary-700">LIVI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link href="/login" className="btn-primary text-sm px-4 py-2">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-background py-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
            Telemedicine + Pharmacy in one place
          </span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-foreground text-balance">
            Healthcare at your fingertips
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Book a licensed doctor, get your prescription, and have medication delivered to your door. No waiting rooms, no paper prescriptions, no hassle.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login" className="btn-primary px-6 py-2.5 text-base">
              Book a doctor <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="btn-secondary px-6 py-2.5 text-base">
              For pharmacies
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary-700" /> HIPAA compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary-700" /> Licensed physicians</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-primary-700" /> Same-day prescriptions</span>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-foreground mb-3">Everything in one workflow</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">From booking to doorstep delivery, LIVI handles every step automatically.</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-6 shadow-card">
              <div className="mb-4 inline-flex rounded-lg bg-primary-50 p-3">
                <Calendar className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">Book Instantly</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Browse licensed physicians by specialty. Pick a time slot that works. No hold music, no referrals needed.
              </p>
            </div>
            <div className="rounded-xl border border-primary-200 bg-primary-700 p-6 shadow-card">
              <div className="mb-4 inline-flex rounded-lg bg-primary-600 p-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-white">Get Prescribed</h3>
              <p className="text-sm text-primary-100 leading-relaxed">
                Your doctor writes a digital prescription instantly after the consultation. It routes directly to your chosen pharmacy.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6 shadow-card" style={{ marginTop: '1.5rem' }}>
              <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Order your medication with one click. Track it from the pharmacy to your door with real-time updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-foreground mb-12">How it works</h2>
          <div className="relative">
            <div className="absolute left-[1.375rem] top-0 h-full w-px bg-border md:left-1/2" />
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up as a patient in under 2 minutes. Add your medical history and allergies.' },
              { step: '02', title: 'Book a consultation', desc: 'Browse available doctors and pick a time slot. Join your video call when ready.' },
              { step: '03', title: 'Receive your prescription', desc: 'Your doctor sends the prescription digitally. No paper, no fax.' },
              { step: '04', title: 'Order and track', desc: 'Select a pharmacy, place your order, and track delivery to your door.' },
            ].map((item, i) => (
              <div key={i} className={`relative mb-8 flex gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white shadow-card">
                  {item.step}
                </div>
                <div className={`card p-4 flex-1 ${i % 2 === 0 ? 'md:mr-[calc(50%+1.5rem)]' : 'md:ml-[calc(50%+1.5rem)]'}`}>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
          </div>
          <p className="text-xl font-medium text-foreground mb-2">&ldquo;Got my blood pressure medication without leaving home.&rdquo;</p>
          <p className="text-sm text-muted-foreground">Marcus J., Patient since 2024</p>
        </div>
      </section>

      <section className="bg-primary-700 py-16 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to take control of your health?</h2>
          <p className="text-primary-100 mb-8">Join thousands of patients who get care on their schedule.</p>
          <Link href="/login" className="inline-flex items-center gap-2 rounded-md bg-white px-8 py-3 text-sm font-semibold text-primary-700 shadow-sm hover:bg-primary-50 transition-colors">
            Get started for free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-white py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Activity className="h-4 w-4 text-primary-700" />
          <span className="font-semibold text-primary-700">LIVI</span>
        </div>
        <p className="text-xs text-muted-foreground">2026 LIVI Health Inc. All rights reserved. HIPAA compliant.</p>
      </footer>
    </div>
  )
}
