import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Lazily initialized so builds and route-collection don't require env vars.
// Clients are only constructed when first used at request time.

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  return url
}

let browserClient: SupabaseClient | null = null

// Browser client — anon key, safe to expose
export function getSupabase(): SupabaseClient {
  if (!browserClient) {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!anonKey) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
    browserClient = createClient(getSupabaseUrl(), anonKey)
  }
  return browserClient
}

let serverClient: SupabaseClient | null = null

// Server-only admin client — service role key, never send to browser
export function getServerSupabase(): SupabaseClient {
  if (!serverClient) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
    serverClient = createClient(getSupabaseUrl(), serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return serverClient
}
