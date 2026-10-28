import { useState, useEffect } from 'react'
import { usePlanner } from '../context/PlannerContext'
import Modal from '../components/Modal'

// Fix Bug #12: full colour map so custom certs rotate colours
const COLOR_MAP   = { gold: 'pbar-gold', sage: 'pbar-sage', walk: 'pbar-walk', rose: 'pbar-rose', slate: 'pbar-slate' }
const COLOR_CYCLE = ['gold', 'sage', 'rose', 'slate', 'walk']

export default function Certs() {
  const { state, dispatch } = usePlanner()
  const [showModal, setShowModal] = useState(false)

  // Fix Bug #2: filter FAB event by page name
  useEffect(() => {
    const handler = (e) => { if (e.detail === 'certs') setShowModal(true) }
    window.addEventListener('fab-click', handler)
    return () => window.removeEventListener('fab-click', handler)
  }, [])

  const hiddenCerts  = state.hidden?.certs || []
  const visibleCerts = Object.entries(state.certs || {}).filter(([id]) => !hiddenCerts.includes(id))

  function handleAddCert({ emoji, name, sub, ms }) {
    const milestones = ms ? ms.split(',').map(m => m.trim()).filter(Boolean) : []
    // Cycle through colours so each cert looks different
    const color      = COLOR_CYCLE[visibleCerts.length % COLOR_CYCLE.length]
    dispatch({
      type: 'ADD_CERT',
      cert: { name: `${emoji} ${name}`, emoji, pct: 0, color, hint: sub || '', ms: {}, milestones }
    })
  }

  return (
    <div>
      <div className="sec" style={{ paddingTop: 18 }}>
        Goals & Certifications
        <button className="sec-add" onClick={() => setShowModal(true)}>+</button>
      </div>

      <div className="cert-cards">
        {visibleCerts.length === 0 && (
          <div className="empty-state">
            <div className="e-emoji">🎯</div>
            Track any goal — a certification, a course, a project.<br />Tap + to add your first.
          </div>
        )}

        {visibleCerts.map(([id, cert]) => (
          <div key={id} className="cert-card fade-up">
            <div className="cert-top">
              <div className="cert-name">{cert.name}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  className="cert-del"
                  onClick={() => {
                    if (confirm('Remove this goal?'))
                      dispatch({ type: 'DELETE_CERT', id })
                  }}
                >✕</button>
              </div>
            </div>

            <div className="pbar-wrap" onClick={() => dispatch({ type: 'BUMP_CERT', id })}>
              <div
                className={`pbar-fill ${COLOR_MAP[cert.color] || 'pbar-gold'}`}
                style={{ width: `${cert.pct || 0}%` }}
              />
            </div>

            <div className="cert-meta">
              <div className="cert-hint">Tap bar +10%{cert.hint ? ' · ' + cert.hint : ''}</div>
              <div className="cert-pct">{cert.pct || 0}%</div>
            </div>

            {(cert.milestones || []).length > 0 && (
              <div className="ms-grid">
                {cert.milestones.map((m, i) => (
                  <div
                    key={i}
                    className={`ms${cert.ms?.[i] ? ' done' : ''}`}
                    onClick={() => dispatch({ type: 'TOGGLE_MS', certId: id, msIdx: i })}
                  >
                    {m}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="quote"><p>"Small, steady progress beats scattered bursts."</p></div>

      {showModal && (
        <Modal mode="cert" onClose={() => setShowModal(false)} onSave={handleAddCert} />
      )}
    </div>
  )
}
