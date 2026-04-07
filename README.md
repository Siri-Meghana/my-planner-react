My Planner in React 📅
Your day. Your way.
> A Progressive Web App built with React + Vite to manage your daily schedule, track certifications, log creative activities, and monitor health habits — all synced to the cloud in real time and installable on your phone like a native app.
🌐 Live Demo: your-app.vercel.app  |  Built by: Siri Meghana
---
📸 Screenshots
> *(Add screenshots here after installing on your phone — one per tab)*
> ```html
> <p align="center">
>   <img src="screenshots/Image(12).png"  width="220" alt="Today">
>   <img src="screenshots/Image(13).png"  width="220" alt="Goals">
>   <img src="screenshots/Image(14).png"  width="220" alt="Certs">
> </p>
> ```
---
💡 What Is This App?
My Planner is a personal productivity app built to solve a real problem: managing career goals, creative hobbies, daily health habits, and a work schedule — all in one place, without the guilt of context-switching between them.
Every user connects their own free Firebase account — so your data is always private and belongs only to you. No sign-ups, no subscriptions, no shared servers.
---
✨ Features
Tab	What it does
📅 Today	Daily schedule with a progress ring, streak tracker, and custom goals
🌟 Goals	Life goals by category: Career, Certifications, Travel, Personal Growth
🎯 Certs	Certification tracker with progress bars and milestone chips
🎨 Art	Weekly creative session tracker
💚 Health	Daily health habits checklist
✅ Everything is deletable — default and custom items
✅ All data syncs in real time across your devices
✅ Works offline once installed
✅ Installs on your home screen like a native app — no app store needed
---
🚀 Getting Started — Complete Setup Guide
Follow these steps in order. It takes about 10 minutes the first time.
---
Step 1 — Get the App Running
You have two options:
Option A — Use the live hosted version (easiest)
Just open the live demo link at the top of this page in your browser. Skip to Step 2.
Option B — Run it yourself locally
```bash
git clone https://github.com/yourusername/my-planner-react-tracker.git
cd my-planner-react-tracker
npm install
npm run dev
```
Then open `http://localhost:5173` in your browser.
---
Step 2 — Create Your Free Firebase Project
Firebase is Google's free cloud database. You need your own project so your data is private to you.
> 💡 **Why do I need my own Firebase?**
> Unlike most apps that store everyone's data on one server, My Planner gives each user their own private database. Nobody — not even the developer — can see your data.
Follow these steps carefully:
2a. Go to Firebase Console
Open console.firebase.google.com in your browser
Sign in with your Google account
2b. Create a New Project
Click the "Add project" button
Type a name — e.g. `my-planner` (can be anything)
On the next screen, you'll see a toggle for Google Analytics — you can leave it on or turn it off, it does not matter either way
Click "Create project"
Wait about 10 seconds for it to set up, then click "Continue"
You should now see your project dashboard — it says "Hello, [your name]! Welcome to your Firebase project!"
2c. Create Your Database
This is where your planner data will be stored.
In the left sidebar, hover over the icons until you see it expand — look for "Build" and click it to expand
Click "Firestore Database"
Click the "Create database" button
A dialog appears — select "Start in test mode" (this allows the app to read and write your data)
Click "Next"
Choose a location — the default (`nam5` United States) is perfectly fine
Click "Enable"
Wait a few seconds while it sets up
✅ Your database is ready.
2d. Register Your App and Get Your Config Keys
Now you need to tell Firebase about your web app so it gives you the connection keys.
Click the gear icon ⚙️ in the top-left sidebar (next to "Project Overview")
Click "Project settings"
Scroll down to the "Your apps" section
You will see a row of icons — click the web icon `</>` (it looks like HTML angle brackets)
In the "App nickname" field, type anything — e.g. `my-planner-web`
Leave the "Firebase Hosting" checkbox unchecked (you are using Vercel instead)
Click "Register app"
You will now see a code block that looks like this:
```js
const firebaseConfig = {
  apiKey: "AIzaSyABC123...",
  authDomain: "my-planner-abc.firebaseapp.com",
  projectId: "my-planner-abc",
  storageBucket: "my-planner-abc.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```
