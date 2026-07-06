import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { formatPrice, getProductBySlug } from '@/lib/products/catalog'
import { RefreshCw } from 'lucide-react'
import type { MarketplaceOrder } from '@/types'

interface CheckoutSummaryProps {
  order: MarketplaceOrder
}

export function CheckoutSummary({ order }: CheckoutSummaryProps) {
  const product = getProductBySlug(order.product_slug)
  const plan = product?.plans.find((p) => p.interval === order.plan_interval)

  return (
    <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
      <h3 className="font-semibold text-foreground">Order summary</h3>

      <div className="flex gap-4">
        {product && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F6F3EE]">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{product?.name ?? order.product_slug}</p>
          <p className="text-sm text-muted-foreground">{plan?.label ?? order.plan_interval} plan</p>
          {order.auto_renew && (
            <div className="mt-1 flex items-center gap-1 text-xs text-[#E85A2B]">
              <RefreshCw className="h-3 w-3" />
              <span>Auto-renew</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(order.amount_cents)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between font-semibold text-base border-t border-border pt-2">
          <span>Total</span>
          <span>{formatPrice(order.amount_cents)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="text-xs">
          {order.product_type === 'prescription' ? '🧬 Rx' : '💊 OTC'}
        </Badge>
        <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
          Free shipping
        </Badge>
        {order.auto_renew && (
          <Badge variant="outline" className="text-xs">Cancel anytime</Badge>
        )}
      </div>
    </div>
  )
}
