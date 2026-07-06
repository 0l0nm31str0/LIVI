'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { formatPrice, type SubscriptionPlan } from '@/lib/products/catalog'
import { RefreshCw } from 'lucide-react'

interface SubscriptionSelectorProps {
  plans: SubscriptionPlan[]
  onSelect?: (plan: SubscriptionPlan, autoRenew: boolean) => void
  defaultInterval?: string
}

export function SubscriptionSelector({
  plans,
  onSelect,
  defaultInterval = 'month',
}: SubscriptionSelectorProps) {
  const [selectedInterval, setSelectedInterval] = useState(defaultInterval)
  const [autoRenew, setAutoRenew] = useState(true)

  const selectedPlan = plans.find((p) => p.interval === selectedInterval) ?? plans[0]

  function handleSelect(plan: SubscriptionPlan) {
    setSelectedInterval(plan.interval)
    onSelect?.(plan, autoRenew)
  }

  function handleAutoRenewChange(checked: boolean) {
    setAutoRenew(checked)
    onSelect?.(selectedPlan, checked)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {plans.map((plan) => (
          <button
            key={plan.interval}
            type="button"
            onClick={() => handleSelect(plan)}
            className={cn(
              'relative flex flex-col items-center rounded-xl border p-3 text-center transition-all duration-150',
              selectedInterval === plan.interval
                ? 'border-[#E85A2B] bg-[#E85A2B]/5 ring-1 ring-[#E85A2B]'
                : 'border-border hover:border-foreground/30'
            )}
          >
            {plan.savingsLabel && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#E85A2B] px-2 py-0.5 text-[10px] font-semibold text-white">
                {plan.savingsLabel}
              </span>
            )}
            <span className="text-sm font-semibold text-foreground">{plan.label}</span>
            <span className="mt-1 text-lg font-bold text-foreground">{formatPrice(plan.priceCents)}</span>
            <span className="text-xs text-muted-foreground">total</span>
          </button>
        ))}
      </div>

      {/* Auto-renew toggle */}
      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-4 w-4 text-[#E85A2B]" />
          <div>
            <p className="text-sm font-medium text-foreground">Auto-renew subscription</p>
            <p className="text-xs text-muted-foreground">Cancel anytime · No surprise charges</p>
          </div>
        </div>
        <div className="relative">
          <input
            type="checkbox"
            checked={autoRenew}
            onChange={(e) => handleAutoRenewChange(e.target.checked)}
            className="sr-only"
          />
          <div
            className={cn(
              'h-6 w-11 rounded-full transition-colors duration-200',
              autoRenew ? 'bg-[#E85A2B]' : 'bg-muted'
            )}
          />
          <div
            className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
              autoRenew ? 'translate-x-5 left-0.5' : 'translate-x-0 left-0.5'
            )}
          />
        </div>
      </label>
    </div>
  )
}
