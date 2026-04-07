import { useState } from 'react'
import { EMOJIS } from '../data/defaults'

const GOAL_CATS = ['Career', 'Travel & Life', 'Personal Growth']

export default function Modal({ mode, defaultCat = '', onClose, onSave }) {
  const [emoji, setEmoji] = useState(EMOJIS[0])
  const [name, setName]   = useState('')
  const [sub, setSub]     = useState('')
  const [time, setTime]   = useState('')
  const [ms, setMs]       = useState('')
  const [cat, setCat]     = useState(defaultCat || GOAL_CATS[0])

  const titles = { 'daily': 'Add Daily Goal', 'goal': 'Add Life Goal', 'cert': 'Add Certification', 'art': 'Add Art Session' }
  const placeholders = { 'daily': 'e.g. Meditate for 10 mins', 'goal': 'e.g. Visit Japan by 2026', 'cert': 'e.g. AWS Cloud Practitioner', 'art': 'e.g. Watercolour session' }

  function handleSave() {
    if (!name.trim()) return
    onSave({ emoji, name: name.trim(), sub: sub.trim(), time: time.trim(), ms: ms.trim(), cat })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-handle" />
        <div className="modal-title">{titles[mode] || 'Add'}</div>

        <span className="modal-label">Choose an emoji</span>
        <div className="emoji-row">
          {EMOJIS.map(e => (
            <div key={e} className={`emoji-pick${emoji === e ? ' sel' : ''}`} onClick={() => setEmoji(e)}>{e}</div>
          ))}
        </div>

        <span className="modal-label">Title</span>
        <input className="modal-inp" value={name} onChange={e => setName(e.target.value)} placeholder={placeholders[mode] || 'Title'} autoFocus />

        <span className="modal-label">Description (optional)</span>
        <input className="modal-inp" value={sub} onChange={e => setSub(e.target.value)} placeholder="Add a note or detail..." />

        {mode === 'daily' && (
          <>
            <span className="modal-label">Time (optional)</span>
            <input className="modal-inp" value={time} onChange={e => setTime(e.target.value)} placeholder="e.g. 8:00 AM · 30 min" />
          </>
        )}

        {mode === 'goal' && (
          <>
            <span className="modal-label">Category</span>
            <div className="type-row">
              {GOAL_CATS.map(c => (
                <div key={c} className={`type-pick${cat === c ? ' sel' : ''}`} onClick={() => setCat(c)}>{c}</div>
              ))}
            </div>
          </>
        )}

        {mode === 'cert' && (
          <>
            <span className="modal-label">Milestones (comma separated)</span>
            <input className="modal-inp" value={ms} onChange={e => setMs(e.target.value)} placeholder="e.g. Week 1, Week 2, Capstone" />
          </>
        )}

        <div className="modal-btns">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save ✦</button>
        </div>
      </div>
    </div>
  )
}