You need three values from this:
`apiKey`
`projectId`
`appId`
📋 Copy these three values somewhere — you will need them in Step 3.
Click "Continue to console" — you are done with Firebase setup.
---
Step 3 — Connect Firebase to the App
Open the app in your browser (either the live URL or your local `localhost:5173`)
You will see the setup screen asking for your Firebase values
Paste in your three values:
apiKey — paste the long string starting with `AIzaSy...`
projectId — paste your project ID (e.g. `my-planner-abc`)
appId — paste the full app ID string
Click "Connect & Start My Planner →"
If everything is correct, the app will load and show your empty planner. The small dot in the top-right corner will turn green — this means you are connected and syncing. ✅
> ⚠️ **Getting an error?** Double-check that you copied the values correctly with no extra spaces. The `apiKey` should start with `AIzaSy`. The `projectId` should match the name you gave your project.
---
Step 4 — Install on Your Phone (Optional but Recommended)
Once the app is working in your browser, you can install it on your home screen so it opens like a real app — no browser bar, works offline.
On iPhone (must use Safari):
Open your app URL in Safari — Chrome will not show the install option on iPhone
Tap the Share button at the bottom of the screen (the box with an arrow pointing up)
Scroll down in the share sheet and tap "Add to Home Screen"
Change the name to `My Planner` if you like
Tap "Add" in the top right
On Android (use Chrome):
Open your app URL in Chrome
Tap the three dots menu (top right)
Tap "Add to Home Screen" or "Install App"
Tap "Add"
Your app icon will now appear on your home screen. Tap it to open — it looks and feels exactly like a native app. 🎉
---
Step 5 — Set Up Usage Tracking (For Developers Only)
> ⚠️ **This step is only for the person hosting this app.** Regular users can skip this entirely.
The app includes an anonymous counter in `src/tracker.js` that records how many people are using it — no personal data, just a number. To activate it:
Create a second Firebase project at console.firebase.google.com — name it `my-planner-tracker`
Create a Firestore database in test mode (same steps as above)
Register a web app and copy the config values
Open `src/tracker.js` in your code editor
Replace all the `REPLACE_WITH_...` placeholder values with your tracker project's config
Save, commit, and push to GitHub — Vercel will redeploy automatically
Where to view your user count:
Go to your tracker Firebase project → Firestore Database
Open the `stats` collection → `totals` document
You will see `totalInstalls` — this is your lifetime user count
The `daily` collection shows how many users opened the app each day
---
🛠️ Tech Stack
Technology	Purpose
React 19	UI library — component-based architecture
Vite	Build tool — fast development, optimised production builds
useReducer + Context API	Global state management (same pattern as Redux, no library needed)
Firebase Firestore	Real-time cloud NoSQL database — one per user
vite-plugin-pwa	Makes the app installable on mobile, offline-capable
CSS Custom Properties	Theming without a CSS framework
GitHub + Vercel	CI/CD pipeline — auto-deploys on every push to main
---
🏗️ Project Structure
```
my-planner-react-tracker/
├── src/
│   ├── context/
│   │   └── PlannerContext.jsx   # Global state — useReducer + Context API
│   ├── data/
│   │   └── defaults.js          # All default schedule, health, cert data
│   ├── pages/
│   │   ├── Today.jsx            # Daily schedule + streak tracker
│   │   ├── Goals.jsx            # Life goals by category
│   │   ├── Certs.jsx            # Certification progress tracker
│   │   ├── Art.jsx              # Weekly creative sessions
│   │   ├── Health.jsx           # Daily health habits
│   │   └── Setup.jsx            # Firebase onboarding screen
│   ├── components/
│   │   ├── Header.jsx           # Sticky header, tab nav, sync dot
│   │   ├── BottomNav.jsx        # Mobile bottom navigation
│   │   └── Modal.jsx            # Reusable add-item bottom sheet
│   ├── firebase.js              # Firebase init, read, write, subscribe
│   ├── tracker.js               # Anonymous usage counter
│   ├── App.jsx                  # Root — routing, layout, FAB
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles with CSS custom properties
├── index.html                   # HTML entry point with PWA meta tags
├── vite.config.js               # Vite + PWA plugin config
└── package.json
```
---
⚛️ React Concepts Used
```jsx
// useReducer — predictable state with typed actions
function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_BLOCK': return { ...state, daily: { ...state.daily, [TODAY]: { ...day, [id]: !day[id] } } }
    case 'DELETE_CERT':  const { [id]: _, ...rest } = state.certs; return { ...state, certs: rest }
    case 'ADD_GOAL':     return { ...state, goals: { ...state.goals, [cat]: [...items, newItem] } }
    // 15 action types total
  }
}

// useEffect with proper cleanup — prevents memory leaks
useEffect(() => {
  const handler = () => setShowModal(true)
  window.addEventListener('fab-click', handler)
  return () => window.removeEventListener('fab-click', handler)
}, [])
```
---
🔥 Why Full Overwrite Instead of Merge in Firebase
```js
// ❌ merge: true — never deletes existing keys, only adds/updates
await setDoc(doc(db, 'myplanner', 'data'), S, { merge: true })

// ✅ Full overwrite — deletions actually persist
await setDoc(doc(db, 'myplanner', 'data'), S)
```
This was a real bug found during testing: deleted items reappeared after reopening the app because `merge: true` kept the old data in Firebase. Switching to a full overwrite fixed it.
---
🔒 Privacy
Each user's data lives in their own Firebase project — completely isolated
The anonymous tracker records only a count — no names, emails, or IP addresses
Each device gets a random ID like `u_x7k2m` stored only on that device
Fully GDPR-safe by design
---
🗺️ Roadmap
[ ] Firebase Authentication — tie data to an account, not just a device
[ ] TypeScript — type safety across all components
[ ] Unit tests with Vitest + React Testing Library
[ ] Weekly review dashboard with charts
[ ] React Native version — publish to App Store and Google Play
---
🤝 Contributing
Feel free to fork this project and make it your own. If you find a bug or have a suggestion, open an issue on GitHub.
---
👩‍💻 About
Built by Siri Meghana — building things one component at a time.
---
<p align="center">
  Built with React, Firebase, and calligraphy breaks ✍️
  <br/>
  <sub>If this helped you — give it a ⭐ on GitHub</sub>
</p>
