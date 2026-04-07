# My Planner 📅
### *Your day. Your way.*

> A Progressive Web App built with React + Vite to manage daily schedules, track professional certifications, log creative activities, and monitor health habits — synced to the cloud in real time.

**🌐 Live Demo:** [your-app.vercel.app](https://your-app.vercel.app) &nbsp;|&nbsp; **Built by:** Siri Meghana

---

## 📸 Screenshots

> Add screenshots here — one per tab (Today, Goals, Certs, Art, Health)
> Recommended width: `<img src="screenshots/today.png" width="250">`

---

## 💡 The Problem I Solved

I was juggling multiple goals at once — professional certifications, creative hobbies like painting and calligraphy, daily health habits, and a work schedule. Every productivity app I tried was too generic or didn't let me manage all these areas together.

So I built **My Planner** — a personal productivity app designed around my actual life, not a template. This is the React refactor of the original vanilla JS version, rebuilt with proper component architecture, state management, and modern tooling.

---

## ✨ Features

| Tab | What it does |
|-----|-------------|
| 📅 **Today** | Daily schedule with progress ring, streak tracker, and custom goals |
| 🌟 **Goals** | Life goals organised by Career, Certifications, Travel, Personal Growth |
| 🎯 **Certs** | Certification tracker with progress bars and milestone chips |
| 🎨 **Art** | Weekly creative session tracker — clay, calligraphy, painting |
| 💚 **Health** | Daily body basics checklist with 8 items |

**All items are deletable** — default and custom. Deletions persist to Firebase so they stay gone across all devices and sessions.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI library — component-based architecture |
| **Vite** | Build tool — fast HMR, optimised production builds |
| **useReducer + Context API** | Global state management without Redux |
| **Firebase Firestore** | Real-time cloud database (NoSQL) |
| **vite-plugin-pwa** | Makes the app installable on mobile, works offline |
| **CSS Custom Properties** | Theming without a framework |
| **GitHub + Vercel** | CI/CD pipeline — auto-deploys on every push |

---

## 🏗️ Project Structure

```
src/
├── context/
│   └── PlannerContext.jsx   # Global state — useReducer + Context API
├── data/
│   └── defaults.js          # All default schedule blocks, health items, certs
├── pages/
│   ├── Today.jsx            # Daily schedule + streak tracker
│   ├── Goals.jsx            # Life goals by category
│   ├── Certs.jsx            # Certification progress tracker
│   ├── Art.jsx              # Weekly creative sessions
│   ├── Health.jsx           # Daily health habits
│   └── Setup.jsx            # Firebase onboarding screen
├── components/
│   ├── Header.jsx           # Sticky header + tab nav + sync dot
│   ├── BottomNav.jsx        # Mobile bottom navigation bar
│   └── Modal.jsx            # Reusable add-item bottom sheet modal
├── firebase.js              # Firebase init, read, write, realtime subscribe
├── tracker.js               # Anonymous usage counter (no personal data stored)
├── App.jsx                  # Root — routing, layout, FAB, sync flash
├── main.jsx                 # React entry point
└── index.css                # Global CSS with custom properties
```

---

## ⚛️ React Concepts Demonstrated

This project was built to demonstrate real-world React patterns used in professional codebases:

### State Management — `useReducer` + Context
Instead of `useState` scattered across components, all state lives in a single reducer with typed actions:

```jsx
// PlannerContext.jsx
function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_BLOCK':  return { ...state, daily: { ...state.daily, [TODAY]: { ...day, [action.id]: !day[action.id] } } }
    case 'DELETE_CERT':   const { [action.id]: _, ...rest } = state.certs; return { ...state, certs: rest }
    case 'ADD_GOAL':      return { ...state, goals: { ...state.goals, [action.cat]: [...items, action.item] } }
    // 15 action types total
  }
}
```

This is the same pattern as Redux — just without the library overhead.

### Component Composition
Each page is a self-contained component. Shared UI (Modal, Header, BottomNav) are extracted into `/components` and reused across pages without duplication.

### Side Effects — `useEffect`
Used for: Firebase auto-connect on mount, real-time subscription cleanup, header clock tick, FAB event listener registration/cleanup.

```jsx
// Proper cleanup prevents memory leaks
useEffect(() => {
  const handler = () => setShowModal(true)
  window.addEventListener('fab-click', handler)
  return () => window.removeEventListener('fab-click', handler) // cleanup
}, [])
```

### Derived State
Progress percentage, streak count, and visible items (after filtering hidden[]) are all computed from state — never stored separately. One source of truth.

---

## 🔥 Firebase Architecture

All user data is stored in the user's **own** Firebase project — the app never sees anyone else's data:

```
myplanner/data  →  {
  daily:   { "2026-04-07": { b1: true, b3: true, custom: [...] } },
  health:  { "2026-04-07": { h0: true, h3: true } },
  certs:   { ga: { pct: 40, ms: { 0: true } }, meta: { pct: 0 } },
  goals:   { career: [...], life: [...], personal: [...] },
  art:     { "2026-03-31": [{ id, emoji, title, done }] },
  streak:  { days: { "2026-04-07": true } },
  hidden:  { blocks: ["b4"], health: [], certs: [] }
}
```

**Why `setDoc` without `merge: true`?**
Firebase's `merge: true` never removes existing keys — it only adds or updates. Deletions require a full overwrite. This was a real bug found during testing and fixed in v2.

---

## 📊 Anonymous Usage Tracking

The app includes an opt-in anonymous counter in `tracker.js` that records:
- **Total installs** — how many devices have ever opened the app
- **Daily active users** — how many unique devices open it per day

**What it does NOT store:** names, emails, IP addresses, device info, or any identifiable data. Each device gets a random anonymous ID stored only on that device. The counter lives in a separate Firebase project controlled by the developer.

This is GDPR-safe by design — no personal data is collected or transmitted.

---

## 🔄 Version History

| Version | Changes |
|---|---|
| **v1** | Vanilla JS single-file app with Firebase |
| **v2** | Bug fixes: cert deletion (Firebase merge issue), dynamic rendering, hidden[] array |
| **v3 (this)** | Full React refactor — components, useReducer, Context API, Vite, PWA plugin |

---

## 🚀 Getting Started

```bash
# Clone and install
git clone https://github.com/yourusername/my-planner-react.git
cd my-planner-react
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

### Setting Up Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project → **Firestore Database** → Create → Test mode
3. **Project Settings → Web app** (`</>`) → Register → copy `apiKey`, `projectId`, `appId`
4. Open the app → enter your 3 values → **Connect & Start**

### Setting Up Usage Tracking (Optional)

1. Create a **second** Firebase project for tracking (e.g. `my-planner-tracker`)
2. Create a Firestore database in test mode
3. Open `src/tracker.js` and replace the `TRACKER_CONFIG` values with your tracker project's config
4. Deploy — that's it. View your counts in the Firebase console under the `stats/totals` document

### Deploy to Vercel

1. Push to GitHub → go to [vercel.com](https://vercel.com) → Import repo
2. Leave all settings default → Deploy
3. Open your Vercel URL on mobile → **Share → Add to Home Screen**

---

## 🗺️ Roadmap

- [ ] Firebase Authentication — tie data to an account, not a device
- [ ] TypeScript migration — type safety across components
- [ ] Unit tests with Vitest + React Testing Library
- [ ] Weekly review dashboard — charts, progress summaries
- [ ] React Native conversion — publish to App Store and Google Play

---

## 🧠 What I Learned Building This

**v1 → v3 taught me:**
- The difference between `merge: true` and full overwrite in Firestore (found via a real production bug)
- Why `useReducer` scales better than `useState` once you have 10+ state updates
- How `useEffect` cleanup prevents memory leaks in real applications
- That dynamic JS rendering is always better than hardcoded HTML for anything that needs to be deletable
- How to design for privacy by default — anonymous tracking without collecting personal data

---

## 👩‍💻 About

Built by **Siri Meghana** — currently completing the **Google Data Analytics** and **Meta Front-End Developer** certifications on Coursera, while working as a Data Analysis and Events Assistant.

📬 [LinkedIn](https://linkedin.com) *(update this link)*

---

<p align="center">Built with focus, code, and calligraphy breaks ✍️</p>
