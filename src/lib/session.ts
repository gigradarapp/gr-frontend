const AT = 'buzo_access_token'
const RT = 'buzo_refresh_token'

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(AT)
  } catch {
    return null
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(RT)
  } catch {
    return null
  }
}

export function setTokens(tokens: { access_token: string; refresh_token?: string | null }) {
  try {
    window.localStorage.setItem(AT, tokens.access_token)
    if (tokens.refresh_token) {
      window.localStorage.setItem(RT, tokens.refresh_token)
    }
  } catch {
    /* private mode */
  }
  notifyAuthChanged()
}

export function clearSession() {
  try {
    window.localStorage.removeItem(AT)
    window.localStorage.removeItem(RT)
  } catch {
    /* ignore */
  }
  notifyAuthChanged()
}

export function notifyAuthChanged() {
  window.dispatchEvent(new Event('buzo-auth-changed'))
}

/**
 * After Supabase OAuth / magic link, tokens arrive in the URL hash. Persist and strip the hash.
 */
export function consumeOAuthHash(): boolean {
  const raw = window.location.hash?.replace(/^#/, '')
  if (!raw) return false
  const params = new URLSearchParams(raw)
  const access_token = params.get('access_token')
  const refresh_token = params.get('refresh_token')
  if (!access_token) return false
  setTokens({ access_token, refresh_token })
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
  return true
}
