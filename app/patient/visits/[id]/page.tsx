'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Send, Truck, Video, AlertCircle, CheckCircle, Package, MessageSquare } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDateTime, formatDate, formatRelative } from '@/lib/utils'
import type { Visit, VisitMessage } from '@/types'
import { VISIT_STATUS_LABEL, CUREXA_STATUS_LABEL } from '@/types'

export default function VisitDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  const [visit, setVisit] = useState<Visit | null>(null)
  const [messages, setMessages] = useState<VisitMessage[]>([])
  const [messageText, setMessageText] = useState('')
  const [recipient, setRecipient] = useState<'doctor' | 'pharmacy'>('doctor')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const msgEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return
    Promise.all([
      fetch(`/api/visits/${id}`).then(r => r.json()),
      fetch(`/api/visits/${id}/messages`).then(r => r.json()),
    ]).then(([vd, md]) => {
      setVisit(vd.data ?? null)
      setMessages(md.data ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!messageText.trim() || !visit) return
    setSending(true)
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visit_id: visit.id,
        message: messageText.trim(),
        recipient,
        patient_name: user ? `${user.first_name} ${user.last_name}` : 'Patient',
      }),
    })
    setMessageText('')
    // Refresh messages
    const md = await fetch(`/api/visits/${id}/messages`).then(r => r.json())
    setMessages(md.data ?? [])
    setSending(false)
  }

  if (loading) {
    return <div className="flex justify-center py-20"><LoadingSpinner className="h-8 w-8 text-primary-600" /></div>
  }

  if (!visit) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
        <p className="font-medium text-foreground">Visit not found</p>
        <button onClick={() => router.back()} className="btn-secondary mt-4">Go Back</button>
      </div>
    )
  }

  const rx = visit.prescription_data
  const hasOrder = !!visit.curexa_order_id
  const showPharmacyTab = hasOrder

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <button onClick={() => router.back()} className="mb-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      {/* Title */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {visit.chief_complaint ?? 'Visit'}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {visit.visit_type === 'sync' ? 'Video consultation' : 'Async consultation'}
            {' · '}{formatRelative(visit.created_at)}
          </p>
        </div>
        <StatusBadge status={visit.status} />
      </div>

      {/* Timeline */}
      <VisitTimeline visit={visit} />

      {/* Video link for sync visits */}
      {visit.visit_type === 'sync' && visit.zoom_link && (
        <div className="card p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
              <Video className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Video Consultation Link</p>
              <p className="text-xs text-muted-foreground">Join when your doctor is ready</p>
            </div>
          </div>
          <a href={visit.zoom_link} target="_blank" rel="noreferrer" className="btn-primary text-sm">
            Join Call
          </a>
        </div>
      )}

      {/* Prescription */}
      {rx && (
        <div className="card p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-secondary-600" />
            <h3 className="text-sm font-semibold text-foreground">Prescription</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <RxRow label="Medication" value={(rx.medication_name as string) ?? '—'} />
            <RxRow label="Dosage" value={(rx.dosage as string) ?? '—'} />
            <RxRow label="Quantity" value={String(rx.quantity ?? '—')} />
            <RxRow label="Refills" value={String(rx.refills ?? '—')} />
            <RxRow label="Days Supply" value={String(rx.days_supply ?? '—')} />
            {rx.special_instructions && <RxRow label="Instructions" value={rx.special_instructions as string} />}
          </div>
        </div>
      )}

      {/* Tracking */}
      {hasOrder && (
        <div className="card p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-primary-600" />
            <h3 className="text-sm font-semibold text-foreground">Order & Tracking</h3>
            {visit.curexa_order_status && <StatusBadge status={visit.curexa_order_status} />}
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <RxRow label="Order ID" value={visit.curexa_order_id ?? '—'} />
            {visit.tracking_number && <RxRow label="Tracking #" value={visit.tracking_number} />}
            {visit.carrier && <RxRow label="Carrier" value={visit.carrier} />}
            {visit.estimated_delivery && <RxRow label="Est. Delivery" value={formatDate(visit.estimated_delivery)} />}
          </div>
          {visit.tracking_url && (
            <a href={visit.tracking_url} target="_blank" rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-700 hover:underline">
              <Truck className="h-4 w-4" /> Track Package
            </a>
          )}
        </div>
      )}

      {/* Messaging */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Messages</h3>
          </div>
          {showPharmacyTab && (
            <div className="flex rounded-lg border border-[color:var(--border)] overflow-hidden text-xs">
              <button
                onClick={() => setRecipient('doctor')}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  recipient === 'doctor' ? 'bg-primary-600 text-white' : 'bg-transparent text-muted-foreground hover:text-foreground'
                }`}>
                Doctor
              </button>
              <button
                onClick={() => setRecipient('pharmacy')}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  recipient === 'pharmacy' ? 'bg-primary-600 text-white' : 'bg-transparent text-muted-foreground hover:text-foreground'
                }`}>
                Pharmacy
              </button>
            </div>
          )}
        </div>

        {/* Message thread */}
        <div className="h-72 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No messages yet.</p>
              <p className="text-xs text-muted-foreground mt-0.5">Send a message to your doctor below.</p>
            </div>
          ) : (
            messages.map(m => (
              <MessageBubble key={m.id} message={m} isOwn={m.sender_type === 'patient'} />
            ))
          )}
          <div ref={msgEndRef} />
        </div>

        {/* Send */}
        <div className="border-t border-[color:var(--border)] p-4">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              className="form-input flex-1"
              placeholder={recipient === 'doctor' ? 'Message your doctor…' : 'Message the pharmacy…'}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
            />
            <button type="submit" disabled={sending || !messageText.trim()} className="btn-primary px-4">
              {sending ? <LoadingSpinner className="text-white" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function VisitTimeline({ visit }: { visit: Visit }) {
  const steps: { status: string; label: string; done: boolean; active: boolean }[] = [
    { status: 'submitted',   label: 'Visit Submitted',       done: ['submitted','under_review','active','prescribed','shipped','delivered'].includes(visit.status), active: visit.status === 'submitted' },
    { status: 'under_review', label: 'Under Review',         done: ['active','prescribed','shipped','delivered'].includes(visit.status), active: visit.status === 'under_review' },
    { status: 'active',      label: 'In Consultation',       done: ['prescribed','shipped','delivered'].includes(visit.status), active: visit.status === 'active' },
    { status: 'prescribed',  label: 'Prescription Written',  done: ['shipped','delivered'].includes(visit.status) || visit.rx_written, active: visit.status === 'prescribed' },
    { status: 'shipped',     label: 'Order Shipped',         done: visit.status === 'delivered', active: visit.status === 'shipped' },
    { status: 'delivered',   label: 'Delivered',             done: false, active: visit.status === 'delivered' },
  ]

  return (
    <div className="card p-5 mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Progress</h3>
      <div className="flex items-center gap-0">
        {steps.map((step, i) => (
          <div key={step.status} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                step.done ? 'border-secondary-500 bg-secondary-500 text-white' :
                step.active ? 'border-primary-600 bg-primary-600 text-white' :
                'border-border bg-card text-muted-foreground'
              }`}>
                {step.done ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <p className={`mt-1.5 text-center text-[10px] leading-tight max-w-[60px] ${
                step.active ? 'text-primary-700 font-semibold' :
                step.done ? 'text-secondary-700' :
                'text-muted-foreground'
              }`}>{step.label}</p>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 mb-5 transition-colors ${
                step.done ? 'bg-secondary-400' : 'bg-border'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function MessageBubble({ message, isOwn }: { message: VisitMessage; isOwn: boolean }) {
  return (
    <div className={`flex gap-3 ${ isOwn ? 'flex-row-reverse' : 'flex-row' }`}>
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
        isOwn ? 'bg-primary-600 text-white' :
        message.sender_type === 'doctor' ? 'bg-secondary-600 text-white' :
        message.sender_type === 'pharmacy' ? 'bg-warning-600 text-white' :
        'bg-muted/20 text-muted-foreground'
      }`}>
        {message.sender_name.charAt(0).toUpperCase()}
      </div>
      <div className={`max-w-[70%] ${ isOwn ? 'items-end' : 'items-start' } flex flex-col gap-1`}>
        <p className={`text-xs text-muted-foreground ${ isOwn ? 'text-right' : '' }`}>
          {message.sender_name} · {formatRelative(message.created_at)}
        </p>
        <div className={`rounded-2xl px-4 py-2.5 text-sm ${
          isOwn
            ? 'bg-primary-600 text-white rounded-tr-sm'
            : 'bg-muted/10 text-foreground rounded-tl-sm border border-[color:var(--border)]'
        }`}>
          {message.message}
        </div>
      </div>
    </div>
  )
}

function RxRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground mt-0.5">{value}</p>
    </div>
  )
}
