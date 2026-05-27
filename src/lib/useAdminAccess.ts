import { useCallback, useEffect, useState } from 'react'
import { ensureAccessTokenFresh } from './auth-api'
import { apiBase } from './api-base'
import { getAccessToken } from './session'

export type AdminAccessStatus = 'idle' | 'checking' | 'authorized' | 'denied' | 'error'

export function useAdminAccess(enabled: boolean): AdminAccessStatus {
  const [status, setStatus] = useState<AdminAccessStatus>('idle')

  const verifyAdminAccess = useCallback(async () => {
    if (!enabled) {
      setStatus('idle')
      return
    }

    setStatus('checking')
    const fresh = await ensureAccessTokenFresh()
    const token = fresh ? getAccessToken() : null
    if (!token) {
      setStatus('denied')
      return
    }

    try {
      const res = await fetch(`${apiBase()}/api/admin/events?limit=1`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        setStatus('authorized')
        return
      }

      if (res.status === 401 || res.status === 403) {
        setStatus('denied')
        return
      }

      setStatus('error')
    } catch {
      setStatus('error')
    }
  }, [enabled])

  useEffect(() => {
    void verifyAdminAccess()
  }, [verifyAdminAccess])

  return status
}
