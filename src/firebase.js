import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBr4x9xa1_6BFKlxyeeONLryHmdHTR_shI",
  authDomain: "smart-irrigation-a4e05.firebaseapp.com",
  projectId: "smart-irrigation-a4e05",
  storageBucket: "smart-irrigation-a4e05.firebasestorage.app",
  messagingSenderId: "155317506731",
  appId: "1:155317506731:web:15d754864d97c0012dddee",
  measurementId: "G-T4V2Y7YT61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);