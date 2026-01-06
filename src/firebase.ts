import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDvweT9BMTjVj9rCTc1yN4q508CqkGNuMA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "porfolio-f36d9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "porfolio-f36d9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "porfolio-f36d9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "669468170430",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:669468170430:web:20e991cce763c574b266ef",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6XF5WS4VTW"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)