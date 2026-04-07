import { useState, useEffect } from 'react'

const TABS = [
  { id: 'today',  label: 'Today' },
  { id: 'goals',  label: 'Goals' },
  { id: 'certs',  label: 'Certs' },
  { id: 'art',    label: 'Art' },
  { id: 'health', label: 'Health' },
]

export default function Header({ activePage, onPageChange, syncStatus }) {
  const [timeStr, setTimeStr] = useState('')
  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    function tick() {
      const now = new Date()
      const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      setDateStr(`${days[now.getDay()].slice(0,3)} ${now.getDate()} ${months[now.getMonth()]}`)
      setTimeStr(`${days[now.getDay()]} · ${now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}`)
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [])

  const syncClass = syncStatus === 'live' ? 'sync-dot live' : syncStatus === 'saving' ? 'sync-dot saving' : 'sync-dot'

  return (
    <header className="app-header">
      <div className="header-inner">
        <div>
          <div className="logo-text">My Planner</div>
          <div className="header-sub">{timeStr}</div>
        </div>
        <div className="header-right">
          <div className={syncClass} title="Sync status" />
          <div className="date-chip">{dateStr}</div>
        </div>
      </div>
      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab${activePage === t.id ? ' active' : ''}`} onClick={() => onPageChange(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
    </header>
  )
}
