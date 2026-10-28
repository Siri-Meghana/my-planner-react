import { useState } from 'react'
import { usePlanner } from '../context/PlannerContext'

export default function Setup({ onComplete }) {
  const { connectFirebase } = usePlanner()
  const [apiKey,            setApiKey]            = useState('')
  const [projectId,         setProjectId]         = useState('')
  const [appId,             setAppId]             = useState('')
  const [messagingSenderId, setMessagingSenderId] = useState('')
  const [loading,           setLoading]           = useState(false)
  const [error,             setError]             = useState('')

  async function handleConnect() {
    if (!apiKey.trim() || !projectId.trim() || !appId.trim() || !messagingSenderId.trim()) {
      setError('Please fill in all four fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const pid = projectId.trim()
      const config = {
        apiKey:            apiKey.trim(),
        projectId:         pid,
        appId:             appId.trim(),
        messagingSenderId: messagingSenderId.trim(),
        authDomain:        `${pid}.firebaseapp.com`,
        storageBucket:     `${pid}.firebasestorage.app`,
      }
      localStorage.setItem('myplannerFB', JSON.stringify(config))
      await connectFirebase(config)
      onComplete()
    } catch (e) {
      setError('Connection failed. Double-check your 4 values, and make sure you created a Firestore database in test mode.')
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
            Open <strong>Firestore Database</strong> → Create database → <strong>Start in test mode</strong> → Enable
          </div>
        </div>
        <div className="step-row">
          <div className="step-num">3</div>
          <div className="step-txt">
            Go to <strong>Project Settings → Your apps → Web app (&lt;/&gt;)</strong> → Register → copy the 4 values below
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
          placeholder="messagingSenderId  (e.g. 123456789012)"
          value={messagingSenderId}
          onChange={e => setMessagingSenderId(e.target.value)}
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
