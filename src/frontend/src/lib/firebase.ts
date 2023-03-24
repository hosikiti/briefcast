import { type FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, type Auth, type AuthProvider } from "firebase/auth";
import {
  PUBLIC_FIREBASE_API_KEY,
  PUBLIC_FIREBASE_APP_ID,
  PUBLIC_FIREBASE_AUTH_DOMAIN,
  PUBLIC_FIREBASE_MEASUREMENT_ID,
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  PUBLIC_FIREBASE_PROJECT_ID,
  PUBLIC_FIREBASE_STORAGE_BUCKET,
} from "$env/static/public";
import { browser } from "$app/environment";
import { goto, invalidateAll } from "$app/navigation";

export let app: FirebaseApp
export let db: Firestore
export let auth: Auth
let initialized = false;

async function setToken(token: string) {
  await fetch('/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ token })
  })
}

export function initializeFirebase() {
  if (initialized || !browser) {
    return;
  }
  const firebaseConfig = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
    measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const idToken = await user.getIdTokenResult()
      setToken(idToken.token)
    } else {
      setToken("")
    }
    await invalidateAll();
  })

  initialized = true;
};

export async function signInFirebase(method: "google") {
  let provider: AuthProvider;
  switch (method) {
    case "google":
      provider = new GoogleAuthProvider()
      break;
    default:
      throw `unknown provider: ${method}`
  }

  await signInWithPopup(auth, provider)
  location.reload();
}

export async function signOutFirebase() {
  await signOut(getAuth(app))
  location.reload();
}
