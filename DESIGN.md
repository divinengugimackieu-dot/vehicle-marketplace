# Design Brief

## Direction

Open Road — a premium automotive marketplace with a confident dark charcoal base, racing-red primary, and cool teal accents, built to feel like a high-end dealership.

## Tone

Bold, trustworthy, and performance-driven — deep charcoal surfaces with a sharp racing-red accent evoke automotive heritage without the generic dark-blue tech cliche.

## Differentiation

A racing-red primary (unexpected for a marketplace) paired with Space Grotesk display type and a hero-glow radial treatment gives the catalog a showroom, not a spreadsheet, feel.

## Color Palette

| Token      | OKLCH (dark)   | Role                          |
| ---------- | -------------- | ----------------------------- |
| background | 0.14 0.015 255 | deep charcoal canvas          |
| foreground | 0.93 0.01 255  | primary text                  |
| card       | 0.18 0.018 255 | listing / surface cards       |
| primary    | 0.52 0.2 25    | racing-red CTA / active       |
| accent     | 0.68 0.14 185  | cool teal filters / badges    |
| muted      | 0.22 0.02 255  | secondary surfaces            |
| success    | 0.6 0.18 150   | available / verified states   |

## Typography

- Display: Space Grotesk — hero, headings, prices
- Body: DM Sans — paragraphs, UI labels, nav
- Mono: Geist Mono — VIN, mileage, spec readouts
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Cards sit on `bg-card` with `shadow-subtle` resting and `shadow-elevated` on hover; the hero uses a layered `bg-hero-glow` radial for depth without full-page gradients.

## Structural Zones

| Zone    | Background         | Border   | Notes                                   |
| ------- | ------------------ | -------- | --------------------------------------- |
| Header  | `bg-background/80` | border-b | sticky, backdrop-blur, elevated         |
| Content | `bg-background`    | —        | alternate `bg-muted/30` every section   |
| Footer  | `bg-muted/40`      | border-t | muted surface, contact + links          |

## Spacing & Rhythm

Section gaps `py-16 md:py-24`; card grids `gap-6`; content max-width `container` (2xl 1400px); micro-spacing `gap-2`/`gap-3` for spec badges and button groups.

## Component Patterns

- Buttons: `rounded-lg` (radius 12px), primary `bg-primary text-primary-foreground`, hover brightness, secondary outlined
- Cards: `rounded-xl bg-card border border-border shadow-subtle`, hover `shadow-elevated` + lift
- Badges: `rounded-full bg-muted text-muted-foreground`; accent for fuel/condition tags
- Spec rows: mono `font-mono` for VIN/mileage readouts

## Motion

- Entrance: `animate-fade-up` on hero + section reveals (0.5s cubic-bezier)
- Hover: cards lift + `shadow-elevated` (0.3s `transition-smooth`); buttons brightness shift
- Decorative: `animate-fade-in` on gallery thumbnails; subtle hero-glow stays static

## Constraints

- Token-only styling — no raw hex/rgb in components, no arbitrary Tailwind colors
- Dark theme primary; light theme kept AA+ and coherent (same hue family)
- Fonts only from bundled set (Space Grotesk, DM Sans, Geist Mono) via `/assets/fonts/`
- Racing red used sparingly for CTAs/active states; teal for filters/badges

## Signature Detail

The racing-red primary on deep charcoal with mono spec readouts reads like a performance showroom — strong imagery and clear hierarchy make the catalog feel curated and trustworthy.
