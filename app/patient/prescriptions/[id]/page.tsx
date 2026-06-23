'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Package, MapPin, CreditCard } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AlertBanner } from '@/components/shared/AlertBanner'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
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
      setOrderSuccess(true)
      setTimeout(() => router.push('/patient/orders'), 2000)
    }
    setOrderLoading(false)
  }

  if (!rx) return <div className="flex justify-center py-16"><LoadingSpinner className="h-8 w-8 text-primary-700" /></div>

  const canOrder = rx.status === 'pharmacy_confirmed' && rx.pharmacy_id
  const canSelectPharmacy = rx.status === 'pending' || rx.status === 'sent_to_pharmacy'

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Prescription Details</h2>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{rx.id}</p>
        </div>
        <StatusBadge status={rx.status} />
      </div>

      {orderSuccess && (
        <AlertBanner variant="success" title="Order placed successfully!" message="Redirecting to your orders..." className="mb-4" />
      )}

      <div className="card mb-4">
        <div className="card-header"><h3 className="text-sm font-semibold text-foreground">Medication</h3></div>
        <div className="card-body space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted-foreground text-xs">Medication</p><p className="font-medium text-foreground">{MED_NAMES[rx.medication_id] ?? rx.medication_id}</p></div>
            <div><p className="text-muted-foreground text-xs">Dosage</p><p className="font-medium text-foreground">{rx.dosage}</p></div>
            <div><p className="text-muted-foreground text-xs">Quantity</p><p className="font-medium text-foreground">{rx.quantity} tablets</p></div>
            <div><p className="text-muted-foreground text-xs">Refills</p><p className="font-medium text-foreground">{rx.refills}</p></div>
            <div className="col-span-2"><p className="text-muted-foreground text-xs">Instructions</p><p className="font-medium text-foreground">{rx.special_instructions}</p></div>
            <div><p className="text-muted-foreground text-xs">Prescribed</p><p className="font-medium text-foreground">{formatDate(rx.prescribed_date)}</p></div>
          </div>
        </div>
      </div>

      {canSelectPharmacy && (
        <div className="card mb-4">
          <div className="card-header"><h3 className="text-sm font-semibold text-foreground">Select Pharmacy</h3></div>
          <div className="card-body space-y-3">
            <div>
              <label className="form-label">Choose a pharmacy</label>
              <select className="form-select" value={selectedPharmacyId} onChange={e => setSelectedPharmacyId(e.target.value)}>
                <option value="">Select pharmacy...</option>
                {pharmacies.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - {p.city}, {p.state}</option>
                ))}
              </select>
            </div>
            <button onClick={handleSelectPharmacy} disabled={!selectedPharmacyId || pharmacySaving} className="btn-primary">
              {pharmacySaving ? <LoadingSpinner className="text-white" /> : <><MapPin className="h-4 w-4" /> Send to Pharmacy</>}
            </button>
          </div>
        </div>
      )}

      {canOrder && (
        <div className="card mb-4">
          <div className="card-header"><h3 className="text-sm font-semibold text-foreground">Place Order</h3></div>
          <div className="card-body space-y-4">
            <AlertBanner variant="success" title="Pharmacy has confirmed availability" message="Your medication is ready to order." />
            <div>
              <label className="form-label"><MapPin className="inline h-3.5 w-3.5 mr-1" />Shipping Address</label>
              <input className="form-input" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} />
            </div>
            <div>
              <label className="form-label"><CreditCard className="inline h-3.5 w-3.5 mr-1" />Payment Method</label>
              <select className="form-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-primary-50 p-3 text-sm">
              <span className="text-muted-foreground">Total amount</span>
              <span className="font-semibold text-foreground">{formatCurrency(19.99)}</span>
            </div>
            <button onClick={handlePlaceOrder} disabled={orderLoading || orderSuccess} className="btn-primary w-full justify-center py-2.5">
              {orderLoading ? <LoadingSpinner className="text-white" /> : <><Package className="h-4 w-4" /> Place Order</>}
            </button>
          </div>
        </div>
      )}

      {rx.status === 'fulfilled' && (
        <AlertBanner variant="success" title="This prescription has been fulfilled" message="Your medication has been delivered." />
      )}
    </div>
  )
}
