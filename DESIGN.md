# LIVI Design System

Two registers, one vocabulary. Marketing surfaces live in **deep water** (dark, WebGL current, ambitious motion). Portal surfaces are **daylight** (cool near-white, quiet, state-driven motion). Shapes, radii, and accent hues are shared so the journey feels continuous.

## Theme

- **Marketing (brand register):** immersive dark canvas `--deep #06100E`. The `FluidCurrent` WebGL layer (components/three/FluidCurrent.tsx) runs fixed behind all content: scroll velocity stirs the water, page progress brightens it, the pointer drags a soft glow. Content floats above on `z-10`.
- **Portal (product register):** light canvas `--canvas #F3F6F5` with white surfaces and an ink sidebar. No decorative motion; 150–250ms state transitions only.

## Color

| Token | Value | Role |
|---|---|---|
| `--deep` | `#06100E` | Marketing canvas (abyss green-black) |
| `--current` | `#2FB59A` | Bioluminescent teal — brand current on dark |
| `--current-bright` | `#83E3CB` | Crest highlights, active accents on dark |
| `--ember` | `#FF8672` | Coral on dark: meta text, progress, sparks |
| `--on-deep` / `--on-deep-muted` | `#EAF4F0` / `#9FB5AD` | Text on deep (≥8:1 AA) |
| `--ink` | `#0B1210` | Sidebar / dark panels in portal |
| `--canvas` | `#F3F6F5` | Portal body background |
| `--sage` | `#17685A` | Accent on light: links, focus, success |
| `--coral` | `#E85D4C` | Primary action color (buttons) |
| `--muted` | `#5C6B66` | Secondary text on light (≥5.9:1 AA) |

Strategy: **Drenched** on marketing (the surface IS the water), **Restrained** in the portal (teal accent ≤10%, coral only on primary actions).

## Typography

- **Display:** Bricolage Grotesque (`--font-display`) — headings, hero, wordmark. Hero scale `clamp(2.9rem, 7vw, 5.5rem)`, tracking `-0.03em`.
- **UI/body:** Instrument Sans (`--font-sans`) — everything else. Portal uses a fixed rem scale (~1.125 ratio).
- `text-wrap: balance` on h1–h3 globally.

## Components

- `FluidCurrent` — raw WebGL background. Props: `intensity` (1 marketing, ~0.55 auth). DPR cap 1.5 × 0.62 res scale, pauses off-screen/hidden tab, static single frame under reduced motion, CSS-gradient fallback on context loss.
- `SmoothScroll` — Lenis wrapper, marketing pages only, disabled under reduced motion.
- `Tilt3D` — pointer-tracked perspective tilt (mouse only). Children with `translateZ` become depth planes.
- `.deep-card` — the only translucent surface on dark: `white/5` fill, `white/12` border, inset crest line, deep drop shadow.
- `LivingShowcase` — animated visit-journey card, used in hero (inside Tilt3D) and auth panel (`compact`).
- Portal vocabulary: `StatCard`, `PageHeader`, `StatusBadge`, `AppCard`, shadcn/radix `ui/*` primitives. Sidebar active state = teal gradient fill (never a side-stripe border).

## Motion

- Marketing: one orchestrated hero entrance (word-stagger with slight rotateX), scroll-linked journey rail (`JourneyFlow` line grows via `useScroll` + spring), section reveals `whileInView` once with `[0.16, 1, 0.3, 1]` ease-out.
- Portal: fade-in page enter (350ms), hover lifts ≤2px, nothing longer than 250ms.
- Every animation has a reduced-motion path: static frame (WebGL), instant reveal (sections), no tilt.

## Layout

- Marketing max width `max-w-6xl`, fluid section padding `py-24 md:py-32+`.
- Portal: `h-screen` shell — ink sidebar (240px) + header (64px) + scrollable main.
- z-scale: nav 40 < modal-backdrop 50 < modal 60 < toast 70 < tooltip 80 (CSS vars in globals).
