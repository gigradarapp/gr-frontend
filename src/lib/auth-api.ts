import type { AuthUserPayload } from '../store/appStore'
import { apiBase } from './api-base'
import { clearSession, getAccessToken, getRefreshToken, setTokens } from './session'

type ProfileRow = {
  display_name?: string | null
  username?: string | null
  avatar_url?: string | null
  bio?: string | null
} | null

export async function fetchAuthSession(): Promise<{
  user: AuthUserPayload | null
  profile: ProfileRow
}> {
  const token = getAccessToken()
  const r = await fetch(`${apiBase()}/api/auth/session`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!r.ok) {
    throw new Error(`session ${r.status}`)
  }
  return r.json() as Promise<{ user: AuthUserPayload | null; profile: ProfileRow }>
}

export async function postAnonymousSession(): Promise<void> {
  const r = await fetch(`${apiBase()}/api/auth/anonymous`, { method: 'POST' })
  if (!r.ok) {
    const t = await r.text()
    throw new Error(t || `anonymous ${r.status}`)
  }
  const body = (await r.json()) as {
    access_token: string
    refresh_token?: string
  }
  setTokens({
    access_token: body.access_token,
    refresh_token: body.refresh_token,
  })
}

export async function postMagicLink(email: string, emailRedirectTo: string): Promise<void> {
  const r = await fetch(`${apiBase()}/api/auth/otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, emailRedirectTo }),
  })
  if (!r.ok) {
    let msg = `otp ${r.status}`
    try {
      const j = (await r.json()) as { error?: string; message?: string }
      if (j.error) msg = j.error
      else if (j.message) msg = j.message
    } catch {
      /* use default */
    }
    throw new Error(msg)
  }
}

export function googleOAuthRedirectUrl(returnTo: string): string {
  const q = encodeURIComponent(returnTo)
  return `${apiBase()}/api/auth/oauth/google?return_to=${q}`
}

export async function postSignOut(): Promise<void> {
  const refresh_token = getRefreshToken()
  await fetch(`${apiBase()}/api/auth/signout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token }),
  }).catch(() => {})
  clearSession()
}

export async function refreshAccessToken(): Promise<boolean> {
  const refresh_token = getRefreshToken()
  if (!refresh_token) return false
  const r = await fetch(`${apiBase()}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token }),
  })
  if (!r.ok) return false
  const body = (await r.json()) as { access_token: string; refresh_token?: string }
  setTokens({ access_token: body.access_token, refresh_token: body.refresh_token })
  return true
}
