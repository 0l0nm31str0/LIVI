'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ShippingAddress } from '@/types'

interface AddressFormProps {
  value: Partial<ShippingAddress>
  onChange: (address: Partial<ShippingAddress>) => void
  disabled?: boolean
}

export function AddressForm({ value, onChange, disabled }: AddressFormProps) {
  function update(field: keyof ShippingAddress, val: string) {
    onChange({ ...value, [field]: val })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="line1">Street address</Label>
        <Input
          id="line1"
          placeholder="123 Main St"
          value={value.line1 ?? ''}
          onChange={(e) => update('line1', e.target.value)}
          disabled={disabled}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="line2">Apt / Suite (optional)</Label>
        <Input
          id="line2"
          placeholder="Apt 4B"
          value={value.line2 ?? ''}
          onChange={(e) => update('line2', e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="New York"
            value={value.city ?? ''}
            onChange={(e) => update('city', e.target.value)}
            disabled={disabled}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            placeholder="NY"
            maxLength={2}
            value={value.state ?? ''}
            onChange={(e) => update('state', e.target.value.toUpperCase())}
            disabled={disabled}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="zip">ZIP code</Label>
        <Input
          id="zip"
          placeholder="10001"
          maxLength={10}
          value={value.zip ?? ''}
          onChange={(e) => update('zip', e.target.value)}
          disabled={disabled}
          required
        />
      </div>
    </div>
  )
}
