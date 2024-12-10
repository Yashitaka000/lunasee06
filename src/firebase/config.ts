import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC4AKUojORSGgBgInZyapueb9N5xOgxdEI",
  authDomain: "lunasee-3b60d.firebaseapp.com",
  projectId: "lunasee-3b60d",
  storageBucket: "lunasee-3b60d.appspot.com",
  messagingSenderId: "347482256297",
  appId: "1:347482256297:web:ee8bf8c3e15bff0e58cab8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

if (import.meta.env.VITE_EMULATE_FIREBASE === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

export { app };