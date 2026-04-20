import { useEffect, useState, type ReactNode } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '../trpc/app-router'
import { apiBase } from './api-base'
import { postAnonymousSession } from './auth-api'
import { consumeOAuthHash, getAccessToken } from './session'

export const api = createTRPCReact<AppRouter>()
let anonymousBootstrapAttempted = false

export function TrpcProvider({
  children,
  queryClient,
}: {
  children: ReactNode
  queryClient: QueryClient
}) {
  const [authReady, setAuthReady] = useState(false)
  const [client] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: `${apiBase()}/trpc`,
          async headers() {
            const token = getAccessToken()
            if (!token) return {}
            return { Authorization: `Bearer ${token}` }
          },
        }),
      ],
    }),
  )

  useEffect(() => {
    let cancelled = false
    const forceReady = window.setTimeout(() => {
      if (!cancelled) setAuthReady(true)
    }, 12_000)

    ;(async () => {
      try {
        // TrpcProvider mounts before AuthSync. Consume OAuth hash here so callback tokens
        // are available before deciding to create an anonymous session.
        consumeOAuthHash()
        if (!getAccessToken()) {
          if (!anonymousBootstrapAttempted) {
            anonymousBootstrapAttempted = true
            await postAnonymousSession()
          }
        }
      } catch (e) {
        console.warn(
          '[gigradar] Anonymous session via backend failed — is gr-backend running? Discover may not work.',
          e,
        )
      } finally {
        if (!cancelled) {
          window.clearTimeout(forceReady)
          setAuthReady(true)
        }
      }
    })()

    return () => {
      cancelled = true
      window.clearTimeout(forceReady)
    }
  }, [])

  if (!authReady) {
    return (
      <div className="tab-suspense-fallback" aria-busy="true" aria-label="Loading">
        Loading…
      </div>
    )
  }

  return (
    <api.Provider client={client} queryClient={queryClient}>
      {children}
    </api.Provider>
  )
}
