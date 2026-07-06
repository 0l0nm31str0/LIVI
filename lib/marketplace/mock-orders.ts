import type { MarketplaceOrder, MarketplaceOrderStatus } from '@/types'

// In-memory order store for demo mode — resets on server restart
const orders: MarketplaceOrder[] = []

function now(): string {
  return new Date().toISOString()
}

function generateId(): string {
  return `mkt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export const mockOrdersDb = {
  create(input: Omit<MarketplaceOrder, 'id' | 'created_at' | 'updated_at'>): MarketplaceOrder {
    const order: MarketplaceOrder = {
      ...input,
      id: generateId(),
      created_at: now(),
      updated_at: now(),
    }
    orders.push(order)
    return order
  },

  get(id: string): MarketplaceOrder | undefined {
    return orders.find((o) => o.id === id)
  },

  update(id: string, fields: Partial<MarketplaceOrder>): MarketplaceOrder | undefined {
    const idx = orders.findIndex((o) => o.id === id)
    if (idx === -1) return undefined
    orders[idx] = { ...orders[idx], ...fields, updated_at: now() }
    return orders[idx]
  },

  listByPatient(patientId: string): MarketplaceOrder[] {
    return orders.filter((o) => o.patient_id === patientId).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  },

  listByEmail(email: string): MarketplaceOrder[] {
    return orders
      .filter((o) => o.patient_email === email)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  list(): MarketplaceOrder[] {
    return [...orders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  },

  delete(id: string): boolean {
    const idx = orders.findIndex((o) => o.id === id)
    if (idx === -1) return false
    orders.splice(idx, 1)
    return true
  },
}

// Demo status progression — simulates the full Rx/OTC lifecycle
const RX_STATUS_FLOW: MarketplaceOrderStatus[] = [
  'cart',
  'intake_pending',
  'intake_complete',
  'checkout_pending',
  'paid',
  'under_review',
  'approved',
  'processing',
  'shipped',
  'delivered',
]

const OTC_STATUS_FLOW: MarketplaceOrderStatus[] = [
  'cart',
  'checkout_pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
]

export function advanceDemoStatus(orderId: string): MarketplaceOrder | undefined {
  const order = mockOrdersDb.get(orderId)
  if (!order) return undefined

  const flow = order.product_type === 'prescription' ? RX_STATUS_FLOW : OTC_STATUS_FLOW
  const currentIdx = flow.indexOf(order.status)
  if (currentIdx === -1 || currentIdx >= flow.length - 1) return order

  const nextStatus = flow[currentIdx + 1]
  const updates: Partial<MarketplaceOrder> = { status: nextStatus }

  if (nextStatus === 'intake_complete') {
    updates.intake_completed_at = new Date().toISOString()
  }
  if (nextStatus === 'shipped') {
    updates.tracking_number = `LIVI${Date.now().toString().slice(-9)}`
  }

  return mockOrdersDb.update(orderId, updates)
}
