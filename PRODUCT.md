# LIVI Product Brief — The Longevity Club

## Vision

LIVI is a **product-first telehealth marketplace** for prescription treatments and OTC wellness products. We lead with the product (not the doctor), simplify the intake → approval → delivery pipeline, and brand as "The Longevity Club" — a premium, science-backed wellness destination.

---

## Two Design Registers

### 1. Brand (Marketing)
- **Feel**: Immersive, luxury, confidence-building
- **Palette**: Deep black (`#0B1210`) + orange accent (`#E85A2B`) + cream (`#F6F3EE`)
- **Typography**: Bricolage Grotesque (display) + Cormorant Garamond (serif accent)
- **Motion**: Parallax hero, scroll-driven line draws, staggered reveals
- **Pages**: `/`, `/shop`, product detail pages

### 2. Product (Patient Portal)
- **Feel**: Task-focused, clear, trustworthy
- **Palette**: Near-white canvas (`#F3F6F5`) + ink (`#0B1210`) + orange CTAs
- **Pages**: `/patient/dashboard`, `/patient/orders`, `/patient/billing`, checkout flows

---

## User Journey (Marketplace MVP)

### Prescription Flow
```
Shop → Select product + plan → Intake (Beluga embed) → Checkout (Stripe) → Physician review → Rx issued → Curexa delivery
```

### OTC Flow
```
Shop → Select product + plan → Address → Checkout (Stripe) → Mock/partner fulfillment
```

---

## Products

### Prescription (Rx)
| Product | Category | From |
|---------|----------|------|
| Oxytocin Longevity Shot | Longevity | $149/mo |
| Sermorelin Wellness Shot | Hormones | $179/mo |
| Sildenafil | Men's Health | $49/mo |
| Vardenafil + Tadalafil | Men's Health | $79/mo |
| Semaglutide GLP-1 | Weight Loss | $299/mo |

### OTC
| Product | Category | From |
|---------|----------|------|
| NAD+ | Longevity | $69/mo |
| Collagen Peptides | Wellness | $49/mo |
| Magnesium Glycinate | Wellness | $39/mo |

---

## Demo Mode

`DEMO_MODE=true` (default) activates:
- In-memory mock orders (localStorage-like, server-side)
- Mock Stripe checkout (immediate success)
- Mock intake placeholder (clearly labeled)
- "Simulate next step" button on dashboard for demo walkthroughs

---

## Integration Map

| Step | System | LIVI's role |
|------|--------|-------------|
| Intake | Beluga Health (iframe) | Stores `beluga_master_id` only |
| Clinical review | Beluga | Webhook → update order status |
| Rx fulfillment | Curexa | Webhook → tracking number |
| Payment | Stripe | Checkout sessions + webhook |
| OTC fulfillment | Partner (TBD) | `lib/fulfillment/otc.ts` stub |

---

## Brand Personality

> **Calm, precise, aspirational.** LIVI speaks to people who take their health seriously — not patients seeking emergency care, but members of a longevity-focused lifestyle.

- Use "treatment" not "drug"
- Use "intake" not "questionnaire"
- Use "physician" not "doctor"
- Use "The Longevity Club" as the brand tagline
- Orange (#E85A2B) is the primary CTA and accent on marketing surfaces
