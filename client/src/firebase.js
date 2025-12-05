// Central Firebase initialization for the portfolio app.
// This connects the client to my Firestore (cloud NoSQL DB).

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCa_gV2L28NrbnAG_8D-4VMioWr2hGfhv0",
  authDomain: "katrina-portfolio.firebaseapp.com",
  projectId: "katrina-portfolio",
  storageBucket: "katrina-portfolio.firebasestorage.app",
  messagingSenderId: "543273462034",
  appId: "1:543273462034:web:c24176185cb658c22f6bcb"
};

// Initialize Firebase once for the whole app
const app = initializeApp(firebaseConfig);

// Export Firestore instance so other modules can use it
export const db = getFirestore(app);

export default app;