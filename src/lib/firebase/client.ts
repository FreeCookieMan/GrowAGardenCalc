
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
    console.error("Firebase initialization error:", error);
    console.warn(
        "Firebase initialization failed. This often means your Firebase project configuration in .env.local is missing, incomplete, or incorrect. " +
        "Please ensure all NEXT_PUBLIC_FIREBASE_... variables (API_KEY, AUTH_DOMAIN, PROJECT_ID, etc.) are correctly set in your .env.local file and that you have restarted your development server."
    );
    // Fallback to a mock/dummy app if initialization fails
    app = {
        name: 'mock',
        options: {},
        automaticDataCollectionEnabled: false,
        toJSON: () => ({})
    } as unknown as FirebaseApp; 
    auth = {
        currentUser: null,
        onAuthStateChanged: () => (() => {}),
    } as unknown as Auth; 

     if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      console.warn(
        "Specifically, the Firebase API key (NEXT_PUBLIC_FIREBASE_API_KEY) appears to be missing from your environment variables. Check your .env.local file."
      );
    }
  }
} else {
  app = getApps()[0]!;
  auth = getAuth(app);
}


export { app, auth };
