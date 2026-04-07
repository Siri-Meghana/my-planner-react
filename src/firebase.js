import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'

let db = null

export function initFirebase(config) {
  // Prevent duplicate app initialisation (React StrictMode runs effects twice)
  const app = getApps().length === 0 ? initializeApp(config) : getApp()
  db = getFirestore(app)
  return db
}

export async function loadData() {
  if (!db) throw new Error('Firebase not initialised')
  const snap = await getDoc(doc(db, 'myplanner', 'data'))
  return snap.exists() ? snap.data() : null
}

export async function saveData(state) {
  if (!db) throw new Error('Firebase not initialised')
  // Full overwrite — no merge — so deletions persist correctly
  await setDoc(doc(db, 'myplanner', 'data'), state)
}

export function subscribeToData(callback) {
  if (!db) throw new Error('Firebase not initialised')
  const unsub = onSnapshot(doc(db, 'myplanner', 'data'), snap => {
    if (snap.exists()) callback(snap.data())
  })
  return unsub // return unsubscribe function
}
