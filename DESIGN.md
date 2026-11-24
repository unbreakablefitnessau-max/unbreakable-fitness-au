# Design Brief

## Direction

Ironclad — an invite-only gym community that feels like walking into a serious strength facility: black iron, molten red heat, chalk-white type.

## Tone

Industrial premium — brutalist discipline softened by refined spacing and typographic control, so it reads as elite performance brand, not a gym flyer.

## Differentiation

A molten-red "heat" accent on near-black iron surfaces with mono micro-labels and faint grid texture — the app looks like equipment, not a generic SaaS dashboard.

## Color Palette

| Token      | OKLCH           | Role                                      |
| ---------- | --------------- | ----------------------------------------- |
| background | 0.145 0.008 20  | near-black iron base (dark primary)       |
| foreground | 0.95 0.006 30   | chalk-white text                          |
| card       | 0.185 0.01 20   | raised panels, chat bubbles, sidebar rows |
| primary    | 0.63 0.23 28    | molten red — CTAs, active nav, own msgs   |
| accent     | 0.78 0.16 68    | warm amber — coach badges, highlights     |
| muted      | 0.235 0.012 20  | secondary surfaces, inputs, dividers      |
| success    | 0.7 0.16 152    | online / active status                    |

## Typography

- Display: Space Grotesk — uppercase bold headings, brand lockup, section titles, tight tracking.
- Body: Plus Jakarta Sans — chat, labels, paragraphs, generous line-height.
- Mono: JetBrains Mono — eyebrow labels, timestamps, invite codes, metrics.
- Scale: hero `text-4xl md:text-6xl font-bold tracking-tight uppercase`, h2 `text-2xl md:text-3xl font-bold tracking-tight`, label `font-mono text-xs uppercase tracking-[0.22em]`, body `text-base`.

## Elevation & Depth

Flat layered surfaces (background → card → popover) separated by 1px borders; shadows are restrained (`shadow-subtle`, `shadow-elevated`) with a single `shadow-primary-glow` reserved for the primary CTA.

## Structural Zones

| Zone    | Background           | Border    | Notes                                          |
| ------- | -------------------- | --------- | ---------------------------------------------- |
| Header  | `bg-card/95` blur    | `border-b` | Brand lockup left, status dot + profile right |
| Sidebar | `bg-sidebar`         | `border-r` | Mono nav labels, red active pill on left edge |
| Content | `bg-background`      | —         | Grid texture only in hero; cards on `bg-card` |
| Rail    | `bg-muted/30` cards  | `border`  | Right rail: WOD card, who's-training avatars   |
| Footer  | `bg-muted/40`        | `border-t` | Sparse mono links, invite note                 |

## Spacing & Rhythm

Sections separated by `gap-6 md:gap-8`; cards use `p-5 md:p-6`; micro-spacing in chat lists is tight (`gap-1.5`) to contrast with airy welcome sections.

## Component Patterns

- Buttons: 8px radius, molten-red gradient fill, white text, hover lifts with `shadow-primary-glow`; secondary is bordered ghost.
- Cards: `rounded-lg` on `bg-card` with `border-border` and `shadow-subtle`; hero cards may use `shadow-elevated`.
- Badges: full-pill mono uppercase; amber for COACH, green for ONLINE, muted for roles.

## Motion

- Entrance: `animate-fade-up` staggered on cards and chat rows, 0.5s ease-out.
- Hover: `transition-smooth` color/border/shadow lift, 0.3s.
- Decorative: `animate-pulse-ring` on the live-status dot only.

## Constraints

- No purple gradients, no glassmorphism excess, no neon glow.
- No workout logging or progress charts — this is community + access.
- Dark mode is the primary experience; light mode is a tuned inverse, never a plain flip.

## Signature Detail

The molten-red heat gradient on primary actions paired with mono uppercase micro-labels — an equipment-grade identity that reads instantly as Unbreakable.
