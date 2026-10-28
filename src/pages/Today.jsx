import { useState, useEffect } from 'react'
import { usePlanner } from '../context/PlannerContext'
import { DEFAULT_BLOCKS, MORNING_IDS, WORK_IDS, EVENING_IDS, getToday, getWeekKey } from '../data/defaults'
import Modal from '../components/Modal'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 9)  return { text: 'Good morning', icon: '✨', msg: 'A fresh day. Start with something small.' }
  if (h < 12) return { text: 'Morning in progress', icon: '🌤', msg: 'One step at a time. Keep going.' }
  if (h < 14) return { text: 'Midday check-in', icon: '🍃', msg: 'Pause, breathe, and refuel.' }
  if (h < 17) return { text: 'Afternoon', icon: '💪', msg: 'Stay with it. You are doing well.' }
  if (h < 19) return { text: 'Evening begins', icon: '🌆', msg: 'Shift gears. Make time for yourself.' }
  if (h < 21) return { text: 'Good evening', icon: '🌟', msg: 'Wind the day down on your terms.' }
  return { text: 'Winding down', icon: '🌙', msg: "Note tomorrow's one priority, then rest." }
}

function getWeekDays() {
  const labels = ['M','T','W','T','F','S','S']
  const today  = new Date()
  const dow    = today.getDay()
  const mon    = new Date(today)
  mon.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
  return labels.map((label, i) => {
    const d = new Date(mon)
    d.setDate(mon.getDate() + i)
    return { label, date: d.toISOString().split('T')[0] }
  })
}

function ProgressRing({ pct }) {
  const r = 25, circ = 2 * Math.PI * r
  const offset = circ - (circ * pct / 100)
  return (
    <div className="ring-wrap">
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle className="ring-bg" cx="30" cy="30" r={r} />
        <circle className="ring-fill" cx="30" cy="30" r={r} strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="ring-txt">
        <span className="ring-pct">{pct}%</span>
        <span className="ring-lbl">done</span>
      </div>
    </div>
  )
}

function Block({ block, done, onTap, onHide }) {
  return (
    <div
      className={`block ${block.type}${done ? ' done' : ''} fade-up`}
      onClick={() => onTap(block.id)}
    >
      <div className="b-emoji">{block.emoji}</div>
      <div className="b-body">
        <div className="b-time">{block.time}</div>
        <div className="b-title">{block.title}</div>
        <div className="b-sub">{block.sub}</div>
      </div>
      <div className="b-check" onClick={e => { e.stopPropagation(); onTap(block.id) }}>✓</div>
      <button className="b-del" onClick={e => { e.stopPropagation(); onHide(block.id) }}>✕</button>
    </div>
  )
}

function CustomBlock({ item, onTap, onDelete }) {
  return (
    <div
      className={`block custom${item.done ? ' done' : ''} fade-up`}
      onClick={() => onTap(item.id)}
    >
      <div className="b-emoji">{item.emoji}</div>
      <div className="b-body">
        {item.time && <div className="b-time">{item.time}</div>}
        <div className="b-title">{item.name}</div>
        {item.sub && <div className="b-sub">{item.sub}</div>}
      </div>
      <div className="b-check">✓</div>
      <button className="b-del" onClick={e => { e.stopPropagation(); onDelete(item.id) }}>✕</button>
    </div>
  )
}

