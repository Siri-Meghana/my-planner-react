import { useState, useEffect } from 'react'
import { usePlanner } from '../context/PlannerContext'
import { WEEK } from '../data/defaults'
import Modal from '../components/Modal'

export default function Art() {
  const { state, dispatch } = usePlanner()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const handler = () => setShowModal(true)
    window.addEventListener('fab-click', handler)
    return () => window.removeEventListener('fab-click', handler)
  }, [])

  // Initialise this week's art slots if first visit
  useEffect(() => {
    dispatch({ type: 'INIT_ART_WEEK' })
  }, [])

  const slots = state.art?.[WEEK] || []

  function handleAddArt({ emoji, name, sub }) {
    dispatch({ type: 'ADD_ART', item: { id: 'a' + Date.now(), emoji, title: name, sub, done: false } })
  }

  return (
    <div>
      <div className="sec" style={{ paddingTop: 18 }}>
        Creative Practice
      </div>

      <div className="art-hero">
        <h2>Art is not a reward.<br />It's recovery.</h2>
        <p>Your creativity <strong>fuels</strong> your career focus — it does not compete with it.</p>
      </div>

      <div className="sec">
        This Week
        <button className="sec-add" onClick={() => setShowModal(true)}>+</button>
      </div>

      <div className="art-slots">
        {slots.length === 0 && (
          <div className="empty-state">
            <div className="e-emoji">🎨</div>
            All sessions removed. Tap + to add new ones.
          </div>
        )}

        {slots.map(item => (
          <div
            key={item.id}
            className={`art-slot${item.done ? ' done-s' : ''} fade-up`}
            onClick={() => dispatch({ type: 'TOGGLE_ART', id: item.id })}
          >
            <div className="as-emoji">{item.emoji}</div>
            <div className="as-body">
              <div className="as-title">{item.title}</div>
              <div className="as-sub">{item.sub}</div>
            </div>
            <div className="as-check">✓</div>
            <button
              className="as-del"
              onClick={e => { e.stopPropagation(); dispatch({ type: 'DELETE_ART', id: item.id }) }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="quote">
        <p>"A day where I made something with my hands was never a wasted day."</p>
      </div>

      {showModal && (
        <Modal
          mode="art"
          onClose={() => setShowModal(false)}
          onSave={handleAddArt}
        />
      )}
    </div>
  )
}
