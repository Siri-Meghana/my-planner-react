import { useState, useEffect } from 'react'
import { usePlanner } from '../context/PlannerContext'
import Modal from '../components/Modal'

const SECTIONS = [
  { key: 'career',   label: 'Career',          empty: 'Add a career goal — job target, skill, portfolio piece' },
  { key: 'cert',     label: 'Certifications',   empty: 'Add a new certification or course goal' },
  { key: 'life',     label: 'Travel & Life',    empty: 'Add a travel destination or life goal' },
  { key: 'personal', label: 'Personal Growth',  empty: 'Add a habit, skill or personal milestone' },
]

const CAT_KEY_MAP = { 'Career': 'career', 'Travel & Life': 'life', 'Personal Growth': 'personal' }

export default function Goals() {
  const { state, dispatch } = usePlanner()
  const [modal, setModal] = useState(null) // { cat: string }

  function handleAddGoal({ emoji, name, sub, cat }) {
    const catKey = CAT_KEY_MAP[cat] || 'personal'
    dispatch({ type: 'ADD_GOAL', cat: catKey, item: { id: 'g' + Date.now(), emoji, name, sub, done: false } })
  }

  return (
    <div>
      <div className="goals-hero">
        <h2>Your Life Goals ✦</h2>
        <p>Career dreams, travel plans, personal milestones — everything you are working toward in one place.</p>
      </div>

      {SECTIONS.map(({ key, label, empty }) => {
        const items = state.goals?.[key] || []
        return (
          <div key={key}>
            <div className="sec">
              {label}
              <button className="sec-add" onClick={() => setModal({ cat: label })}>+</button>
            </div>
            <div className="goal-list">
              {items.length === 0
                ? <div className="empty-state"><div className="e-emoji">🌱</div>{empty}</div>
                : items.map(g => (
                    <div key={g.id} className={`goal-item${g.done ? ' done-g' : ''} fade-up`}
                      onClick={() => dispatch({ type: 'TOGGLE_GOAL', cat: key, id: g.id })}>
                      <div className="g-emoji">{g.emoji}</div>
                      <div className="g-body">
                        <div className="g-cat">{label}</div>
                        <div className="g-title">{g.name}</div>
                        {g.sub && <div className="g-sub">{g.sub}</div>}
                      </div>
                      <div className="g-check">✓</div>
                      <button className="g-del" onClick={e => { e.stopPropagation(); dispatch({ type: 'DELETE_GOAL', cat: key, id: g.id }) }}>✕</button>
                    </div>
                  ))
              }
            </div>
          </div>
        )
      })}

      <div className="quote"><p>"A goal without a plan is just a wish. You have both."</p></div>

      {modal && (
        <Modal mode="goal" defaultCat={modal.cat} onClose={() => setModal(null)} onSave={handleAddGoal} />
      )}
    </div>
  )
}
