
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization error", error);
    // Fallback to a mock/dummy app if initialization fails
    // This is primarily for environments where env vars might not be set (like some test runners or Storybook)
    // but in a real app, you'd want to ensure Firebase initializes correctly.
    app = {
        name: 'mock',
        options: {},
        automaticDataCollectionEnabled: false,
        toJSON: () => ({})
    } as unknown as FirebaseApp; // Type assertion for mock
    auth = {
        currentUser: null,
        onAuthStateChanged: () => (() => {}),
        // Add other mock methods as needed if used directly before proper init
    } as unknown as Auth; // Type assertion for mock
     if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      console.warn(
        "Firebase API key is missing. Please check your .env.local file and ensure NEXT_PUBLIC_FIREBASE_API_KEY is set."
      );
    }
  }
} else {
  app = getApps()[0]!;
  auth = getAuth(app);
}


export { app, auth };
