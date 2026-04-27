# gr-ui-variant-1

GigRadar mobile-web UI (Vite + React + TypeScript).

**Architecture** (stack, POC rollout, cost): see the [north-star](https://github.com/gigradarco/north-star) repo, folder `architecture/`.

## Local development

```bash
npm install
cp .env.example .env
# Leave VITE_API_BASE_URL empty locally so Vite proxies /trpc and /api/* to http://127.0.0.1:8787.

npm run dev
```

Run **[gr-backend](https://github.com/gigradarco/gr-backend)** on **8787** — the UI uses it for **tRPC**, **geocode**, and **auth** (`/api/auth/*`). Supabase keys live only in the Worker (`.dev.vars`); the browser never loads the Supabase client. In Supabase, enable **Anonymous**, **Email**, and **Google**; set **Site URL** / **Redirect URLs** to your app origin(s). On the Worker, set **`ALLOWED_ORIGINS`** to those same origins (e.g. `http://localhost:5173,http://127.0.0.1:5173`). Run `npm run db:migrate` and `npm run db:seed-feed` in gr-backend for feed data.

## Assets folder

Drop your images into:

`public/assets/`

Then reference them in code like:

`/assets/your-image-name.jpg`

## Deploy to Vercel (frontend)

This app is a static Vite build (`vercel.json` is included if present in the project).

1. Import the repo in Vercel; set **Build** `npm run build`, **Output** `dist`.
2. **Environment variables** (only `VITE_*` — they are public in the client bundle):
   - `VITE_API_MODE=cloud`
   - `VITE_API_CLOUD_URL=https://<your-cloudflare-worker>.gigradar.workers.dev` (e.g. `gr-backend-dev` or `gr-backend-prod`)
   - `VITE_APP_NAME`, `VITE_ENABLE_DEMO_MODE`, etc. as needed
3. **Do not** add Supabase secret keys, Turso, or Stripe to Vercel — the UI talks to **gr-backend**; the Worker stores secrets in Cloudflare (see `gr-backend/README.md` “Deployment”).
4. In **gr-backend** (Cloudflare), set **`ALLOWED_ORIGINS`** to your Vercel production (and preview) **origins**, e.g. `https://your-app.vercel.app,https://your-app-*.vercel.app` (preview — use the exact hostnames Vercel uses, or list common preview URLs). Without this, the browser may be blocked by CORS when calling the Worker.
5. **Supabase** → **Authentication** → add your Vercel **Site URL** and **Redirect URLs** to match your flows; if OAuth callbacks go to the Worker, add `https://<worker>/api/auth/callback` and configure **`AUTH_CALLBACK_ORIGIN`** on the Worker per `gr-backend/.dev.vars.example`.

`vite.config.ts` proxies `/trpc`, `/api/*`, and `/health` to `127.0.0.1:8787` in **local dev only** — in production, `VITE_API_MODE=cloud` + `VITE_API_CLOUD_URL` is required for API calls and `/event-list` fetches to hit the hosted Worker.