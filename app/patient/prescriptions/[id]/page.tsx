'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Package, MapPin, CreditCard } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { toast } from '@/hooks/use-toast'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageHeader } from '@/components/app/PageHeader'
import { AppCard } from '@/components/app/AppCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Prescription, Pharmacy } from '@/types'

const MED_NAMES: Record<string, string> = {
  'med-001': 'Lisinopril', 'med-002': 'Metformin', 'med-003': 'Dextromethorphan HBr',
  'med-004': 'Amoxicillin', 'med-005': 'Atorvastatin', 'med-006': 'Omeprazole',
}

export default function PrescriptionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [rx, setRx] = useState<Prescription | null>(null)
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [selectedPharmacyId, setSelectedPharmacyId] = useState('')
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [shippingAddress, setShippingAddress] = useState('789 Pine Road, Springfield, IL 62701')
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [pharmacySaving, setPharmacySaving] = useState(false)

  useEffect(() => {
    fetch(`/api/prescriptions/${params.id}`).then(r => r.json()).then(d => {
      if (d.success) {
        setRx(d.data)
        setSelectedPharmacyId(d.data.pharmacy_id ?? '')
      }
    })
    fetch('/api/pharmacies').then(r => r.json()).then(d => setPharmacies(d.data ?? []))
  }, [params.id])

  async function handleSelectPharmacy() {
    if (!selectedPharmacyId || !rx) return
    setPharmacySaving(true)
    const res = await fetch(`/api/prescriptions/${rx.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pharmacy_id: selectedPharmacyId, status: 'sent_to_pharmacy' }),
    })
    const d = await res.json()
    if (d.success) setRx(d.data)
    setPharmacySaving(false)
  }

  async function handlePlaceOrder() {
    if (!rx || !user) return
    setOrderLoading(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prescription_id: rx.id,
        patient_id: user.id,
        pharmacy_id: rx.pharmacy_id,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        total_amount: 19.99,
      }),
    })
    const d = await res.json()
    if (d.success) {
      toast({
        title: 'Order placed successfully!',
        description: 'Redirecting to your orders…',
      })
      setOrderSuccess(true)
      setTimeout(() => router.push('/patient/orders'), 2000)
    } else {
      const message = d.error?.message ?? 'Failed to place order. Please try again.'
      toast({ variant: 'destructive', title: 'Order failed', description: message })
    }
    setOrderLoading(false)
  }

  if (!rx) return <div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary" /></div>

  const canOrder = rx.status === 'pharmacy_confirmed' && rx.pharmacy_id
  const canSelectPharmacy = rx.status === 'pending' || rx.status === 'sent_to_pharmacy'

  return (
    <div className="max-w-2xl page-enter">
      <PageHeader
        title="Prescription details"
        description={rx.id}
        action={<StatusBadge status={rx.status} />}
      />

      <AppCard title="Medication" className="mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground text-xs">Medication</p><p className="font-medium text-foreground">{MED_NAMES[rx.medication_id] ?? rx.medication_id}</p></div>
          <div><p className="text-muted-foreground text-xs">Dosage</p><p className="font-medium text-foreground">{rx.dosage}</p></div>
          <div><p className="text-muted-foreground text-xs">Quantity</p><p className="font-medium text-foreground">{rx.quantity} tablets</p></div>
          <div><p className="text-muted-foreground text-xs">Refills</p><p className="font-medium text-foreground">{rx.refills}</p></div>
          <div className="col-span-2"><p className="text-muted-foreground text-xs">Instructions</p><p className="font-medium text-foreground">{rx.special_instructions}</p></div>
          <div><p className="text-muted-foreground text-xs">Prescribed</p><p className="font-medium text-foreground">{formatDate(rx.prescribed_date)}</p></div>
        </div>
      </AppCard>

      {canSelectPharmacy && (
        <AppCard title="Select pharmacy" className="mb-4">
          <div className="space-y-3">
            <div>
              <Label className="mb-1.5 block">Choose a pharmacy</Label>
              <Select value={selectedPharmacyId || undefined} onValueChange={setSelectedPharmacyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pharmacy..." />
                </SelectTrigger>
                <SelectContent>
                  {pharmacies.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} - {p.city}, {p.state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSelectPharmacy} disabled={!selectedPharmacyId || pharmacySaving}>
              {pharmacySaving ? <LoadingSpinner className="text-white" /> : <><MapPin className="h-4 w-4" /> Send to pharmacy</>}
            </Button>
          </div>
        </AppCard>
      )}

      {canOrder && (
        <AppCard title="Place order" className="mb-4">
          <div className="space-y-4">
            <AlertBanner variant="success" title="Pharmacy has confirmed availability" message="Your medication is ready to order." />
            <div>
              <Label className="mb-1.5 block"><MapPin className="inline h-3.5 w-3.5 mr-1" />Shipping address</Label>
              <Input value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block"><CreditCard className="inline h-3.5 w-3.5 mr-1" />Payment method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-accent-light p-3 text-sm">
              <span className="text-muted-foreground">Total amount</span>
              <span className="font-semibold text-foreground">{formatCurrency(19.99)}</span>
            </div>
            <Button onClick={handlePlaceOrder} disabled={orderLoading || orderSuccess} className="w-full">
              {orderLoading ? <LoadingSpinner className="text-white" /> : <><Package className="h-4 w-4" /> Place order</>}
            </Button>
          </div>
        </AppCard>
      )}

      {rx.status === 'fulfilled' && (
        <AlertBanner variant="success" title="This prescription has been fulfilled" message="Your medication has been delivered." />
      )}
    </div>
  )
}
