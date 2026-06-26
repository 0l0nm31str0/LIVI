import type { BentoStep } from './ScrollBento'

export function StaticShowcaseFallback() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 h-3 w-24 rounded bg-white/10" />
      <div className="h-28 rounded-xl bg-white/10" />
      <div className="mt-4 flex gap-1">
        <div className="h-1 flex-1 rounded-full bg-coral/50" />
        <div className="h-1 flex-1 rounded-full bg-white/15" />
        <div className="h-1 flex-1 rounded-full bg-white/15" />
        <div className="h-1 flex-1 rounded-full bg-white/15" />
      </div>
    </div>
  )
}

export function StaticLivingShowcase() {
  return <StaticShowcaseFallback />
}

export function StaticHeroPanel() {
  return <div className="aspect-[4/3] w-full max-w-md rounded-2xl border border-white/10 bg-white/5" />
}

export function StaticBentoFallback({ steps }: { steps: BentoStep[] }) {
  const count = steps.length || 4
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="h-72 rounded-2xl bg-canvas lg:row-span-2" />
      {Array.from({ length: Math.max(0, count - 1) }).map((_, i) => (
        <div key={i} className="h-32 rounded-xl bg-canvas" />
      ))}
    </div>
  )
}

export function StaticBentoGrid() {
  return <StaticBentoFallback steps={[]} />
}
