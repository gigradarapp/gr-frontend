import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useAppState } from '../../../store/appStore'

export function PrivacySafetyScreen() {
  const { closePrivacySafety, openPrivacyPolicy } = useAppState()

  const stub = () => {
    window.alert('Demo: connect to your privacy tools or policy URLs.')
  }

  return (
    <motion.div
      className="privacy-safety-screen"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
    >
      <header className="privacy-safety-screen-header">
        <button
          type="button"
          className="privacy-safety-screen-back"
          onClick={closePrivacySafety}
          aria-label="Back to settings"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="privacy-safety-screen-title">Privacy & safety</span>
        <span className="privacy-safety-screen-spacer" aria-hidden />
      </header>

      <div className="privacy-safety-body">
        <section className="privacy-safety-section">
          <h3 className="privacy-safety-section-title">Your data</h3>
          <p className="privacy-safety-copy">
            You control what you share on Buzo. Under Singapore PDPA principles, we collect only what
            we need to improve recommendations and never sell personal data to third parties.
          </p>
          <div className="privacy-safety-card">
            <button type="button" className="privacy-safety-row" onClick={openPrivacyPolicy}>
              <span>Privacy policy</span>
              <ChevronRight size={16} className="privacy-safety-row-chevron" aria-hidden />
            </button>
          </div>
        </section>

        <section className="privacy-safety-section">
          <h3 className="privacy-safety-section-title">Location</h3>
          <p className="privacy-safety-copy">
            GPS location is optional and used only in-session to surface gigs and scenes near you. We do
            not store GPS history. We only store your default city selection (city/country) to curate your
            Buzo experience. You can change this anytime under Preferences in Settings.
          </p>
        </section>

        <section className="privacy-safety-section">
          <h3 className="privacy-safety-section-title">Account safety</h3>
          <p className="privacy-safety-copy">
            Use a strong password, keep your login private, and report anything that feels off via Send
            feedback.
          </p>
          <div className="privacy-safety-card">
            <button type="button" className="privacy-safety-row privacy-safety-row--danger" onClick={stub}>
              <span>Delete account</span>
              <ChevronRight size={16} className="privacy-safety-row-chevron" aria-hidden />
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  )
}
