/**
 * API origin for tRPC + `/api/*`.
 * Empty = same origin (Vite proxy → gr-backend).
 * If set, use a full URL (`https://…`) or a bare host; bare hosts get `https://`
 * (or `http://` for localhost) so they are never treated as relative paths.
 */
export function apiBase(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined
  const trimmed = raw?.trim() ?? ''
  if (!trimmed) return ''

  const noTrail = trimmed.replace(/\/$/, '')
  if (/^https?:\/\//i.test(noTrail)) return noTrail
  if (noTrail.startsWith('/')) return noTrail

  const isLocal = /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(noTrail)
  const scheme = isLocal ? 'http' : 'https'
  return `${scheme}://${noTrail}`
}
