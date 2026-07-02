# Product

## Register

product

(Marketing surfaces — `/`, login/signup brand panels — run in the **brand** register: immersive, motion-led, design IS the pitch. Authenticated portals run in the product register: the tool disappears into the task.)

## Users

- **Patients** — consumers seeking care for weight loss, ED, hair loss and similar verticals. They book async visits at night from a phone or laptop, then check back for prescription and delivery status. Often tired, sometimes anxious; zero tolerance for friction or clinical coldness.
- **Doctors** — licensed physicians reviewing queued visits and writing prescriptions. Efficiency-driven; they live in tables and detail views.
- **Pharmacy staff** — fulfillment operators tracking incoming prescriptions and shipping orders.

## Product Purpose

LIVI is a telehealth + pharmacy delivery platform: one connected journey from intake questionnaire → physician review (via Beluga Health) → prescription → home delivery (via Curexa). Success = a patient never has to call anyone; every state change surfaces in the portal within seconds of the webhook landing.

## Brand Personality

**Calm, fluid, precise.** The brand metaphor is a living current — care that flows to you. Deep-water dark surfaces with a bioluminescent teal current on marketing; clean, bright, quiet surfaces inside the portals. Never sterile-clinical, never wellness-woo.

## Anti-references

- Generic SaaS landing pages: gradient-text heroes, identical icon-card grids, eyebrow-label-above-every-heading scaffolding.
- Legacy telehealth (bright blue + white cross iconography, stock doctors in lab coats grinning at clipboards).
- Wellness-brand cream/beige softness — LIVI is a medical product, not a candle company.

## Design Principles

1. **The current is alive** — background motion responds to the user (scroll, pointer), it is never a looping screensaver.
2. **Depth is earned** — 3D and parallax appear on marketing surfaces; inside the portals, motion only conveys state (150–250ms).
3. **Status is the product** — visit/Rx/delivery state must always be visible, current, and unambiguous. StatusBadge is sacred vocabulary.
4. **One journey, one vocabulary** — the same shapes, radii, and accents from landing page to pharmacy dashboard.
5. **Fast is a feature** — the fluid background is raw WebGL on one quad, DPR-capped, paused off-screen; never a three.js scene-graph for a gradient.

## Accessibility & Inclusion

- WCAG 2.1 AA: body text ≥4.5:1, large text ≥3:1, visible focus rings everywhere.
- `prefers-reduced-motion`: WebGL current freezes to a static gradient; all entrance choreography collapses to crossfades.
- Full keyboard navigability; 44px minimum touch targets in portal nav.
