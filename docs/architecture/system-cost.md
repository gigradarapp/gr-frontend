# Buzo — system cost overview

Monthly **list-price style** view for the stack in [system-overview.md](./system-overview.md). Vendors change rates by **region**, **tax**, and **billing term** — confirm on their sites before you commit.

Not in these columns: **LLM** usage, **Stripe** fees per charge, **bandwidth overages**, optional OVH extras (backups, snapshots).

---

## POC (~100 users) and Clerk

The **POC** uses **Clerk** for real auth (same stack as [poc-rollout.md](./poc-rollout.md)). For **cost**, treat POC like the **Dev tier** column below: **Auth → Clerk** is **$0** while monthly active users (MAU) stay inside **Clerk’s free tier** — confirm current limits on [Clerk pricing](https://clerk.com/pricing). If you outgrow free tier during POC, budget shifts to paid Clerk (**$20**/mo + **$0.02**/user/mo per your paid-tier row).

---

## Costs (dev tier vs paid)


| Component               | Provider                                                                                                      | Dev tier                                                                          | Paid tier                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Buzo UI**             | **Vercel** — [pricing](https://vercel.com/pricing)                                                            | **$0**                                                                            | **~$20**/user/mo Pro (+ usage if you exceed credit)                                            |
| **Application API**     | **Render** — [pricing](https://render.com/pricing)                                                            | **$0** (512 MB web service, spins down when idle)                                 | **~$7**/mo Starter · **~$25**/mo Standard (2 GB) · need 8 GB on Render → **~$175**/mo Pro Plus |
| **Auth (Clerk)**        | **Clerk** — [pricing](https://clerk.com/pricing)                                                              | **$0** — typical for **POC ~100 users** if within **free** MAU; else use **Paid** column | **$20**/mo + **$0.02**/user/mo                                                                 |
| **OpenClaw** (8 GB RAM) | **OVHcloud** — [VPS compare](https://www.ovhcloud.com/en/vps/compare/)                                        | **from ~US $6.46**/mo **VPS-1** (8 GB / 4 vCores; price varies by country & term) | **from ~US $6.46**/mo **VPS-1** (8 GB / 4 vCores; price varies by country & term)              |
| **Postgres**            | **Neon** ([dev](https://neon.tech/pricing)) · **Supabase** ([prod](https://supabase.com/pricing))             | **$0** — Neon within free quotas                                                  | **from ~$25**/mo Supabase Pro + usage overage per Supabase meters                              |
| **Notion** (optional)   | **Notion** — [pricing](https://www.notion.so/pricing)                                                         | **$0** (limited)                                                                  | Paid per-seat if you upgrade                                                                   |
| **Subtotal**            | *Sum of rows above; Notion **paid** not included. **POC** assumes Clerk **$0** on free tier; paid Clerk adds **$0.02**/user/mo on **$20**/mo base* | **~$6.5/mo** (POC-shaped; **Clerk $0** typical)                                    | **~$78/mo** + **$0.02**/user/mo (Clerk)                                                        |


---

## Example monthly totals (infra only)

Figures below are **only** the table above — **not** LLM or Stripe.


|                    | POC / dev tier stack (~100 users)                                                                 | Paid tier stack (small prod shape)                                |
| ------------------ | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Clerk**          | **$0** while POC stays in Clerk **free** tier (MAU); otherwise budget **Paid** column               | **$20**/mo + **$0.02**/user/mo                                    |
| **Subtotal**       | **~$6.5/mo** (same as dev column; **includes** Clerk at **$0** for typical POC)                   | **~$78/mo** + **$0.02**/user/mo (Clerk)                           |
| **Providers**      | Vercel · Render · **Clerk (POC)** · OVHcloud · Neon · Notion (optional)                            | Vercel · Render · Clerk · OVHcloud · Supabase · Notion (optional) |


Matches the **Subtotal** row in the main table. **Paid ~$96/mo** + **$0.02**/user (Clerk) if Render **Standard (~$25)** replaces Starter (~$78 → ~$96). Add **~$19/user/mo** for Render **Professional** workspace (vs Hobby).

---

## OpenClaw — larger OVH plans (optional)


| Plan  | Provider     | Price (from USD/mo) | RAM   |
| ----- | ------------ | ------------------- | ----- |
| VPS-1 | **OVHcloud** | ~$6.46              | 8 GB  |
| VPS-2 | **OVHcloud** | ~$9.99              | 12 GB |
| VPS-3 | **OVHcloud** | ~$19.97             | 24 GB |


Source: [OVHcloud VPS compare](https://www.ovhcloud.com/en/vps/compare/).

---

## Variable (not fixed monthly)


| Item                      | Provider                                           | Notes                                                |
| ------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| **LLM** (OpenAI, Kimi, …) | *per vendor*                                       | Per **token** / model; each provider’s pricing page. |
| **Stripe**                | **Stripe** — [pricing](https://stripe.com/pricing) | % + fixed fee per successful payment.                |
| **Egress**                | Vercel · Render · Neon · Supabase · OVH            | Each bills per their rules.                          |


---

## Related

- [system-overview.md](./system-overview.md) — where each piece runs (Vercel, Render, Clerk, OVHcloud, Neon, Supabase, Notion).
- [poc-rollout.md](./poc-rollout.md) — POC (~100 users) and beta → prod database migration.

