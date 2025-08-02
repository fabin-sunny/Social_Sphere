import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDkTqcDUy9wvj4sQUJYBEd1h0iyyRZTcjs",
  authDomain: "minilin-508e4.firebaseapp.com",
  projectId: "minilin-508e4",
  storageBucket: "minilin-508e4.firebasestorage.app",
  messagingSenderId: "956139591240",
  appId: "1:956139591240:web:e15aa2b675c94dbf896a7d",
  measurementId: "G-F4QCQDVX1Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Network status management
export const goOnline = () => enableNetwork(db);
export const goOffline = () => disableNetwork(db);