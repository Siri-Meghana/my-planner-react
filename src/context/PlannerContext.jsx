import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { initFirebase, loadData, saveData, subscribeToData } from '../firebase'
import { INITIAL_STATE, DEFAULT_ART, getToday, getWeekKey } from '../data/defaults'

const PlannerContext = createContext(null)

// Deep merge — but NEVER replaces arrays (preserves goals, art slots, custom blocks)
function deepMerge(base, override) {
  const result = { ...base }
  for (const key of Object.keys(override)) {
    const val = override[key]
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      result[key] = deepMerge(base[key] || {}, val)
    } else {
      result[key] = val
    }
  }
  return result
}

function reducer(state, action) {
  // Always get fresh date inside reducer — fixes the stale TODAY bug
  const TODAY = getToday()
  const WEEK  = getWeekKey()

  switch (action.type) {
    case 'LOAD': return deepMerge(INITIAL_STATE, action.payload)

    case 'TOGGLE_BLOCK': {
      const day    = state.daily[TODAY] || {}
      const newDay = { ...day, [action.id]: !day[action.id] }
      const streak = { ...state.streak, days: { ...state.streak.days, [TODAY]: true } }
      return { ...state, daily: { ...state.daily, [TODAY]: newDay }, streak }
    }

    case 'RESET_DAY': {
      const existing = state.daily[TODAY] || {}
      return { ...state, daily: { ...state.daily, [TODAY]: { custom: existing.custom || [] } } }
    }

    case 'HIDE_BLOCK': {
      const hidden = { ...state.hidden, blocks: [...(state.hidden.blocks || []), action.id] }
      return { ...state, hidden }
    }

    case 'TOGGLE_HEALTH': {
      const day = state.health[TODAY] || {}
      return { ...state, health: { ...state.health, [TODAY]: { ...day, [action.id]: !day[action.id] } } }
    }

    case 'HIDE_HEALTH': {
      const hidden = { ...state.hidden, health: [...(state.hidden.health || []), action.id] }
      return { ...state, hidden }
    }

    case 'TOGGLE_STREAK': {
      const days = { ...state.streak.days, [action.date]: !state.streak.days[action.date] }
      return { ...state, streak: { days } }
    }

    case 'BUMP_CERT': {
      const cert = state.certs[action.id] || {}
      return { ...state, certs: { ...state.certs, [action.id]: { ...cert, pct: Math.min(100, (cert.pct || 0) + 10) } } }
    }

    case 'TOGGLE_MS': {
      const cert = state.certs[action.certId] || {}
      const ms   = { ...(cert.ms || {}), [action.msIdx]: !cert.ms?.[action.msIdx] }
      return { ...state, certs: { ...state.certs, [action.certId]: { ...cert, ms } } }
    }

    case 'DELETE_CERT': {
      const { [action.id]: _, ...rest } = state.certs
      const hidden = { ...state.hidden, certs: [...(state.hidden.certs || []), action.id] }
      return { ...state, certs: rest, hidden }
    }

    case 'ADD_CERT': {
      const id = 'c' + Date.now()
      return { ...state, certs: { ...state.certs, [id]: action.cert } }
    }

    case 'INIT_ART_WEEK': {
      if (state.art[WEEK] !== undefined) return state
      return { ...state, art: { ...state.art, [WEEK]: DEFAULT_ART.map(a => ({ ...a })) } }
    }

    case 'TOGGLE_ART': {
      const slots = (state.art[WEEK] || []).map(s => s.id === action.id ? { ...s, done: !s.done } : s)
      return { ...state, art: { ...state.art, [WEEK]: slots } }
    }

    case 'DELETE_ART': {
      const slots = (state.art[WEEK] || []).filter(s => s.id !== action.id)
      return { ...state, art: { ...state.art, [WEEK]: slots } }
    }

    case 'ADD_ART': {
      const slots = [...(state.art[WEEK] || []), action.item]
      return { ...state, art: { ...state.art, [WEEK]: slots } }
    }

    case 'TOGGLE_GOAL': {
      const items = (state.goals[action.cat] || []).map(g =>
        g.id === action.id ? { ...g, done: !g.done } : g
      )
      return { ...state, goals: { ...state.goals, [action.cat]: items } }
    }

    case 'DELETE_GOAL': {
      const items = (state.goals[action.cat] || []).filter(g => g.id !== action.id)
      return { ...state, goals: { ...state.goals, [action.cat]: items } }
    }

    case 'ADD_GOAL': {
      const items = [...(state.goals[action.cat] || []), action.item]
      return { ...state, goals: { ...state.goals, [action.cat]: items } }
    }

    case 'ADD_CUSTOM_BLOCK': {
      const day    = state.daily[TODAY] || {}
      const custom = [...(day.custom || []), action.item]
      return { ...state, daily: { ...state.daily, [TODAY]: { ...day, custom } } }
    }

    case 'TOGGLE_CUSTOM_BLOCK': {
      const day    = state.daily[TODAY] || {}
      const custom = (day.custom || []).map(c =>
        c.id === action.id ? { ...c, done: !c.done } : c
      )
      return { ...state, daily: { ...state.daily, [TODAY]: { ...day, custom } } }
    }

    case 'DELETE_CUSTOM_BLOCK': {
      const day    = state.daily[TODAY] || {}
      const custom = (day.custom || []).filter(c => c.id !== action.id)
      return { ...state, daily: { ...state.daily, [TODAY]: { ...day, custom } } }
    }

    case 'SET_THEME': {
      return { ...state, theme: action.theme }
    }

    default: return state
  }
}

export function PlannerProvider({ children }) {
  const [state, dispatch]   = useReducer(reducer, INITIAL_STATE)
  const saveTimer           = useRef(null)
  const isLoaded            = useRef(false)
  const unsubscribeRef      = useRef(null)   // Fix: store unsubscribe so we can clean up

  function scheduleSave(newState) {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveData(newState).catch(console.error)
    }, 800)
  }

  // Save after every state change — but only after initial load
  useEffect(() => {
    if (!isLoaded.current) return
    scheduleSave(state)
  }, [state])

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme || 'light')
  }, [state.theme])

  // Cleanup Firebase listener on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current()
      clearTimeout(saveTimer.current)
    }
  }, [])

  async function connectFirebase(config) {
    initFirebase(config)
    const data = await loadData()
    if (data) {
      dispatch({ type: 'LOAD', payload: data })
    }
    // Set isLoaded AFTER dispatch so INIT_ART_WEEK doesn't trigger a premature save
    isLoaded.current = true
    dispatch({ type: 'INIT_ART_WEEK' })
    // Store unsubscribe so it can be cleaned up
    unsubscribeRef.current = subscribeToData(incoming => {
      dispatch({ type: 'LOAD', payload: incoming })
    })
  }

  return (
    <PlannerContext.Provider value={{ state, dispatch, connectFirebase }}>
      {children}
    </PlannerContext.Provider>
  )
}

export function usePlanner() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('usePlanner must be used inside PlannerProvider')
  return ctx
}
