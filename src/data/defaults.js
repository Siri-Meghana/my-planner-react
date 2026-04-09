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

export const DEFAULT_BLOCKS = [
  { id: 'b1',  type: 'cook',   emoji: '🍳', time: '7:30 AM · 30 min',           title: 'Cook breakfast + pack lunch',    sub: 'Both at once — efficient and calm.' },
  { id: 'b2',  type: 'health', emoji: '🥣', time: '8:00 AM · 20 min',           title: 'Eat breakfast',                   sub: 'Sit down. No phone. Start calm.' },
  { id: 'b3',  type: 'career', emoji: '📊', time: '8:20 AM · 75 min',           title: 'Study — Google Data Analytics',   sub: 'One module. Focused. Your future, daily.' },
  { id: 'b4',  type: 'rest',   emoji: '🪥', time: '9:35 AM · 25 min',           title: 'Get ready for work',              sub: "Already studied. That's a win." },
  { id: 'b5',  type: 'walk',   emoji: '🚶', time: '10:00 AM · 30 min',          title: 'Walk to work',                    sub: 'Fresh air. Move. Optional: course audio.' },
  { id: 'b6',  type: 'work',   emoji: '💼', time: '10:30 AM – 4:00 PM · 6 hrs', title: 'Work — Data Analysis and Events', sub: 'Notice tools and patterns. Eat your packed lunch.' },
  { id: 'b7',  type: 'walk',   emoji: '🚶', time: '4:00 PM · 30 min',           title: 'Walk home',                       sub: 'Decompress. Let work stay at work.' },
  { id: 'b8',  type: 'art',    emoji: '🎨', time: '4:30 PM · 45 min',           title: 'Creative time',                   sub: 'Art first. Before the brain negotiates.' },
  { id: 'b9',  type: 'cook',   emoji: '🍲', time: '5:15 PM · 40 min',           title: 'Cook dinner',                     sub: 'Music on. A ritual, not a chore.' },
  { id: 'b10', type: 'health', emoji: '🍽', time: '5:55 PM · 25 min',           title: 'Eat dinner',                      sub: 'Proper meal. Sitting down. Non-negotiable.' },
  { id: 'b11', type: 'career', emoji: '💻', time: '6:20 PM · 60 min',           title: 'Practice and cert projects',      sub: 'Apply what you studied. Build something small.' },
  { id: 'b12', type: 'rest',   emoji: '🛋', time: '7:30 PM · 90 min',           title: 'Free time',                       sub: 'Watch, call someone, do nothing. Earned.' },
  { id: 'b13', type: 'rest',   emoji: '🌙', time: '9:30 PM · 20 min',           title: 'Wind down and plan tomorrow',     sub: 'Write one priority. Prep for morning. Rest.' },
]

export const MORNING_IDS = ['b1','b2','b3','b4','b5']
export const WORK_IDS    = ['b6']
export const EVENING_IDS = ['b7','b8','b9','b10','b11','b12','b13']

export const DEFAULT_HEALTH = [
  { id: 'h0', emoji: '🥣', title: 'Breakfast',      sub: 'Every day. Non-negotiable.' },
  { id: 'h1', emoji: '🥗', title: 'Packed lunch',    sub: "Eat at work. Don't skip." },
  { id: 'h2', emoji: '🍽', title: 'Dinner',          sub: 'Cooked, sitting down.' },
  { id: 'h3', emoji: '💧', title: '2L Water',         sub: 'Dehydration = fatigue.' },
  { id: 'h4', emoji: '🚶', title: 'Both walks',       sub: '1hr daily = cortisol down.' },
  { id: 'h5', emoji: '😴', title: 'Sleep by 11pm',   sub: 'Poor sleep = stress and fog.' },
  { id: 'h6', emoji: '📵', title: 'No screens 10pm', sub: 'Protect sleep quality.' },
  { id: 'h7', emoji: '🧘', title: '5-min check-in',  sub: 'How are you, really?' },
]

export const DEFAULT_ART = [
  { id: 'a0', emoji: '🏺', title: 'Clay work',           sub: 'Tuesday and Thursday 4:30 PM', done: false },
  { id: 'a1', emoji: '✍',  title: 'Calligraphy',          sub: 'Saturday morning, free flow',  done: false },
  { id: 'a2', emoji: '🖌',  title: 'Painting',             sub: 'Any evening you feel called',  done: false },
  { id: 'a3', emoji: '🎨', title: 'Free create — Sunday', sub: 'No rules. Whatever you feel.', done: false },
]

export const DEFAULT_CERTS = {
  ga: {
    name: 'Google Data Analytics', emoji: '📊', pct: 0, color: 'gold', hint: '~5 months at 2h/day', ms: {},
    milestones: ['Foundations','Ask Questions','Prepare Data','Process Data','Analyze Data','Share Data','Act on Data','Capstone']
  },
  meta: {
    name: 'Meta Front-End Developer', emoji: '⚛️', pct: 0, color: 'sage', hint: '~7 months at 2h/day', ms: {},
    milestones: ['Intro to Front-End','HTML and CSS','JavaScript','React Basics','Advanced React','UX/UI Principles','Capstone']
  }
}

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
