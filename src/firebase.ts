import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDvweT9BMTjVj9rCTc1yN4q508CqkGNuMA",
  authDomain: "porfolio-f36d9.firebaseapp.com",
  projectId: "porfolio-f36d9",
  storageBucket: "porfolio-f36d9.firebasestorage.app",
  messagingSenderId: "669468170430",
  appId: "1:669468170430:web:20e991cce763c574b266ef",
  measurementId: "G-6XF5WS4VTW"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)