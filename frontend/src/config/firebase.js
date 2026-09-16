import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  onIdTokenChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOlhKTdVbe0flyuNBVoo4KuHuW_9j-AUg",
  authDomain: "kkn-trader.firebaseapp.com",
  projectId: "kkn-trader",
  storageBucket: "kkn-trader.firebasestorage.app",
  messagingSenderId: "754222797670",
  appId: "1:754222797670:web:2c41fd03654c45fc5c6ea7",
  measurementId: "G-26KYEMCHFB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Guarantee browser local persistence so authentication persists after page reloads
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('[Firebase Auth Persistence Warning]:', err.message);
  });
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Analytics conditionally (only in supported browser environments)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported or blocked, ignore
  });
}

export { 
  app, 
  auth, 
  googleProvider, 
  analytics,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  onIdTokenChanged,
  setPersistence,
  browserLocalPersistence
};

