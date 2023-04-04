import { type FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, type Auth, type AuthProvider, signInWithEmailAndPassword } from "firebase/auth";
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
import { redirect } from "@sveltejs/kit";

export let app: FirebaseApp
export let db: Firestore
export let auth: Auth
let initialized = false;

async function setToken(token: string, refreshToken: string) {
  await fetch('/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ token, refreshToken })
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
      await setToken(idToken.token, user.refreshToken)
    } else {
      await setToken("", "")
    }
    await invalidateAll();
  })

  initialized = true;
  console.log("firebase initialized")
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

  return await signInWithPopup(auth, provider)
}

export async function signInWithEmail(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutFirebase() {
  await signOut(getAuth(app))
  goto("/", {
    invalidateAll: true,
  });
}
