import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxKvcfZcIQy42hjIwbo8jominxkAW6-J0",

  authDomain: "visitor-management-syste-3f0f7.firebaseapp.com",

  projectId: "visitor-management-syste-3f0f7",

  storageBucket: "visitor-management-syste-3f0f7.appspot.com",

  messagingSenderId: "780917214141",

  appId: "1:780917214141:web:34bd993d8369b80a21e0d4",

  measurementId: "G-N86RVED2HQ",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