export default function Today() {
  const { state, dispatch } = usePlanner()
  const [showModal, setShowModal] = useState(false)

  // Fix Bug #2: filter FAB event by page name so only Today responds
  useEffect(() => {
    const handler = (e) => { if (e.detail === 'today') setShowModal(true) }
    window.addEventListener('fab-click', handler)
    return () => window.removeEventListener('fab-click', handler)
  }, [])

  // Always get fresh date — fixes Bug #1 (stale TODAY constant)
  const TODAY = getToday()

  const greeting     = getGreeting()
  const weekDays     = getWeekDays()
  const hiddenBlocks = state.hidden?.blocks || []
  const dayData      = state.daily[TODAY] || {}
  const streakDays   = state.streak?.days || {}

  const visibleBlocks = DEFAULT_BLOCKS.filter(b => !hiddenBlocks.includes(b.id))
  const customBlocks  = dayData.custom || []
  const totalBlocks   = visibleBlocks.length + customBlocks.length
  const doneCount     = visibleBlocks.filter(b => !!dayData[b.id]).length
                      + customBlocks.filter(c => c.done).length
  const pct = totalBlocks ? Math.round((doneCount / totalBlocks) * 100) : 0
  const streakCount = Object.values(streakDays).filter(Boolean).length

  // Live counts for the stat tiles — reflect the user's own blocks, not a fixed routine
  const sectionDone = (ids) => {
    const vis = visibleBlocks.filter(b => ids.includes(b.id))
    return vis.filter(b => !!dayData[b.id]).length + '/' + vis.length
  }

  function renderSection(ids, label) {
    const blocks = visibleBlocks.filter(b => ids.includes(b.id))
    if (!blocks.length) return null
    return (
      <div key={label}>
        <div className="sec">{label}</div>
        <div className="block-list">
          {blocks.map(b => (
            <Block
              key={b.id}
              block={b}
              done={!!dayData[b.id]}
              onTap={id => dispatch({ type: 'TOGGLE_BLOCK', id })}
              onHide={id => {
                if (confirm('Remove this block from your schedule?'))
                  dispatch({ type: 'HIDE_BLOCK', id })
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  function handleAddCustom({ emoji, name, sub, time }) {
    dispatch({
      type: 'ADD_CUSTOM_BLOCK',
      item: { id: 'cu' + Date.now(), emoji, name, sub, time, done: false }
    })
  }

  return (
    <div>
      {/* HERO */}
      <div className="hero-strip">
        <div className="ring-row">
          <ProgressRing pct={pct} />
          <div className="hero-text">
            <h2>{greeting.text} {greeting.icon}</h2>
            <p>{greeting.msg}</p>
          </div>
        </div>
        <div className="stat-row">
          <div className="stat"><div className="stat-v" style={{color:'var(--teal)'}}>{sectionDone(MORNING_IDS)}</div><div className="stat-l">Morning</div></div>
          <div className="stat"><div className="stat-v" style={{color:'var(--walk)'}}>{sectionDone(WORK_IDS)}</div><div className="stat-l">Work</div></div>
          <div className="stat"><div className="stat-v" style={{color:'var(--rose)'}}>{sectionDone(EVENING_IDS)}</div><div className="stat-l">Evening</div></div>
          <div className="stat"><div className="stat-v" style={{color:'var(--cook)'}}>{pct}%</div><div className="stat-l">Day</div></div>
        </div>
      </div>

      {/* STREAK */}
      <div className="streak-row">
        <div className="streak-left">
          <div className="s-count">{streakCount}</div>
          <div className="s-lbl">days completed 🔥</div>
        </div>
        <div className="streak-right">
          <div className="streak-hint">Tap a day when you complete your schedule</div>
          <div className="streak-days">
            {weekDays.map(({ label, date }) => (
              <div
                key={date}
                className={`s-day${streakDays[date] ? ' active' : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_STREAK', date })}
              >
                <span className="d-name">{label}</span>
                <span className="d-dot" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="reset-row">
        <button className="reset-btn" onClick={() => dispatch({ type: 'RESET_DAY' })}>↺ New day</button>
      </div>

      {renderSection(MORNING_IDS, 'Morning')}
      {renderSection(WORK_IDS,    'Work')}
      {renderSection(EVENING_IDS, 'Evening')}

      {/* CUSTOM */}
      <div className="sec">
        My Daily Extras
        <button className="sec-add" onClick={() => setShowModal(true)}>+</button>
      </div>
      <div className="block-list">
        {customBlocks.length === 0 && (
          <div className="empty-state">
            <div className="e-emoji">✏️</div>Tap + to add your own daily goals
          </div>
        )}
        {customBlocks.map(item => (
          <CustomBlock
            key={item.id}
            item={item}
            onTap={id  => dispatch({ type: 'TOGGLE_CUSTOM_BLOCK', id })}
            onDelete={id => dispatch({ type: 'DELETE_CUSTOM_BLOCK', id })}
          />
        ))}
      </div>

      {showModal && (
        <Modal mode="daily" onClose={() => setShowModal(false)} onSave={handleAddCustom} />
      )}
    </div>
  )
}
