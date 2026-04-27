/** After signup onboarding is completed or dismissed, we don’t auto-open it on every login. */
const KEY = 'buzo-signup-onboarding-dismissed'

export function readSignupOnboardingDismissed(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function persistSignupOnboardingDismissed() {
  try {
    window.localStorage.setItem(KEY, '1')
  } catch {
    /* ignore */
  }
}
