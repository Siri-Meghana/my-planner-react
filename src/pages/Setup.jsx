import { useState } from 'react'
import { usePlanner } from '../context/PlannerContext'

export default function Setup({ onComplete }) {
  const { connectFirebase } = usePlanner()
  const [apiKey,    setApiKey]    = useState('')
  const [projectId, setProjectId] = useState('')
  const [appId,     setAppId]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  async function handleConnect() {
    if (!apiKey.trim() || !projectId.trim() || !appId.trim()) {
      setError('Please fill in all three fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const config = {
        apiKey:        apiKey.trim(),
        projectId:     projectId.trim(),
        appId:         appId.trim(),
        authDomain:    `${projectId.trim()}.firebaseapp.com`,
        storageBucket: `${projectId.trim()}.appspot.com`,
        messagingSenderId: '000000000000',
      }
      localStorage.setItem('myplannerFB', JSON.stringify(config))
      await connectFirebase(config)
      onComplete()
    } catch (e) {
      setError('Connection failed. Please check your config values and try again.')
      localStorage.removeItem('myplannerFB')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="setup-screen">
      <div className="setup-logo">My Planner</div>
      <div className="setup-tagline">Your day. Your way.</div>

      <div className="setup-card">
        <h3>⚙️ Connect Firebase — 5 min, free</h3>

        <div className="step-row">
          <div className="step-num">1</div>
          <div className="step-txt">
            Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer">console.firebase.google.com</a> and create a free project
          </div>
        </div>
        <div className="step-row">
          <div className="step-num">2</div>
          <div className="step-txt">
            Click <strong>Firestore Database</strong> → Create database → Start in test mode
          </div>
        </div>
        <div className="step-row">
          <div className="step-num">3</div>
          <div className="step-txt">
            Go to <strong>Project Settings → Web app (&lt;/&gt;)</strong> → Register → copy the 3 values below
          </div>
        </div>

        <input
          className="setup-inp"
          placeholder="apiKey  (e.g. AIzaSy...)"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
        />
        <input
          className="setup-inp"
          placeholder="projectId  (e.g. my-planner-abc)"
          value={projectId}
          onChange={e => setProjectId(e.target.value)}
        />
        <input
          className="setup-inp"
          placeholder="appId  (e.g. 1:123:web:abc...)"
          value={appId}
          onChange={e => setAppId(e.target.value)}
        />

        {error && (
          <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 8, marginBottom: 4 }}>
            ⚠ {error}
          </div>
        )}

        <button className="btn-connect" onClick={handleConnect} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect & Start My Planner →'}
        </button>

        <p className="setup-note">
          Your data lives in <strong>your own</strong> Firebase project. Private to you only.
        </p>
      </div>
    </div>
  )
}
