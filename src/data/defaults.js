// TODAY and WEEK are now FUNCTIONS not constants
// so they always return the current date — never stale after midnight
export function getToday() {
  return new Date().toISOString().split('T')[0]
}

export function getWeekKey() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const mon = new Date(d)
  mon.setDate(diff)
  return mon.toISOString().split('T')[0]
}

// Keep TODAY and WEEK as compat exports for any remaining references
// but they now call the function each time via a getter
export const TODAY = getToday()
export const WEEK  = getWeekKey()

// Neutral starter schedule — a template every user can edit, hide, or add to.
export const DEFAULT_BLOCKS = [
  { id: 'b1',  type: 'health', emoji: '🌅', time: 'Morning · 10 min',   title: 'Wake & hydrate',     sub: 'Water first. Ease into the day.' },
  { id: 'b2',  type: 'health', emoji: '🍳', time: 'Morning · 20 min',   title: 'Breakfast',          sub: 'Fuel up before anything else.' },
  { id: 'b3',  type: 'career', emoji: '🎯', time: 'Morning · 60 min',   title: 'Focus block',        sub: 'Your most important task, first.' },
  { id: 'b4',  type: 'rest',   emoji: '🧼', time: 'Morning · 20 min',   title: 'Get ready',          sub: 'Set yourself up for the day.' },
  { id: 'b5',  type: 'work',   emoji: '💼', time: 'Daytime · main',     title: 'Work / main focus',  sub: 'Your core hours — stay present.' },
  { id: 'b6',  type: 'walk',   emoji: '🚶', time: 'Evening · 30 min',   title: 'Movement',           sub: 'Walk, stretch, move your body.' },
  { id: 'b7',  type: 'art',    emoji: '✨', time: 'Evening · 45 min',   title: 'Personal time',      sub: 'Something that is just for you.' },
  { id: 'b8',  type: 'cook',   emoji: '🍽', time: 'Evening · 40 min',   title: 'Dinner',             sub: 'Slow down. A proper meal.' },
  { id: 'b9',  type: 'career', emoji: '📚', time: 'Evening · 45 min',   title: 'Learn or create',    sub: 'Grow a skill or build something.' },
  { id: 'b10', type: 'rest',   emoji: '🛋', time: 'Evening · free',     title: 'Free time',          sub: 'Rest, watch, connect. Earned.' },
  { id: 'b11', type: 'rest',   emoji: '🌙', time: 'Night · 15 min',     title: 'Wind down',          sub: 'Plan tomorrow. Then rest.' },
]

export const MORNING_IDS = ['b1','b2','b3','b4']
export const WORK_IDS    = ['b5']
export const EVENING_IDS = ['b6','b7','b8','b9','b10','b11']

// Universal daily wellness basics — relatable for anyone.
export const DEFAULT_HEALTH = [
  { id: 'h0', emoji: '🥣', title: 'Breakfast',      sub: 'Start the day fueled.' },
  { id: 'h1', emoji: '🥗', title: 'Real meals',      sub: "Don't skip. Eat well." },
  { id: 'h2', emoji: '💧', title: 'Water',           sub: 'Hydration = energy.' },
  { id: 'h3', emoji: '🚶', title: 'Move daily',      sub: 'A walk counts.' },
  { id: 'h4', emoji: '😴', title: 'Good sleep',      sub: 'Rest is productive.' },
  { id: 'h5', emoji: '📵', title: 'Screen cutoff',   sub: 'Protect your sleep.' },
  { id: 'h6', emoji: '🧘', title: 'Check in',        sub: 'How are you, really?' },
  { id: 'h7', emoji: '☀️', title: 'Fresh air',       sub: 'Step outside once.' },
]

// Generic creative slots — editable to fit any hobby.
export const DEFAULT_ART = [
  { id: 'a0', emoji: '🎨', title: 'Creative session', sub: 'Draw, paint, build — anything.', done: false },
  { id: 'a1', emoji: '✍️', title: 'Write or journal',  sub: 'Put thoughts on paper.',        done: false },
  { id: 'a2', emoji: '🎵', title: 'Music or practice', sub: 'Play, listen, or learn.',        done: false },
  { id: 'a3', emoji: '✨', title: 'Make something',    sub: 'No rules. Whatever you feel.',   done: false },
]

// Ship empty — every user adds their own certs/goals.
export const DEFAULT_CERTS = {}

export const INITIAL_STATE = {
  daily:  {},
  health: {},
  art:    {},
  certs:  DEFAULT_CERTS,
  goals:  { career: [], cert: [], life: [], personal: [] },
  streak: { days: {} },
  hidden: { blocks: [], health: [], certs: [] },
  theme:  'light'
}

// Cert colour options for the modal picker
export const CERT_COLORS = ['gold', 'sage', 'walk', 'rose', 'slate']

export const EMOJIS = ['✅','🎯','📝','💡','🚀','📚','🏋','🌍','✈️','💰','🎨','🎵','📖','🧘','🌱','⭐','🔥','💎','🏆','❤️']
