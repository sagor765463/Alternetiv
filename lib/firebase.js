import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHyqwdROZch0_YQI_oLzxIhQeTMWa9B3o",
  authDomain: "finex-corp.firebaseapp.com",
  databaseURL: "https://finex-corp-default-rtdb.firebaseio.com",
  projectId: "finex-corp",
  storageBucket: "finex-corp.firebasestorage.app",
  messagingSenderId: "688816669548",
  appId: "1:688816669548:web:f3b63e02359bbf3c19e949",
  measurementId: "G-LKD3JCGGNX"
};

// Initialize Firebase (prevent re-initialization error in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
