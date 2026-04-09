import { usePlanner } from '../context/PlannerContext'
import { DEFAULT_HEALTH, getToday } from '../data/defaults'

export default function Health() {
  const { state, dispatch } = usePlanner()

  // Always get fresh date — fixes stale TODAY bug
  const TODAY = getToday()

  const hiddenHealth = state.hidden?.health || []
  const dayHealth    = state.health?.[TODAY] || {}
  const visibleCards = DEFAULT_HEALTH.filter(h => !hiddenHealth.includes(h.id))

  return (
    <div>
      <div className="sec" style={{ paddingTop: 18 }}>Daily Body Basics</div>

      <div className="hair-note">
        <h3>🌿 Hair and skipped meals</h3>
        <p>
          Stress raises cortisol which disrupts hair growth.{' '}
          <strong>Eating regularly + walking daily + sleeping well</strong> is the most direct fix.
        </p>
      </div>

      <div className="sec">Tap to check off</div>

      <div className="health-grid">
        {visibleCards.map(h => (
          <div
            key={h.id}
            className={`hcard${dayHealth[h.id] ? ' done-h' : ''} fade-up`}
            onClick={() => dispatch({ type: 'TOGGLE_HEALTH', id: h.id })}
          >
            <div className="hc-top">
              <div className="hc-emoji">{h.emoji}</div>
              {/* Fix Bug #10: delete button now hidden until hover */}
              <button
                className="hc-del"
                onClick={e => {
                  e.stopPropagation()
                  if (confirm('Remove this health item?'))
                    dispatch({ type: 'HIDE_HEALTH', id: h.id })
                }}
              >✕</button>
            </div>
            <div className="hc-title">{h.title}</div>
            <div className="hc-sub">{h.sub}</div>
            <div className="hc-check">✓</div>
          </div>
        ))}

        {visibleCards.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="e-emoji">💚</div>
            All items removed. Reload the app to restore defaults.
          </div>
        )}
      </div>

      <div className="quote">
        <p>"Taking care of your body is taking care of your career."</p>
      </div>
    </div>
  )
}
