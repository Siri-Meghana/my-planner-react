const NAV_ITEMS = [
  { id: 'today',  icon: '📅', label: 'Today'  },
  { id: 'goals',  icon: '🌟', label: 'Goals'  },
  { id: 'certs',  icon: '🎯', label: 'Certs'  },
  { id: 'art',    icon: '🎨', label: 'Art'    },
  { id: 'health', icon: '💚', label: 'Health' },
]

export default function BottomNav({ activePage, onPageChange }) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`nav-btn${activePage === item.id ? ' active' : ''}`}
          onClick={() => onPageChange(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
