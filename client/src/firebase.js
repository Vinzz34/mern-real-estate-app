// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "mern-estate-192fb.firebaseapp.com",
  projectId: "mern-estate-192fb",
  storageBucket: "mern-estate-192fb.appspot.com",
  messagingSenderId: "180067820356",
  appId: "1:180067820356:web:399d8a102600bd7e8cad11"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);