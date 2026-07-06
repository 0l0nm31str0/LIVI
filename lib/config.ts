export function isDemoMode(): boolean {
  if (process.env.DEMO_MODE === 'true') return true
  if (process.env.DEMO_MODE === 'false') return false
  // Auto-demo when critical keys are missing
  return !process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL
}

export function hasStripe(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}

export function hasBelugaEmbed(): boolean {
  return !!process.env.BELUGA_INTAKE_EMBED_URL
}

export function hasSupabase(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL
}
