import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXmHlukR1ShEOecuT8saT2uxmFgqaDEZ8",
  authDomain: "minor-project-ab294.firebaseapp.com",
  projectId: "minor-project-ab294",
  storageBucket: "minor-project-ab294.firebasestorage.app",
  messagingSenderId: "145346046148",
  appId: "1:145346046148:web:08688635a268369a410191",
  measurementId: "G-MYZWZ626KC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

export { analytics };
export default app;
