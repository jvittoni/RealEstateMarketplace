// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-2c3f1.firebaseapp.com",
  projectId: "mern-estate-2c3f1",
  storageBucket: "mern-estate-2c3f1.firebasestorage.app",
  messagingSenderId: "424949984963",
  appId: "1:424949984963:web:24fb082ce3db1b36877c76"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);