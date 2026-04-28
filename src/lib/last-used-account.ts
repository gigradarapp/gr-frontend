const KEY = 'buzo_last_account'

export type LastUsedAccount = {
  email: string
  displayName: string
  avatarUrl?: string | null
}

export function saveLastUsedAccount(account: LastUsedAccount): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(account))
  } catch {
    /* ignore quota / private mode */
  }
}

export function getLastUsedAccount(): LastUsedAccount | null {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (
      parsed &&
      typeof parsed === 'object' &&
      'email' in parsed &&
      typeof (parsed as Record<string, unknown>).email === 'string'
    ) {
      return parsed as LastUsedAccount
    }
    return null
  } catch {
    return null
  }
}

export function clearLastUsedAccount(): void {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* ignore quota / private mode */
  }
}
