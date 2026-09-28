type BuzoWordmarkProps = {
  alt?: string
  className?: string
}

/**
 * The brand kit provides separate black and white wordmarks. Rendering both
 * lets the in-app theme toggle select the accessible asset without relying on
 * the visitor's OS colour-scheme preference.
 */
export function BuzoWordmark({ alt = 'Buzo', className = '' }: BuzoWordmarkProps) {
  return (
    <span className={`buzo-wordmark ${className}`.trim()}>
      <img
        className="buzo-wordmark__light"
        src="/assets/logo/buzo-logo-black.png"
        alt={alt}
        decoding="async"
      />
      <img
        className="buzo-wordmark__dark"
        src="/assets/logo/buzo-logo-white.png"
        alt={alt}
        decoding="async"
      />
    </span>
  )
}
