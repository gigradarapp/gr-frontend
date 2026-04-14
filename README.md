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

## Deploy to Vercel

This repo is ready for Vercel static deployment (`vercel.json` is included).

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel, click **Add New Project** and import the repo.
3. Confirm settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy.

For subsequent pushes, Vercel auto-redeploys.