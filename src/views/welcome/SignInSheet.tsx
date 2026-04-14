import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail } from 'lucide-react'
import { googleOAuthRedirectUrl, postMagicLink } from '../../lib/auth-api'
import { useAppState } from '../../store/appStore'

function GoogleMark() {
  return (
    <span className="welcome-signin-google-mark" aria-hidden>
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    </span>
  )
}

export function SignInSheet() {
  const { closeSignIn } = useAppState()
  const [view, setView] = useState<'main' | 'email'>('main')
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState<'idle' | 'google' | 'email'>('idle')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const emailRedirectTo = `${window.location.origin}/`

  const signInWithGoogle = () => {
    setBusy('google')
    setErrorMessage('')
    try {
      window.location.href = googleOAuthRedirectUrl(emailRedirectTo)
    } catch (e) {
      setBusy('idle')
      setErrorMessage(e instanceof Error ? e.message : 'Could not start Google sign-in')
    }
  }

  const sendMagicLink = async () => {
    const trimmed = email.trim()
    if (!trimmed) {
      setEmailStatus('error')
      setErrorMessage('Enter your email address.')
      return
    }
    setBusy('email')
    setErrorMessage('')
    setEmailStatus('idle')
    try {
      await postMagicLink(trimmed, emailRedirectTo)
      setEmailStatus('sent')
    } catch (e) {
      setEmailStatus('error')
      setErrorMessage(
        e instanceof Error
          ? e.message
          : 'Could not send email — is gr-backend running and ALLOWED_ORIGINS set?',
      )
    } finally {
      setBusy('idle')
    }
  }

  return (
    <motion.div
      className="welcome-signin-sheet"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
    >
      <header className="welcome-signin-header">
        <button
          type="button"
          className="welcome-signin-back"
          onClick={() => {
            if (view === 'email') {
              setView('main')
              setEmailStatus('idle')
              setErrorMessage('')
              return
            }
            closeSignIn()
          }}
          aria-label={view === 'email' ? 'Back to sign-in options' : 'Back'}
        >
          <ArrowLeft size={18} />
        </button>
        <span className="welcome-signin-title">
          {view === 'email' ? 'Continue with email' : 'Sign in to Buzo'}
        </span>
        <span className="welcome-signin-spacer" aria-hidden />
      </header>

      <div className="welcome-signin-body">
        {view === 'main' ? (
          <>
            <p className="welcome-signin-lead">
              Save plans, sync taste, and see what your crew is doing — one account across the app.
            </p>

            {errorMessage && view === 'main' ? (
              <p className="welcome-signin-error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="button"
              className="welcome-signin-google"
              disabled={busy !== 'idle'}
              onClick={() => signInWithGoogle()}
            >
              <GoogleMark />
              <span>{busy === 'google' ? 'Redirecting…' : 'Continue with Google'}</span>
            </button>

            <button
              type="button"
              className="welcome-signin-email"
              disabled={busy !== 'idle'}
              onClick={() => {
                setView('email')
                setEmailStatus('idle')
                setErrorMessage('')
              }}
            >
              <Mail size={18} strokeWidth={2} aria-hidden />
              <span>Continue with email</span>
            </button>

            <p className="welcome-signin-note">
              Sign-in runs through the Buzo API — no Supabase keys in the browser. You can still
              explore first; guests get an anonymous session from the server.
            </p>
          </>
        ) : (
          <>
            <p className="welcome-signin-lead">
              We&apos;ll email you a magic link. It expires after a short time for security.
            </p>

            {emailStatus === 'sent' ? (
              <p className="welcome-signin-success" role="status">
                Check <strong>{email.trim()}</strong> for your login link, then return to this tab.
              </p>
            ) : (
              <>
                <label className="welcome-signin-email-label" htmlFor="sign-in-email">
                  Email
                </label>
                <input
                  id="sign-in-email"
                  className="welcome-signin-email-input"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy !== 'idle'}
                />
                {errorMessage ? (
                  <p className="welcome-signin-error" role="alert">
                    {errorMessage}
                  </p>
                ) : null}
                <button
                  type="button"
                  className="welcome-signin-google"
                  disabled={busy !== 'idle'}
                  onClick={() => void sendMagicLink()}
                >
                  <Mail size={18} strokeWidth={2} aria-hidden />
                  <span>{busy === 'email' ? 'Sending…' : 'Send magic link'}</span>
                </button>
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
