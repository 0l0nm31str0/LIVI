# LIVI — The Longevity Club

**LIVI** is a product-first telehealth marketplace for prescription treatments and OTC wellness products. Licensed US physicians review intake, compounded medications ship from 503A pharmacies, and OTC wellness products ship direct.

---

## Quick Start

```bash
npm install
npm run dev     # http://localhost:3000
```

**Demo mode is active by default** (no external keys required). Everything runs on mock data.

Demo login: `marcus@example.com` / `password123`

---

## Architecture

```
Landing (/)
  └── Shop (/shop?tab=prescription|otc)
        └── Product detail (/shop/[type]/[slug])
              ├── Rx: Intake (/intake/[orderId]) → Checkout (/checkout/prescription/[orderId])
              └── OTC: Checkout (/checkout/otc/[orderId])
                        └── Success (/checkout/success)
                              └── Dashboard (/patient/dashboard)
```

### Demo vs Production
`lib/config.ts` exports `isDemoMode()`:
- Returns `true` when `DEMO_MODE=true` or Stripe/Supabase keys are missing
- All API routes branch on this: mock store (demo) or Supabase + real integrations (production)

---

## Key Directories

| Path | Purpose |
|------|---------|
| `lib/config.ts` | `isDemoMode()`, `hasStripe()`, `hasBelugaEmbed()` |
| `lib/products/catalog.ts` | Single source of truth for all products |
| `lib/marketplace/` | `mock-orders.ts` (in-memory), `orders.ts` (unified service) |
| `lib/stripe/` | Client, checkout session, product sync |
| `lib/beluga/intake.ts` | Embed URL builder + visit creation |
| `lib/fulfillment/otc.ts` | OTC adapter stub |
| `app/shop/` | Marketplace UI |
| `app/intake/` | Rx intake step |
| `app/checkout/` | Prescription + OTC checkout + success |
| `app/patient/` | Patient portal (dashboard, orders, billing) |
| `app/api/marketplace/` | Orders CRUD + demo advance |
| `app/api/checkout/` | Stripe / mock checkout sessions |
| `supabase/migrations/` | `002_marketplace.sql` |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
# Demo mode (default)
DEMO_MODE=true

# Stripe (flip when ready)
# STRIPE_SECRET_KEY=sk_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Beluga intake embed
# BELUGA_INTAKE_EMBED_URL=https://intake.belugahealth.com/...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## Integration Partners

| Partner | What they own | LIVI's role |
|---------|--------------|-------------|
| **Beluga Health** | Clinical intake, physician review, prescriptions | Order orchestration, status display |
| **Curexa** | Rx fulfillment, shipping | Webhook listener, tracking display |
| **Stripe** | Payments, subscriptions | Checkout sessions, webhook handler |

---

## Production Activation

1. Add keys to `.env.local` (see above)
2. Set `DEMO_MODE=false`
3. Run `supabase/migrations/002_marketplace.sql`
4. Register webhooks:
   - Stripe: `{APP_URL}/api/webhooks/stripe`
   - Beluga: `{APP_URL}/api/webhooks/beluga`
   - Curexa: `{APP_URL}/api/webhooks/curexa`
5. Sync catalog to Stripe: `npx ts-node lib/stripe/products.ts`

See `COMPLIANCE.md` for data responsibility and BAA requirements.

---

## Demo Walkthrough (Kesh)

1. `/` — luxury hero, "OWN YOUR LONGEVITY", category chips
2. `/shop?tab=prescription` — browse Rx treatments with product shots
3. Select Sermorelin → choose monthly + auto-pay → "Continue to intake"
4. Complete mock intake → checkout → mock pay
5. Dashboard shows "Under Review" → click "Simulate" to advance through states
6. `/shop?tab=otc` — NAD+ → address → checkout → delivered
7. `/patient/billing` — subscription + transaction history (mock)
8. Show commented Stripe/Beluga code + `.env.example` activation checklist
