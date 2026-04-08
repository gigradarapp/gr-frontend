# Buzo — POC rollout and beta → prod migration

Plan: run a **proof of concept** with about **100 users**, then **migrate beta users into the production database** if the POC succeeds.

**Auth:** **Clerk is in scope for the POC** — real sign-up, sessions, and API verification from day one (not deferred until after POC). Prefer **Clerk Production** for the **beta URL** so `user_id` values in Postgres stay valid when you migrate DB only; engineers can still use **Clerk Development** locally. See **POC scope → Identity** below.

This doc is **process and intent** only — concrete runbooks (SQL, Clerk IDs, Stripe customer mapping) should be filled in as the schema and vendors firm up. Stack context: [system-overview.md](./system-overview.md), costs: [system-cost.md](./system-cost.md).

---

## Phases (summary)

| Phase | Goal | Approx. scale |
|-------|------|----------------|
| **POC** | Validate product, infra, and ops with real usage (**Clerk** for auth end-to-end) | **~100 users** |
| **Decision** | Confirm POC success against criteria below | — |
| **Beta → prod DB** | Move **authoritative** user/app data from POC environment to **production Postgres** | Same cohort (grow after cutover) |

---

## POC scope (100 users)

| Topic | Intent |
|--------|--------|
| **Identity (Clerk)** | **Clerk runs in the POC:** sign-in UI + **backend** JWT/session verification + webhooks as needed. **Recommended:** **Clerk Production** keys on **Render + beta Vercel** so the ~100 users stay in one directory; **local dev** can use **Clerk Development** keys. If POC ever used only Development keys for real users, plan **email-based relink** of `clerk_user_id` before cutover (see migration table). |
| **Database** | **Neon** (or single dev project) for POC per [system-overview.md](./system-overview.md); **prod** remains **Supabase** (or chosen prod host) until migration. |
| **Payments** | **Stripe** test mode vs live — plan how **beta customers** transition (new Customer in live? link metadata?). |
| **OpenClaw + Notion** | Ingestion can run against POC DB or shared patterns; avoid hard-coding env-specific ids in app code—use config. |

---

## POC success criteria (examples — edit to match product)

| Area | Example signal |
|------|----------------|
| **Reliability** | API error rate / latency within target; no data-loss incidents. |
| **Identity** | Clerk + API + DB stay consistent for the cohort. |
| **Data quality** | Events/feed/plan flows usable; OpenClaw + DB pipeline trusted enough for prod. |
| **Cost / abuse** | LLM + infra usage within envelope; rate limits effective. |

---

## Beta → production database migration

| Step | Notes |
|------|--------|
| **Freeze or quiesce writes** | Short maintenance window or read-only mode on POC API while exporting / replaying. |
| **Schema parity** | Same **ordered migrations** applied to prod as POC (or prod ahead by empty deltas). |
| **Export / import** | Logical dump, `COPY`, ETL, or dual-write period — pick one strategy and document row counts + checksums. |
| **ID mapping** | Preserve **primary keys** if possible, or map old → new and update FKs in one transaction. |
| **Clerk** | Align **user id** in Postgres with **Clerk prod** users (webhook replay, import, or re-invite with mapped id). |
| **Stripe** | Live **Customers** / **Subscriptions** — usually **cannot** blindly copy from test; define per-user cutover (coupon, free period, etc.). |
| **Secrets / config** | Point **Render** (and UI) at **prod** DB URLs, Clerk prod, Stripe live **after** validation and backup. |
| **Smoke test** | Log in, core journeys, OpenClaw still writing expected rows. |
| **Rollback** | Keep POC backup and a revert plan until prod stable. |

---

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| **Duplicate or orphan users** | One source of truth for Clerk `user_id` ↔ DB row; scripted reconciliation. |
| **Partial migration** | Idempotent jobs; migration in transactions where possible; record `migrated_at`. |
| **Stripe / subscription drift** | Treat payments as **operational** migration, not only SQL. |
| **OpenClaw double-write** | Disable POC crawlers or repoint to prod DB only after cutover. |

---

## Related

- [system-overview.md](./system-overview.md) — architecture and environments.
- [system-cost.md](./system-cost.md) — infra pricing (includes Clerk).
