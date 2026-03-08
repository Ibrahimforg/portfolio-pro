'use client'

import { useState, useEffect } from 'react'

// SVG icons intégrés pour éviter les erreurs de module
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const ArrowRightIcon = ({ className = "" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="5,12 12,5 19,12"/>
  </svg>
)

const WifiIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
    <line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
)

const WifiOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23"/>
    <path d="M16.72 11.06A11 11 0 0 1 18 12.55"/>
    <path d="M5 12.55a11 11 0 0 1 .29-.28"/>
    <path d="M10.3 16.11a6 6 0 0 1 3.42 0"/>
    <path d="M1.42 9a16 16 0 0 1 2.83-2.85"/>
    <path d="M21.75 16.15A16 16 0 0 0 12 5.42"/>
    <line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
)

const SmartphoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
)

interface PWAInstallPrompt extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAManager() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null)

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
    }

    // Vérifier le statut en ligne
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Écouter l'événement d'installation PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as unknown as PWAInstallPrompt)
      setIsInstallable(true)
    }

    // Initialisation
    checkInstalled()
    updateOnlineStatus()

    // Écouteurs d'événements
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setIsInstallable(false)
        setDeferredPrompt(null)
      }
    } catch (error) {
      console.error('Installation failed:', error)
    }
  }

  return (
    <>
      {/* Bouton d'installation flottant et stylé */}
      {isInstallable && !isInstalled && (
        <div className="fixed bottom-20 right-4 z-50 animate-fadeInUp">
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl shadow-2xl p-4 max-w-xs border border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <DownloadIcon />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Portfolio App</h3>
                <p className="text-xs opacity-90">Installez pour un accès rapide</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-white text-primary px-3 py-2 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Installer
              </button>
              <button
                onClick={() => setIsInstallable(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Icône d'état discrète */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="flex items-center gap-2 bg-surface/90 backdrop-blur-sm border border-border/50 rounded-full px-3 py-2 shadow-lg">
          {isOnline ? (
            <WifiIcon />
          ) : (
            <WifiOffIcon />
          )}
          <span className="text-xs text-text-secondary font-medium">
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>
      </div>
    </>
  )
}

export function OfflineMessage() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine)
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 rounded-lg p-4 z-50 max-w-md">
      <div className="flex items-center gap-3">
        <WifiOffIcon />
        <div>
          <h4 className="font-semibold text-red-800">Hors ligne</h4>
          <p className="text-sm text-red-700">
            Vérifiez votre connexion internet
          </p>
        </div>
      </div>
    </div>
  )
}

export { SmartphoneIcon, DownloadIcon, ArrowRightIcon }
