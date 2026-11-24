# Project Guidance

## User Preferences

- Professional, polished look and feel
- Access restricted to invited Unbreakable Fitness AU members only
- Members can add the app to their home screen after being invited

## Accepted Requirements

- Invite-only access for Unbreakable Fitness AU members
- Professional visual presentation
- Add the app to the home screen after being invited
- Fitness app with group chat
- Make the app installable and behave like a native app on iOS and Android home screens
- Complete and polish icons, splash screens, manifest, offline shell and iOS install guidance

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- App.tsx is a null stub in the starter — the entire UI must be authored from scratch.
- Backend starter has no domain code; OQL entities require Entity.Decl modules and populating Expose({ entities = [...] }) in main.mo, then pnpm bindgen.
- getApiDoc does not exist in the starter template; OQL 0.9.0 uses schema()/execute() instead.
- Invite-only access is built on top of MixinAuthorization's admin/user/guest roles — there is no invite/allowlist primitive.
- index.css tokens are pure neutral grayscale; a brand palette requires editing the OKLCH variables in index.css.
- index.html social meta tags must be preserved and updated per AGENTS.md.
- Admins without a member profile row must be admitted by every member guard; check AccessControl.isAdmin alongside profiles.containsKey.
- Mixin-private helper funcs share the actor block, so two mixins each defining requireMember/requireAdmin fail M0051; prefix per domain.
- OQL 0.9.0 auto-derive needs a _toRow instance per field; variant and [Record] fields fail M0230 — use toEntityManual with .payload per column.
- Chat liveness is satisfied by refetchInterval on the messages query plus invalidateQueries on send/delete; no websocket needed.
- Chat 'unavailable' came from gating the room on the profile query; gate only the conversation query.
- UnbreakableButton has no asChild; style TanStack Link CTAs with the exported unbreakableButton() cva instead.
- biome noCommentText flags literal // in JSX text; wrap as {"// text"} to keep the brand slash motif.
- sw.js precaches hashed JS/CSS by parsing the built index.html at install; verify every precache URL exists in dist.
- iOS splash media queries need device-width/height in CSS px plus -webkit-device-pixel-ratio; 13 device sizes cover iPhone and iPad.
- Infinite Tailwind animations such as animate-pulse-ring need motion-safe:/motion-reduce:animate-none guards to honor prefers-reduced-motion.
- A manifest screenshot asset should show the real app UI; a splash image mislabeled as a dashboard screenshot weakens install surfaces.
