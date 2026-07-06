# LIVI Compliance Notes

> **Architectural summary** — what data LIVI stores vs. what our partners own.

---

## Data Responsibility Matrix

| Layer | Data owner | What it holds | HIPAA scope |
|-------|-----------|---------------|-------------|
| **LIVI** | Us | Contact info, order metadata, payment refs, session data | Contact info only |
| **Beluga Health** | Beluga | Medical intake answers, PHI, clinical notes, prescriptions | ✅ HIPAA BAA |
| **Curexa** | Curexa | Rx fulfillment records, shipping data | ✅ HIPAA BAA |
| **Stripe** | Stripe | Payment card data, billing history | PCI-DSS |

---

## Key Rules

### 1. LIVI never stores medical intake answers
- The intake step is hosted by Beluga Health (iframe embed in production).
- LIVI's `marketplace_orders` table contains **no** medical fields.
- The legacy `visits.questionnaire` column is **not written** by any new marketplace flow.
- Demo mode shows a placeholder labeled "Medical intake hosted by Beluga Health."

### 2. Minimal data at checkout
LIVI stores:
- `patient_email` — for order notifications
- `shipping_address` — for fulfillment routing
- `stripe_checkout_session_id` — payment reference only (no card data)
- `beluga_master_id` — links visit to order (no PHI)

### 3. Prescription flow PHI handoff
```
Patient fills intake → Beluga (PHI) → physician approves → Curexa fills Rx
LIVI receives: visit status, tracking number (no intake content)
```

### 4. Demo mode
- `DEMO_MODE=true` (default when keys missing): mocks all external calls.
- Demo intake displays a clearly labeled placeholder.
- No external API calls are made in demo mode.
- Mock data never persists to Supabase.

---

## Data Retention

- `marketplace_orders`: retain while subscription active + 7 years (financial records).
- `visit_messages`: retain 7 years (clinical record via Beluga).
- `webhook_events`: retain 90 days for debugging, then archive/delete.

---

## Future BAAs Required
- Beluga Health: BAA needed before production launch.
- Curexa: BAA needed before production launch.

---

## Activation Checklist Before Production

- [ ] Sign BAA with Beluga Health
- [ ] Sign BAA with Curexa
- [ ] Enable Supabase RLS policies for patient-scoped rows
- [ ] Register Stripe webhook at `/api/webhooks/stripe`
- [ ] Configure `BELUGA_INTAKE_EMBED_URL`
- [ ] Set `DEMO_MODE=false`
- [ ] Run `supabase/migrations/002_marketplace.sql`
- [ ] Sync product catalog to Stripe via `lib/stripe/products.ts`
