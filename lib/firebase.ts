import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCYI_RcdhPOwC9WWAASO5S38MKquVbbZPo",
  authDomain: "web7trendzdata.firebaseapp.com",
  projectId: "web7trendzdata",
  storageBucket: "web7trendzdata.firebasestorage.app",
  messagingSenderId: "297864405914",
  appId: "1:297864405914:web:3f585fdf7bd13c4df69023",
  measurementId: "G-FTY8H8RQC8",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
