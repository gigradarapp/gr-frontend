# gr-frontend

Buzo frontend for GigRadar.

This repo is the Vercel-hosted React/Vite client. It should stay thin: render the mobile-web experience, call `gr-backend`, and avoid owning business secrets or database authority.

For product strategy, pitch narrative, data model, and architecture docs, use `../gr-north-star`. This README is mainly for operating and changing the frontend safely.

Last scanned against the local workspace on 2026-05-29.

## Table of Contents

- [System Context](#system-context)
- [What Matters Here](#what-matters-here)
- [Frontend Features](#frontend-features)
- [Frontend Technology](#frontend-technology)
- [Local Development](#local-development)
- [Frontend Environment](#frontend-environment)
- [Backend Contract](#backend-contract)
- [OpenClaw Contract](#openclaw-contract)
- [Scripts](#scripts)
- [Assets](#assets)
- [Deploy](#deploy)
- [Change Checklist](#change-checklist)

## System Context

```text
gr-frontend  ->  gr-backend  ->  Supabase
              ->              ->  Turso
              ->              ->  Stripe / OpenAI / data.gov.sg

gr-openclaw  ->  Turso events
gr-openclaw  ->  gr-backend internal reference-data API
```

| Workspace | Responsibility |
| --- | --- |
| `gr-frontend` | Browser UI, routing, client state, maps, admin screens, public frontend config. |
| `gr-backend` | API boundary, auth/session, tRPC, REST routes, secrets, Supabase, Turso, Stripe, OpenAI, weather cache. |
| `gr-openclaw` | Event crawling, normalization, validation, and Turso upserts. |
| `gr-north-star` | Product/market/architecture/business source of context. |

## What Matters Here

- The frontend calls the backend; it should not talk directly to Turso, Stripe secrets, OpenAI secrets, or Supabase service-role APIs.
- Event listings are Turso-backed through `gr-backend`. Supabase `public.events` is not the runtime source of truth.
- Supabase is for auth and lightweight app data: profiles, admin access, reference data, taste selections, badges, avatar storage, billing tier, and event plans.
- OpenClaw writes crawled event rows into Turso and validates categories/taste labels against backend reference-data endpoints.
- Demo data is only a local/debug fallback, not a production dependency.

## Frontend Features

This frontend currently covers the main Buzo app experience plus internal admin workflows:

- Mobile-first app shell with tab navigation, light/dark themes, and deep-linkable screens.
- Event discovery feed backed by live Turso data through `gr-backend`.
- Event filtering, pagination/load-more behavior, image fallback/proxy handling, and event detail views.
- Map-based event discovery with clustered pins and city/location-aware defaults.
- Ask Buzo agent chat for authenticated users, using backend tRPC first with a legacy serverless fallback path.
- Event intent flows: save/favorite events and mark events as planned/going.
- Plan surfaces for upcoming/past events and weather-aware event planning.
- Profile, onboarding, taste preferences, avatar upload/crop, reputation/badges, subscription, feedback, and account settings.
- Admin workspace for event inspection, admin user access, user analytics, weather map diagnostics, and design theme review.

## Frontend Technology

| Technology | Used for |
| --- | --- |
| React 19 | Component model for the app shell, screens, overlays, admin pages, and interactive UI. |
| TypeScript | Typed frontend domain models, config, API mappers, hooks, and tests. |
| Vite | Local dev server, build pipeline, env loading, and local proxy to `gr-backend`. |
| React Router 7 | Browser routing, tab/deep-link routing, admin route protection, and redirects. |
| TanStack Query | Server-state caching and invalidation around tRPC calls. |
| tRPC client | Typed calls into `gr-backend` for Ask Buzo, plans, profile, billing, and related app operations. |
| Zustand | Client-side shell/app state such as tabs, auth hydration, overlays, theme, favorites, onboarding, and UI flags. |
| Framer Motion | Sheet transitions, screen overlays, and app-shell motion. |
| MapLibre, react-map-gl, supercluster | Discover map rendering, map controls, and clustered event pins. |
| Leaflet / React Leaflet | Secondary map surfaces and map previews. |
| Lucide React | App and admin iconography. |
| Zod | Shared validation/mirroring around API-facing types and tRPC shape definitions. |
| Vitest | Unit tests for event mapping, filters, weather logic, image resolution, and agent matching helpers. |

## Local Development

Start the backend first:

```bash
cd ../gr-backend
npm install
cp .dev.vars.example .dev.vars
npm run check:env
npm run db:migrate # when setting up/updating Supabase schema
npm run dev
```

Backend runs on `http://127.0.0.1:8787`.

Then start the frontend:

```bash
cd ../gr-frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

In local mode, keep `VITE_API_LOCAL_URL` empty unless you intentionally need direct Worker calls. `vite.config.ts` proxies `/trpc`, `/health`, and configured `/api/...` prefixes to `http://127.0.0.1:8787`.

## Frontend Environment

Copy `.env.example` to `.env`.

Important variables:

| Variable | Notes |
| --- | --- |
| `VITE_API_MODE` | `local` for Vite proxy, `cloud` for hosted Worker. |
| `VITE_API_LOCAL_URL` | Empty means same-origin Vite proxy. |
| `VITE_API_CLOUD_URL` | Hosted `gr-backend` Worker URL for Vercel/prod. |
| `VITE_DISCOVER_EVENTS_SOURCE` | `live`, `demo`, or `auto`. Use `live` for real app flows. |
| `VITE_DISCOVER_EVENTS_ALLOW_DEMO_FALLBACK` | Keep `false` in production. |
| `VITE_MAP_STYLE_URL_DARK`, `VITE_MAP_STYLE_URL_LIGHT`, `VITE_MAPTILER_KEY` | Optional map style overrides. |
| `GOOGLE_MAPS_EMBED_KEY` | Public browser key for Maps Embed only; restrict by HTTP referrer. |
| `VITE_OPENAI_PROXY_URL` | Optional legacy/fallback serverless proxy. Primary Ask Buzo flow uses backend tRPC. |

Do not put Supabase service-role, Turso, Stripe secret, or OpenAI secret keys in frontend env.

## Backend Contract

`gr-backend` is the main contract for this app.

Frontend-relevant API areas:

| Area | Routes |
| --- | --- |
| tRPC | `/trpc/*` |
| Discover events | `/api/discover/events`, `/api/discover/events/:id` |
| Admin tools | `/api/admin/events`, `/api/admin/admin-users`, `/api/admin/user-analytics`, `/api/admin/weather-map` |
| Auth/session | `/api/auth/*` |
| Profile | `/api/profile/*` |
| Weather/image/source helpers | `/api/weather/event-summary`, `/api/image-proxy`, `/api/source-preview` |
| Health | `/health` |

Backend secrets belong in `../gr-backend/.dev.vars` locally and Cloudflare Worker secrets in hosted environments.

## OpenClaw Contract

`gr-openclaw` owns ingestion. The frontend should assume event rows arrive through this path:

```text
source pages/APIs -> gr-openclaw -> validation -> Turso -> gr-backend -> gr-frontend
```

Useful checks:

```bash
cd ../gr-openclaw
python3 scripts/check_openclaw_reference_data.py
docker compose run --rm openclaw-test
docker compose run --rm openclaw-upsert-dry-run
```

For production ingestion, `check_openclaw_reference_data.py` should report a `reference_data_source` beginning with `backend:`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start Vite on port 5173. |
| `npm run build` | Type-check and build static assets into `dist`. |
| `npm run preview` | Preview the built app. |
| `npm test` | Run Vitest once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run test:location-centroids` | Validate location centroid data. |

## Assets

Static assets live under `public/assets/`.

Examples:

- `public/assets/logo/`
- `public/assets/mascot/`
- Referenced as `/assets/<path>`, for example `/assets/logo/b-logo.svg`.

## Deploy

Frontend deploys as a static Vite app on Vercel:

1. Build command: `npm run build`
2. Output directory: `dist`
3. Set public frontend env only:
   - `VITE_API_MODE=cloud`
   - `VITE_API_CLOUD_URL=https://<your-worker>.workers.dev`
4. Add the Vercel production/preview origins to `ALLOWED_ORIGINS` in `gr-backend`.
5. Add the matching frontend and backend callback URLs in Supabase Auth settings.

Backend deploys from `../gr-backend` via Cloudflare Workers. OpenClaw should run on the ingestion host/VPS and write reviewed upsert reports.

## Change Checklist

Before changing event, auth, or admin flows:

- Check matching backend route/service/schema changes in `../gr-backend`.
- Check whether Turso event shape or OpenClaw upsert validation must change.
- Keep `src/trpc/app-router.ts` aligned with backend tRPC procedures.
- Keep secrets server-side.
- Keep demo fallback intentional and disabled in production.
