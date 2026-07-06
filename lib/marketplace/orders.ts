import { isDemoMode } from '@/lib/config'
import { mockOrdersDb } from '@/lib/marketplace/mock-orders'
import type { MarketplaceOrder } from '@/types'

type CreateInput = Omit<MarketplaceOrder, 'id' | 'created_at' | 'updated_at'>

export async function createMarketplaceOrder(input: CreateInput): Promise<MarketplaceOrder> {
  if (isDemoMode()) {
    return mockOrdersDb.create(input)
  }
  const { getServerSupabaseOptional } = await import('@/lib/supabase')
  const db = getServerSupabaseOptional()
  if (!db) throw new Error('Supabase not configured')
  const { data, error } = await db
    .from('marketplace_orders')
    .insert({ ...input })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as MarketplaceOrder
}

export async function getMarketplaceOrder(id: string): Promise<MarketplaceOrder | null> {
  if (isDemoMode()) {
    return mockOrdersDb.get(id) ?? null
  }
  const { getServerSupabaseOptional } = await import('@/lib/supabase')
  const db = getServerSupabaseOptional()
  if (!db) return null
  const { data } = await db.from('marketplace_orders').select('*').eq('id', id).single()
  return (data as MarketplaceOrder) ?? null
}

export async function updateMarketplaceOrder(
  id: string,
  fields: Partial<MarketplaceOrder>
): Promise<MarketplaceOrder | null> {
  if (isDemoMode()) {
    return mockOrdersDb.update(id, fields) ?? null
  }
  const { getServerSupabaseOptional } = await import('@/lib/supabase')
  const db = getServerSupabaseOptional()
  if (!db) return null
  const { data, error } = await db
    .from('marketplace_orders')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as MarketplaceOrder
}

export async function updateMarketplaceOrderByBelugaMasterId(
  masterId: string,
  fields: Partial<MarketplaceOrder>
): Promise<void> {
  if (isDemoMode()) {
    // Find by beluga_master_id in mock store
    const allOrders = mockOrdersDb.list()
    const order = allOrders.find((o) => o.beluga_master_id === masterId)
    if (order) mockOrdersDb.update(order.id, fields)
    return
  }
  const { getServerSupabaseOptional } = await import('@/lib/supabase')
  const db = getServerSupabaseOptional()
  if (!db) return
  await db
    .from('marketplace_orders')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('beluga_master_id', masterId)
}

export async function listMarketplaceOrders(patientId: string): Promise<MarketplaceOrder[]> {
  if (isDemoMode()) {
    return mockOrdersDb.listByPatient(patientId)
  }
  const { getServerSupabaseOptional } = await import('@/lib/supabase')
  const db = getServerSupabaseOptional()
  if (!db) return []
  const { data } = await db
    .from('marketplace_orders')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })
  return (data as MarketplaceOrder[]) ?? []
}
