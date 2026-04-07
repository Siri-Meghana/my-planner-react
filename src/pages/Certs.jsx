import { useState, useEffect } from 'react'
import { usePlanner } from '../context/PlannerContext'
import Modal from '../components/Modal'

const COLOR_MAP = { gold: 'pbar-gold', sage: 'pbar-sage', walk: 'pbar-walk' }
const BADGE_MAP = {
  ga:   <div className="cert-badge badge-active">Active ✦</div>,
  meta: <div className="cert-badge badge-next">After Google ✓</div>,
}

export default function Certs() {
  const { state, dispatch } = usePlanner()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const handler = () => setShowModal(true)
    window.addEventListener('fab-click', handler)
    return () => window.removeEventListener('fab-click', handler)
  }, [])

  const hiddenCerts = state.hidden?.certs || []
  const visibleCerts = Object.entries(state.certs || {}).filter(([id]) => !hiddenCerts.includes(id))

  function handleAddCert({ emoji, name, sub, ms }) {
    const id = 'cert' + Date.now()
    const milestones = ms ? ms.split(',').map(m => m.trim()).filter(Boolean) : []
    dispatch({ type: 'ADD_CERT', cert: { name: `${emoji} ${name}`, emoji, pct: 0, color: 'walk', hint: sub || '', ms: {}, milestones } })
  }

  return (
    <div>
      <div className="sec" style={{ paddingTop: 18 }}>
        Certifications
        <button className="sec-add" onClick={() => setShowModal(true)}>+</button>
      </div>

      <div className="cert-cards">
        {visibleCerts.length === 0 && (
          <div className="empty-state"><div className="e-emoji">🎯</div>No certifications yet. Tap + to add one.</div>
        )}

        {visibleCerts.map(([id, cert]) => (
          <div key={id} className="cert-card fade-up">
            <div className="cert-top">
              <div className="cert-name">{cert.name}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {BADGE_MAP[id] || <div className="cert-badge badge-custom">Custom</div>}
                <button className="cert-del" onClick={() => { if (confirm('Remove this certification?')) dispatch({ type: 'DELETE_CERT', id }) }}>✕</button>
              </div>
            </div>

            <div className="pbar-wrap" onClick={() => dispatch({ type: 'BUMP_CERT', id })}>
              <div className={`pbar-fill ${COLOR_MAP[cert.color] || 'pbar-gold'}`} style={{ width: `${cert.pct || 0}%` }} />
            </div>

            <div className="cert-meta">
              <div className="cert-hint">Tap bar +10% · {cert.hint}</div>
              <div className="cert-pct">{cert.pct || 0}%</div>
            </div>

            <div className="ms-grid">
              {(cert.milestones || []).map((m, i) => (
                <div key={i} className={`ms${cert.ms?.[i] ? ' done' : ''}`}
                  onClick={() => dispatch({ type: 'TOGGLE_MS', certId: id, msIdx: i })}>
                  {m}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="quote"><p>"75 mins of focused study daily beats 3 scattered hours."</p></div>

      {showModal && <Modal mode="cert" onClose={() => setShowModal(false)} onSave={handleAddCert} />}
    </div>
  )
}
