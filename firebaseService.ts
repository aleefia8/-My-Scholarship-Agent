import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * FIREBASE CONFIGURATION
 * Connected to project: my-scholarship-agent
 */
const firebaseConfig = {
  apiKey: "AIzaSyDIAN6NLcPHI2KuTw_8GORTYZ-4UlwWljg",
  authDomain: "my-scholarship-agent.firebaseapp.com",
  projectId: "my-scholarship-agent",
  storageBucket: "my-scholarship-agent.firebasestorage.app",
  messagingSenderId: "428176464659",
  appId: "1:428176464659:web:07af3bd53b73309d2458e6",
  measurementId: "G-GXVQHXLQ09"
};

// 1. Initialize Firebase App immediately
// Using the official Google-hosted ESM modules ensures that the core registry is shared.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Services immediately
// This ensures they register their components (like 'auth' and 'firestore') 
// with the app instance before any component tries to use them.
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const firebaseService = {
  isConfigured: () => !!firebaseConfig.apiKey,
  
  configSummary: () => ({
    projectId: firebaseConfig.projectId,
    isReady: !!app
  }),

  // Authentication
  loginWithGoogle: async () => {
    if (!auth) throw new Error("Firebase Auth is unavailable.");
    return signInWithPopup(auth, googleProvider);
  },
  
  logout: async () => {
    if (!auth) return;
    return signOut(auth);
  },
  
  onAuthChange: (callback: (user: any) => void) => {
    if (!auth) return () => {};
    return onAuthStateChanged(auth, callback);
  },

  // Database Operations (Syncing)
  saveUserData: async (uid: string, data: any) => {
    if (!db) {
      localStorage.setItem(`local_sync_${uid}`, JSON.stringify(data));
      return;
    }
    try {
      const userDoc = doc(db, "users", uid);
      await setDoc(userDoc, data, { merge: true });
    } catch (err) {
      console.warn("Cloud save failed, using local storage", err);
      localStorage.setItem(`local_sync_${uid}`, JSON.stringify(data));
    }
  },

  getUserData: async (uid: string) => {
    if (!db) {
      const local = localStorage.getItem(`local_sync_${uid}`);
      return local ? JSON.parse(local) : null;
    }
    try {
      const userDoc = doc(db, "users", uid);
      const snap = await getDoc(userDoc);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      const local = localStorage.getItem(`local_sync_${uid}`);
      return local ? JSON.parse(local) : null;
    }
  },

  // Real-time synchronization
  subscribeToUserData: (uid: string, callback: (data: any) => void) => {
    if (!db) return () => {};
    return onSnapshot(doc(db, "users", uid), (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  }
};