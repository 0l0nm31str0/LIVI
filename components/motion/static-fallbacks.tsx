export function StaticShowcaseFallback() {
  return (
    <div className="deep-card w-full max-w-md rounded-2xl p-5">
      <div className="mb-4 h-3 w-24 rounded bg-white/10" />
      <div className="h-28 rounded-xl bg-white/10" />
      <div className="mt-4 flex gap-1">
        <div className="h-1 flex-1 rounded-full bg-ember/50" />
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
