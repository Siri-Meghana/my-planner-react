/**
 * tracker.js — Anonymous usage counter
 *
 * Tracks ONLY:
 *   - Total unique installs (lifetime count)
 *   - Daily active users (count per day, no identity)
 *
 * Does NOT store: names, emails, IPs, device info, or any personal data.
 * Each user is identified only by a random anonymous ID generated on first visit
 * and stored locally on their device. It cannot be traced back to them.
 *
 * This counter lives in the developer's (your) own Firebase project — separate
 * from each user's personal planner data.
 */

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore'

// ── YOUR TRACKER FIREBASE CONFIG ──
// Create a second free Firebase project at console.firebase.google.com
// Name it something like "my-planner-tracker"
// Replace these values with your tracker project's config
const TRACKER_CONFIG = {
  apiKey: "AIzaSyD6yrYOlPFKYPOlEsf44cu6ahunIk8FvWQ",
  authDomain: "my-planner-tracker.firebaseapp.com",
  projectId: "my-planner-tracker",
  storageBucket: "my-planner-tracker.firebasestorage.app",
  messagingSenderId: "530017281514",
  appId: "1:530017281514:web:7db086d969413e45fe3e93"
}

// ── ANONYMOUS USER ID ──
// Generated once per device, stored in localStorage.
// It's just a random string — not linked to any identity.
function getAnonId() {
  const KEY = 'mp_anon_id'
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(KEY, id)
  }
  return id
}

let trackerDb = null

function getTrackerDb() {
  if (trackerDb) return trackerDb
  // Use a named app so it doesn't conflict with the user's own Firebase
  const existing = getApps().find(a => a.name === 'tracker')
  const app = existing || initializeApp(TRACKER_CONFIG, 'tracker')
  trackerDb = getFirestore(app)
  return trackerDb
}

/**
 * Called once when a user successfully connects their Firebase.
 * Records a new install if this device hasn't been seen before.
 */
export async function trackInstall() {
  if (TRACKER_CONFIG.apiKey.startsWith('REPLACE')) return // not configured yet
  try {
    const db    = getTrackerDb()
    const anonId = getAnonId()
    const TODAY  = new Date().toISOString().split('T')[0]

    // Check if this device has been counted before
    const userRef  = doc(db, 'users', anonId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      // First time — count as a new install
      await setDoc(userRef, {
        firstSeen: serverTimestamp(),
        lastSeen:  serverTimestamp(),
      })
      // Increment total installs counter
      const statsRef = doc(db, 'stats', 'totals')
      const statsSnap = await getDoc(statsRef)
      if (statsSnap.exists()) {
        await updateDoc(statsRef, { totalInstalls: increment(1) })
      } else {
        await setDoc(statsRef, { totalInstalls: 1, dailyActive: {} })
      }
    } else {
      // Returning user — update lastSeen only
      await updateDoc(userRef, { lastSeen: serverTimestamp() })
    }

    // Always mark as active today (for daily active user count)
    const dailyRef  = doc(db, 'daily', TODAY)
    const dailySnap = await getDoc(dailyRef)
    const field     = anonId // use anon ID as field name — just to avoid double counting today

    if (!dailySnap.exists()) {
      await setDoc(dailyRef, { [field]: true, count: 1, date: TODAY })
    } else if (!dailySnap.data()[field]) {
      await updateDoc(dailyRef, { [field]: true, count: increment(1) })
    }

  } catch (e) {
    // Silently fail — tracking should never break the app
    console.warn('Tracker: silent fail', e.message)
  }
}

/**
 * Called on every app open (not just first install).
 * Updates lastSeen and daily active count.
 */
export async function trackOpen() {
  if (TRACKER_CONFIG.apiKey.startsWith('REPLACE')) return
  try {
    const db     = getTrackerDb()
    const anonId = getAnonId()
    const TODAY  = new Date().toISOString().split('T')[0]

    // Update lastSeen
    const userRef = doc(db, 'users', anonId)
    const snap    = await getDoc(userRef)
    if (snap.exists()) {
      await updateDoc(userRef, { lastSeen: serverTimestamp() })
    }

    // Daily active
    const dailyRef  = doc(db, 'daily', TODAY)
    const dailySnap = await getDoc(dailyRef)
    if (!dailySnap.exists()) {
      await setDoc(dailyRef, { [anonId]: true, count: 1, date: TODAY })
    } else if (!dailySnap.data()[anonId]) {
      await updateDoc(dailyRef, { [anonId]: true, count: increment(1) })
    }

  } catch (e) {
    console.warn('Tracker: silent fail', e.message)
  }
}
