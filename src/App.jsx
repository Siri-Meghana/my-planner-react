import { useState, useEffect, useCallback } from 'react'
import { usePlanner } from './context/PlannerContext'
import { trackInstall, trackOpen } from './tracker'
import Header    from './components/Header'
import BottomNav from './components/BottomNav'
import Today     from './pages/Today'
import Goals     from './pages/Goals'
import Certs     from './pages/Certs'
import Art       from './pages/Art'
import Health    from './pages/Health'
import Setup     from './pages/Setup'

const FAB_PAGES = ['today', 'goals', 'certs', 'art']

export default function App() {
  const { connectFirebase } = usePlanner()
  const [page,       setPage]       = useState('today')
  const [isSetup,    setIsSetup]    = useState(true)
  const [isLoading,  setIsLoading]  = useState(true)
  const [syncStatus, setSyncStatus] = useState('off')
  const [syncMsg,    setSyncMsg]    = useState(null)

  // Try auto-connect from saved config
  useEffect(() => {
    async function tryAutoConnect() {
      const saved = localStorage.getItem('myplannerFB')
      if (!saved) { setIsLoading(false); return }
      try {
        const config = JSON.parse(saved)
        setSyncStatus('saving')
        await connectFirebase(config)
        setSyncStatus('live')
        setIsSetup(false)
        // Track returning user open — anonymous, no personal data
        trackOpen()
      } catch {
        localStorage.removeItem('myplannerFB')
        setSyncStatus('off')
      } finally {
        setIsLoading(false)
      }
    }
    tryAutoConnect()
  }, [])

  const flashSync = useCallback((text, err = false) => {
    setSyncMsg({ text, err })
    setTimeout(() => setSyncMsg(null), 2500)
  }, [])

  function handlePageChange(newPage) {
    setPage(newPage)
    window.scrollTo(0, 0)
  }

  async function handleSetupComplete() {
    setSyncStatus('live')
    flashSync('✓ Connected to Firebase')
    setIsSetup(false)
    // Track new install — anonymous, no personal data
    trackInstall()
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
      </div>
    )
  }

  if (isSetup) {
    return <Setup onComplete={handleSetupComplete} />
  }

  const PAGE_MAP = { today: Today, goals: Goals, certs: Certs, art: Art, health: Health }
  const ActivePage = PAGE_MAP[page] || Today

  return (
    <div className="app-shell">
      {syncMsg && (
        <div className={`sync-bar${syncMsg.err ? ' err' : ''}`}>
          {syncMsg.text}
        </div>
      )}

      <Header
        activePage={page}
        onPageChange={handlePageChange}
        syncStatus={syncStatus}
      />

      <main className="page-content">
        <ActivePage />
      </main>

      {FAB_PAGES.includes(page) && (
        <button className="fab" onClick={() => {
          // Dispatch a custom event that the active page listens to
          window.dispatchEvent(new CustomEvent('fab-click', { detail: page }))
        }}>+</button>
      )}

      <BottomNav activePage={page} onPageChange={handlePageChange} />
    </div>
  )
}
