import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  serverTimestamp as getServerTimeStamp,
  getFirestore,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const firebaseApp = initializeApp({ ...config })

const auth = getAuth(firebaseApp)
auth.languageCode = 'ja'

const db = getFirestore(firebaseApp)
const serverTimestamp = getServerTimeStamp()

const storage = getStorage(firebaseApp)

export { auth, db, serverTimestamp, storage }
