import {
  FirebaseApp,
  Firestore,
  getAuth,
  getFirestore,
  initializeApp,
  signInWithEmailAndPassword,
} from "../deps.ts";
import { logger } from "./logger.ts";

let app: FirebaseApp;
let db: Firestore;
let initialized = false;

export const initFirebase = async () => {
  if (initialized) {
    console.warn("firebase already initialized!");
    return;
  }
  const firebaseConfig = {
    apiKey: Deno.env.get("PUBLIC_FIREBASE_API_KEY"),
    authDomain: Deno.env.get("PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: Deno.env.get("PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: Deno.env.get("PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: Deno.env.get("PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: Deno.env.get("PUBLIC_FIREBASE_APP_ID"),
    measurementId: Deno.env.get("PUBLIC_FIREBASE_MEASUREMENT_ID"),
  };
  app = initializeApp(firebaseConfig);

  initialized = true;
  logger.info("firebase init done");

  // Sign in with admin user
  const auth = getAuth(app);
  await signInWithEmailAndPassword(
    auth,
    Deno.env.get("FIREBASE_ADMIN_EMAIL") || "",
    Deno.env.get("FIREBASE_ADMIN_PASSWD") || "",
  );
  logger.info("sign in with admin account done");

  db = getFirestore(app);
  logger.info("db & firebase init done");
};

export const getDB = () => db;
export const getFirebaseApp = () => app;
